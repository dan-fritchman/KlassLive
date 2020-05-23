import JobQueue from "./jobQueue";
import {models} from "../db/models";
import {executor} from "./config" ;


const getCode = async submission => {
    /* Get the code to run for `submission`. Combines `klass` and `source` fields. */
    const {klass, source, problem_num} = submission;

    const pastProblems = klass.problems.slice(0, problem_num);
    const activeProblem = klass.problems[problem_num];
    if (!activeProblem) throw new Error("Error Finding Active Problem");

    // Grab source-string from a list of cells
    const getSource = cells => cells
        .filter(cell => cell.cell_type === "code")
        .map(cell => cell.source)
        .join("\n");
    // For past problems, use the setup & solution
    const getPastProblemCode = prob => getSource([...prob.setup, prob.solution]);

    // Collect up code from past problems
    let cells = pastProblems.map(getPastProblemCode);
    // And from the active problem
    cells = cells.concat(getSource(activeProblem.setup));
    cells = cells.concat(source);
    cells = cells.concat(getSource([activeProblem.tests]));

    // Gather this all into one string
    let sourceStr = cells.join("\n");
    // FIXME: more real special-character replacement
    sourceStr = sourceStr.replace("\'", "'");
    return sourceStr;
};

const baseRuntimes = {
    python: {
        lang: 'python',
        cmd: code => ["python", "-c", code],
        img: {
            name: 'python',
            version: '3.7-alpine',
        },
    },
    scala: {
        lang: 'scala',
        cmd: code => ["scala", "-e", code],
        img: {
            name: 'hseeberger/scala-sbt',
            version: '8u222_1.3.3_2.13.1',
        },
    },
};

const defaultRuntime = baseRuntimes.python;

const getRunTime = klass => {
    let {runtime} = klass;
    // If nothing valid specified, use the defaults
    if (!runtime || !runtime.lang) return defaultRuntime;

    // Sadly `img` values of `null` in the DB come back at empty-objects `{}`.
    // So do this little bit of merging.
    const baseRuntime = baseRuntimes[runtime.lang];
    let img = (runtime.img && runtime.img.name) ? runtime.img : baseRuntime.img;
    if (!img.version) img.version = baseRuntime.img.version;
    return {
        ...baseRuntime,
        img
    };
};

const launch = async (submission) => {
    await submission;
    submission.evaluated_at = new Date();
    console.log(`QUEUE TIME: ${(submission.evaluated_at - submission.created_at) / 1000}`);

    try {
        // Extract the target RunTime
        const runtime = getRunTime(submission.klass);
        // And put together the code
        const klassCode = await getCode(submission);

        const hrstart = process.hrtime();
        const {stdout, stderr, returnCode} = await executor.run(klassCode, runtime);
        const hrtime = process.hrtime(hrstart);

        console.log(`Execution Complete in ${((hrtime[0] * 1e9) + hrtime[1]) / 1e6} ms`);

        submission.state = "COMPLETE";
        submission.score = (returnCode === 0) ? 1 : 0; // FIXME
        submission.output = stdout;
        submission.errs = stderr;
        submission.evaluation = {
            hrstart: {s: hrstart[0], ns: hrstart[1]},
            hrtime: {s: hrtime[0], ns: hrtime[1]},
        }
    } catch (e) {
        console.error(e);

        submission.state = "COMPLETE";
        submission.score = 0;
        submission.output = "";
        submission.errs = `Server Error: ${e}`;

    } finally {
        if (submission.user_session_id) await updateScore(submission);
        await submission.save();
    }
    return submission;
};

const updateScore = async submission => {
    /* Update UserSession scores in the DB, based on `submission` */

    const {user_session_id, problem_num, score: submissionScore} = await submission;
    let user_session = await models.user_sessions.findById(user_session_id);

    // Check for un-initialized scores
    if (!user_session.scores) user_session.scores = {problems: [], total: 0};
    if (!user_session.scores.total) user_session.scores.total = 0;
    let {scores} = user_session;

    // Clear up null/ NaN, here I guess
    scores.problems = scores.problems.map(score => {
        if (!score) return 0;
        return score;
    });
    // Take the new problem-score to be the *max* of this and past entries
    if (!scores.problems[problem_num] || submissionScore >= scores.problems[problem_num]) {
        // Note this ".set" is necessary for Mongo to notice the intra-array change!
        scores.problems.set(problem_num, submissionScore);
        user_session.response_ids.set(problem_num, submission);
    }
    // Sum up the new Session-score
    scores.total = scores.problems.reduce((a, b) => a + b, 0);

    await user_session.save();
    return user_session;
};

const jobQueue = new JobQueue(launch);

export default {
    run_and_grade: jobQueue.addJob,
    ready: executor.ready,
    valid: executor.valid, 
};

