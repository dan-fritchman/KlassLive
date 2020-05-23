import Docker from "dockerode";

// Select the container runtime: `runsc` for secured gVisor or `runc` for dev.
const runtimeOption = (process.env.NODE_ENV === 'dev') ? 'runc' : 'runsc';

const requiredImages = [
    "python:3.7-alpine",
    "klasslive/migen-intro:latest",
    "bigtruedata/scala:alpine",
    "hseeberger/scala-sbt:8u222_1.3.3_2.13.1",
];

class ContainerManager {
    /* Keep caches of ready-to-run containers */
    DEFAULT_QTY = 4;

    constructor(execr, imgNames, targetQtys) {
        this.execr = execr;
        this.imgNames = imgNames;
        this.targetQtys = targetQtys;
        this.caches = {};
        this.initialized = this.init();
    }

    init = async () => {
        /* Perform the async part of our "constructor"/ initialization */
        for (const imgName of this.imgNames) {
            // Make sure we have the image
            const img = await this.execr.getImage(imgName);
            // Set up our image-cache
            this.caches[imgName] = [];
            const qty = this.getQty(imgName);
            for (let i = 0; i < qty; i++) {
                this.caches[imgName].push(new ContainerExec(this.execr.client, imgName));
            }
        }
        return true;
    };
    getQty = imgName => this.targetQtys[imgName] || this.DEFAULT_QTY;
    pop = async imgName => {
        // If we have a cached container, pop-left and return it
        if (this.caches[imgName] && this.caches[imgName].length) return this.caches[imgName].shift();
        // If nothing available in cache, return a new one
        return new ContainerExec(this.execr.client, imgName);
    };
    replenish = async imgName => {
        const qty = this.getQty(imgName);
        if (this.caches[imgName].length < qty) {
            this.caches[imgName].push(new ContainerExec(this.execr.client, imgName));
        }
    };
}

class DockerExecutor {
    /*
     * Docker Executor
     *
     * A singleton that roughly corresponds to the manager of the Docker daemon/ socket.
     * Note instantiation of the `DockerExecutor` class *expects* the Docker run-time.
     * If the run-time is not present, it will *panic*.
     *
     * */
    constructor(createCache = true, killExisting = true) {
        this.imageCache = {};
        this.createCache = createCache;
        this.killExisting = killExisting;
        this.initialized = this.init(); // Promise(Boolean)
    }
    ready = () => this.initialized;
    valid = () => true;
    init = async () => {
        this.client = await new Docker();
        const info = await this.client.info();
        if (!info) {
            console.error("Could Not Connect to Docker");
            process.exit(1);
        }
        console.log(`Loading Required Docker Images: ${requiredImages}`);
        const imgPromises = requiredImages.map(this.getImage);
        await Promise.all(imgPromises);

        if (this.killExisting) {
            // Stop and remove all the containers of the images we use.
            // Keeps us from accumulating them across restart cycles.
            // Could backfire some day!
            const killAll = async () => {
                const ctrs = await this.client.listContainers();
                const ourCtrs = ctrs.filter(ctrInfo => requiredImages.includes(ctrInfo.Image));
                const killers = ourCtrs.map(async ctrInfo => {
                    console.log(`Killing Container ${ctrInfo.Id} of Image ${ctrInfo.Image}`);
                    const container = await this.client.getContainer(ctrInfo.Id);
                    await container.kill();
                    await container.remove();
                    return true;
                });
                return Promise.all(killers);
            };
            await killAll();
        }

        if (this.createCache) {
            // Set up our container-manager
            this.containerManager = new ContainerManager(this, requiredImages, {});
            await this.containerManager.initialized;
        }

        // And report success
        console.log("Initialized Docker Client");
        return true;
    };
    imageExists = async imgName => {
        /* Boolean indication of whether image `imgName` exists on-disk. */
        const imgs = await this.client.listImages(
            {filters: {reference: [imgName]}}
        );
        return imgs && (imgs.length > 0);
    };
    getImage = async (imgName, pull = true) => {
        /* Get Image `imgName`, pulling it if necessary */
        // First check our cache
        let img = this.imageCache[imgName];
        if (img) return img;

        // Check via Docker socket
        const exists = await this.imageExists(imgName);
        if (exists) {
            img = await this.client.getImage(imgName);
            this.imageCache[imgName] = img;
            return img;
        }

        if (!pull) throw new Error(`Could Not Load Required Docker Image ${imgName}`);
        // If not present, go and pull it
        console.log(`Pulling Image: ${imgName}`);
        let pullError = null;
        try {
            await this.pull(imgName);
        } catch (e) {
            pullError = e;
        }
        if (pullError || !this.imageExists(imgName)) {
            throw new Error(`Could Not Load Required Docker Image ${imgName}`);
        }
        img = await this.client.getImage(imgName);
        console.log(`Pulled Image: ${imgName}`);
        this.imageCache[imgName] = img;
        return img;
    };
    pull = imgName => {
        /* Pull image `imgName`. Returns a Promise resolved on completion.
         * Sadly `Dockerode` does not play nice with an async version. */
        return new Promise((resolve, reject) => {
            const onProgress = (event) => null;
            const onFinished = (err, output) => {
                if (err) reject(err);
                resolve(output);
            };
            this.client.pull(imgName, (err, stream) => {
                if (err) reject(err);
                this.client.modem.followProgress(stream, onFinished, undefined);
            });
        });
    };
    createContainer = async imgName => {
        const img = await this.getImage(imgName);
        return new ContainerExec(this.client, imgName);
    };
    run = async (code, runtime) => {
        /* Run in Dockerode generated container */

        // Ensure our async setup has completed
        await this.initialized;

        // Get our image
        const imgData = runtime.img;
        const imgName = `${imgData.name}:${imgData.version}`;

        // Get a container from our manager
        const container = (this.containerManager) ?
            await this.containerManager.pop(imgName) :
            await this.createContainer(imgName);
        // Build the run-command
        const cmd = runtime.cmd(code);
        // And execute it
        await container.run(cmd);
        // Notify the container-manager to replenish.  Ignore its Promise.
        if (this.containerManager) this.containerManager.replenish(imgName);
        return container.result;
    };
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
            // Cut back to the length-limit
            this.str = this.str.substr(0, STREAM_LIMIT);
            // And call our on-error func
            onError();
            // FIXME: this should probably set some state which prevents further additions
        } else {
            next();
        }
    };
    return this;
}


const states = { // A fake enum
    NOT_CREATED: 0,
    CREATED: 1,
    RUNNING: 2,
    COMPLETED: 3,
    TIMED_OUT: 4,
    OVERRUN: 5
};

export class ContainerExec {
    /*
     * State machine around container execution.
     * Handles time-outs, memory-over-runs, and the like.
     *
     * */
    constructor(client, imgName) {
        this.state = states.NOT_CREATED;
        this.client = client;
        this.imgName = imgName;
        this.timeout_ms = 10000;
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
            Runtime: runtimeOption,
            Ulimits: [{  // Scala/ JVM seems to need this, at least in gVisor
                "Name": "nofile",
                "Soft": 65536,
                "Hard": 65536
            },],
        });
        await this.container.start({});
        this.state = states.CREATED;
    };
    run = async (cmd) => {
        await this.initialized;

        this.exec = await this.container.exec({
            Cmd: cmd,
            AttachStdout: true,
            AttachStderr: true,
        });

        let execData = null;
        this.state = states.RUNNING;
        try { // Finally, kick things off!
            await this._run();
            execData = await this.exec.inspect();
        } catch (e) { // All exec errors swallowed here
            console.error(e);
        } finally { // No matter what happens while running, remove the container
            this.close(); // Runs asynchronously (and often, slowly)
        }
        let returnCode = execData.ExitCode;

        if (this.state === states.TIMED_OUT) {
            this.stderr.str = 'Klass.Live: Failed - Running Too Long\n\n' + this.stderr.str;
            returnCode = 137;
        } else if (this.state === states.OVERRUN) {
            this.stderr.str = `Klass.Live: Failed - Too Much Console Output\n\n` + this.stderr.str;
            returnCode = 137;
        } else if (!execData) {
            this.stderr.str = `Klass.Live: Failed \n\n` + this.stderr.str;
            returnCode = 137;
        } else if (returnCode === 137) {
            // We don't have an internal state for the out-of-mem case, Docker just kills the exec.
            // If Docker kills it for some other reason, well, not sure we can tell.
            this.stderr.str = 'Klass.Live: Failed - Using Too Much Memory\n\n' + this.stderr.str;
            returnCode = 137;
        }
        this.result = {stdout: this.stdout.str, stderr: this.stderr.str, returnCode};

    };
    _run = async () => {
        /* Actual execution in here! */
        let _this = this;
        await this.exec.start(function (err, stream) {
            /* Start the execution, with this fun closure setting up std out/err.
             * Haven't found an alternative async/await setup that seems to work. */
            if (err) {
                console.error(err);
                throw err;
            }
            _this.container.modem.demuxStream(
                stream, _this.stdout.stream, _this.stderr.stream
            );
        });

        let data = await this.exec.inspect();
        const pollInterval = 100;
        let iters = Math.floor(this.timeout_ms / pollInterval);
        while ((this.state === states.RUNNING) && (iters > 0) && (!data || data.ExitCode === null || data.Running)) {
            await sleep(pollInterval);
            data = await this.exec.inspect();
            iters -= 1;
        }
        // Update our state to either COMPLETED or TIMED_OUT.
        // Other error states may be set by now, in which case leave them as-is.
        if (iters <= 0) this.state = states.TIMED_OUT;
        else if (this.state === states.RUNNING) this.state = states.COMPLETED;
    };
    close = async () => {
        /* Force-stop and remove our container. */
        try {
            await this.container.kill();
            // stop() Seems to be aways slower. And we have no need for any gracefulness.
            // await this.container.stop();
            await this.container.remove();
        } catch (e) { // Again make sure errors stop propagating here
            console.error(`Error Stopping Container: ${e}`);
        }
    };
    onOverRun = () => {
        this.state = states.OVERRUN;
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export a Singleton so we can't accidentally double-initialize the socket
export default new DockerExecutor();

