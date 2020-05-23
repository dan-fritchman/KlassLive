import dotenv from "dotenv/config";
import DockerExecutor, {ContainerExec} from "./docker";


const run = async () => {
    /* Something like a simple "docker run", through our infrastructure */

    console.log('docker-cli');
    const xr = new DockerExecutor(false, false);
    await xr.initialized;

    const [_node, _thisFile, _dashes, imgName, ...cmd] = process.argv;
    console.log(`RUNNING SOMETHING LIKE:`);
    console.log(`docker run ${imgName} ${cmd.join(" ")}`);

    const ctr = new ContainerExec(xr.client, imgName);
    await ctr.initialized;
    await ctr.run(cmd);

    console.log("STDOUT:");
    console.log(ctr.result.stdout);
    console.log("STDERR:");
    console.log(ctr.result.stderr);

    return true;
};


run()
    .then(_ => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    });

