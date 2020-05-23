import Docker from "dockerode";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const STREAM_LIMIT = 1000;

function StreamToStr(onError) {
    /* Little widget to pipe the container streams to string */
    if (!onError) onError = () => process.exit(1);

    const Writable = require("stream").Writable;
    const StringDecoder = require("string_decoder").StringDecoder;
    const decoder = new StringDecoder("utf8");

    this.str = "";
    this.stream = new Writable();
    this.stream._write = (doc, _, next) => {
        this.str += decoder.write(doc);
        this.str += "\n";
        if (this.str.length >= STREAM_LIMIT) {
            this.str = this.str.substr(0, STREAM_LIMIT);
            // Call our on-error func
            onError();
        } else {
            next();
        }
    };
    return this;
}


const states = { // A fake enum
    NOT_CREATED: -1,
    CREATED: 0,
    RUNNING: 1,
    COMPLETED: 2,
    TIMED_OUT: 3,
    OVERRUN: 4
};

class Xyz {
    constructor(client, imgName) {
        this.state = states.NOT_CREATED;
        this.client = client;
        this.imgName = imgName;
        this.container = null;
        this.exec = null;
        this.result = null;
        this.stdout = new StreamToStr(this.onOverRun);
        this.stderr = new StreamToStr(this.onOverRun);
        this.initialized = this.init();
    }

    init = async () => {
        await this.createContainer();
        return true;
    };
    createContainer = async () => {
        this.container = await this.client.createContainer({
            Image: this.imgName,
            Tty: true,
            Cmd: ['sh'],
            Memory: 128 * 1024 * 1024,
        });
        await this.container.start({});
        this.state = states.READY;
    };
    run = async (cmd) => {
        await this.initialized;

        this.exec = await this.container.exec({
            Cmd: cmd,
            AttachStdout: true,
            AttachStderr: true,
        });

        let i;
        this.state = states.RUNNING;
        try {
            // Finally, kick things off!  Race between execution and time-out.
            await Promise.race([this._run(), this.timeout()]);
            i = await this.container.inspect();
        } catch (e) {
            console.error(e);
        } finally {
            // No matter what happens while running, remove the container
            this.close(); // Runs asynchronously (and often, slowly)
        }

        const data = await this.exec.inspect();
        let returnCode = data.ExitCode;

        if (this.state === states.TIMED_OUT) { // For some reason this seems to be zero after time-outs, sometimes.
            this.stderr.str = 'Klass.Live: Failed - Running Too Long\n\n' + stderr.str;
            returnCode = 137;
        } else if (this.state === states.OVERRUN) {
            this.stderr.str = `Klass.Live: Failed - Too Much Console Output\n\n` + stderr.str;
            returnCode = 137;
        } else if (data.ExitCode === 137) {
            this.stderr.str = 'Klass.Live: Failed - Using Too Much Memory\n\n' + stderr.str;
            returnCode = 137;
        }
        this.result = {stdout: this.stdout.str, stderr: this.stderr.str, returnCode};

    };
    _run = async () => {
        /* Actual execution in here! */
        let _this = this;
        await this.exec.start(function (err, stream) {
            if (err) {
                console.error(err);
                throw err;
            }
            _this.container.modem.demuxStream(
                stream, _this.stdout.stream, _this.stderr.stream
            );
        });

        let data = await this.exec.inspect();
        while (!data || data.ExitCode === null || data.Running) {
            await sleep(100);
            data = await this.exec.inspect();
        }
        if (this.state === states.RUNNING) {
            this.state = states.COMPLETED;
        }
    };
    timeout = async () => {
        // Sadly it seems we have to do this for ourselves.
        // Sleep through the time-out
        await new Promise(resolve => setTimeout(resolve, 5000));
        if (this.state !== states.RUNNING) return;
        return this.kill(states.TIMED_OUT);
    };
    close = async () => {
        // await this.container.stop();
        await this.container.kill();
        await this.container.remove();
    };
    kill = async (reason) => {
        /* Kill our active container, generally due to some error.
         * Argument `reason` is, more or less, the next state. */
        if (this.state !== states.RUNNING) return;
        try {
            await this.container.kill();
        } catch (e) {
            if (e.message.includes("Cannot kill container") &&
                e.message.includes("not running")) {
                // Seems that sometimes containers finish while we were trying to kill them
                // When that happens, take their completed result.
                return;
            } else {
                console.error(e);
                throw e;
            }
        }
        switch (reason) {
            case states.TIMED_OUT:
            case states.OVERRUN:
                this.state = reason;
                return;
            default:
                console.error(`Invalid reason for Killing Container: ${reason}`);
        }
    };
    onOverRun = () => {
        this.kill(states.OVERRUN);
    };
}

const run_flat = async (docker) => {

    const imageExists = async imgName => {
        const imgs = await docker.listImages(
            {filters: {reference: [imgName]}}
        );
        return (imgs.length > 0);
    };

    const imgs = await docker.listImages(
        {filters: {reference: ['python:3.7-alpine']}}
    );
    console.log(imgs);

    const bustedImage = docker.getImage("busted");
    console.log(bustedImage);

    let container = await docker.createContainer({
        Image: 'python:3.7-alpine',
        Tty: true,
        Cmd: ['sh'],
        Memory: 128 * 1024 * 1024,
    });
    await container.start({});

    var options = {
        Cmd: ['python', '-c', 's = "a" * 1000 * 1000 * 1000'],
        AttachStdout: true,
        AttachStderr: true,
    };

    let stdout = new StreamToStr();
    let stderr = new StreamToStr();

    const exec = await container.exec(options);
    await exec.start(function (err, stream) {
        if (err) {
            console.error(err);
            throw err;
        }

        container.modem.demuxStream(stream, stdout.stream, stderr.stream);
    });

    console.log('exec started, inspecting');
    let data = await exec.inspect();
    console.log(data);
    while (!data || data.ExitCode === null || data.Running) {
        console.log('waiting...');
        await sleep(100);
        data = await exec.inspect();
        // console.log(data);
    }
    // await exec.wait();
    // console.log(stream);
    // container.modem.demuxStream(stream, process.stdout, process.stderr);

    console.log(data);
    // const i = await container.inspect();
    // console.log(i.State);


    console.log("exec done");

    if (data.ExitCode === 137) {
        stderr.str = 'Klass.Live: Failed - Using Too Much Memory\n\n' + stderr.str;
    }

    console.log("stds:");
    console.log(stdout.str);
    console.log(stderr.str);

    const close = async container => {
        await container.kill();
        await container.remove();
    };

    close(container);

    console.log("end of stuff");
};
const run = async () => {
    var docker = await new Docker();

    const xyz = new Xyz(docker, "python:3.7-alpine");
    await xyz.run(['python', '-c', 'print("FROM_PYTHON")']);
    const {result} = xyz;
    console.log("stds:");
    console.log(result.stdout);
    console.log(result.stderr);

    return 'DONE!!!';
};

run().then(d => console.log(d));
