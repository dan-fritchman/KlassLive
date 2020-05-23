export default function dontActuallyRun(code, runtime) {
    /* Cowardly non-runner. */
    return {
        stdout: "Not Actually Running! But You Pass.\n" + code,
        stderr: "",
        returnCode: 0
    };
}
