/*
 * VERY stripped down version of client-side KlassTypes.
 * Figure out how to share this, one of these days.
 */

const Cell = props => {
    const defaults = {
        source: "",
        cell_type: "code",
        metadata: {},
        outputs: [],
        execution_count: 0
    };
    return {
        ...defaults,
        ...props,
        metadata: {
            ...defaults.metadata,
            ...props.metadata
        }
    };
};

export default class Klass {
    static newCell = () => Cell({});

    static newProblem = () => {
        return {
            title: "",
            desc: "",
            setup: [Klass.newCell()],
            prompt: Klass.newCell(),
            solution: Klass.newCell(),
            tests: Klass.newCell(),
            metadata: {}
        };
    };
}