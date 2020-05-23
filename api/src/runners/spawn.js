import {spawn} from "child_process";

export default async function spawnExecutor(code, runtime) {
    /* Execute code-string `code`. Python only for now. */

    let stdout = [];
    let stderr = [];

    const spawnPromise = async (...args) => {
        return new Promise(async resolve => {
            const process = spawn(...args);

            process.on("exit", (code, signal) => resolve(code));
            process.on("error", err => resolve(err));
            process.on("close", err => resolve(err));

            process.stdout.on("data", data => stdout.push(data));
            process.stderr.on("data", data => stderr.push(data));
        });
    };

    let args = "run --user 999 python:3.7 python -c".split(/\s/);
    args.push(code);
    const returnCode = await spawnPromise("docker", args);

    return {stdout: stdout.join("\n"), stderr: stderr.join("\n"), returnCode};
}
