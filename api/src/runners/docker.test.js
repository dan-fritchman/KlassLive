import docker from "./docker";
import {ContainerExec} from "./docker";


test('ContainerExec runs', async () => {
    await docker.initialized;

    const x = new ContainerExec(docker.client, "python:3.7-alpine");
    await x.run(['python', '-c', 'print("FROM_PYTHON")']);
    const {result} = x;

    expect(result.returnCode).toEqual(0);
    expect(result.stdout).toMatch(/FROM_PYTHON/);
    expect(result.stderr).toEqual("");
});

test('ContainerExec Times Out', async () => {
    await docker.initialized;

    const x = new ContainerExec(docker.client, "python:3.7-alpine");
    await x.run(['python', '-c', 'import time; time.sleep(100)']);
    const {result} = x;

    expect(result.returnCode).toEqual(137);
    expect(result.stderr).toMatch(/Running Too Long/);
    expect(result.stdout).toEqual("");
}, 10000);

test('ContainerExec Fills Std-Out', async () => {
    await docker.initialized;

    const x = new ContainerExec(docker.client, "python:3.7-alpine");
    await x.run(['python', '-c', 'print("A" * 3000)']);
    const {result} = x;

    expect(result.returnCode).toEqual(137);
    expect(result.stdout).toMatch("AAAAAAA");
    expect(result.stderr).toMatch(/Too Much Console Output/);
}, 10000);

test('ContainerExec Stops When OutOfMem', async () => {
    await docker.initialized;

    const x = new ContainerExec(docker.client, "python:3.7-alpine");
    await x.run(['python', '-c', 'list(range(1000000000))']);
    const {result} = x;

    expect(result.returnCode).toEqual(137);
    expect(result.stdout).toEqual("");
    expect(result.stderr).toMatch(/Memory/);
}, 10000);
