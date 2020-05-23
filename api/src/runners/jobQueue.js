import EventEmitter from "events";


let pendingJobs = [];
const runnerStates = { // A Fake Enum
    IDLE: 0,
    RUNNING: 1
};

class Runner {
    constructor(n) {
        this.n = n;
        this.state = runnerStates.IDLE;
    }

    async run(q, job) {
        /* Apply function `q.f` to job-data `job` */
        this.state = runnerStates.RUNNING;
        await q.f(job);
        this.state = runnerStates.IDLE;
        q.jobNotifier.emit('JOB_DONE');
    }
}

const NUM_RUNNERS = 4;
let runners = [];
for (const n of Array(NUM_RUNNERS).keys()) {
    runners.push(new Runner(n));
}

export default class JobQueue {
    constructor(f) {
        this.f = f;
        this.jobNotifier = new EventEmitter();
        this.jobNotifier.on('PENDING_JOB', this.checkAndRun);
        this.jobNotifier.on('JOB_DONE', this.checkAndRun);
    }

    addJob = (job) => {
        pendingJobs.push(job);
        this.jobNotifier.emit('PENDING_JOB');
    };
    checkAndRun = async () => {
        /* Check for an available job and runner,
         * and if there is such a combination, run it! */

        if (!pendingJobs.length) return;
        const runner = runners.find(r => r.state === runnerStates.IDLE);
        if (!runner) return;

        console.log("JOB EXECR RUNNING");
        console.log(runner);
        console.log(`JOBS PENDING: ${pendingJobs.length}`);

        let job = pendingJobs.shift();
        await runner.run(this, job);
    };
}
