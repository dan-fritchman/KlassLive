
// Runner Executor Configuration 

if (process.env.KLASSLIVE_RUNNER === "DOCKER") { 
    const docker = require('./docker');
    module.exports.executor = docker;
} else {
    /* If not running, export some indicators. */
    module.exports.executor = {
        ready: () => true,
        valid: () => false,
        run: () => undefined,
    };
}

