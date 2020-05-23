const KLASSLIVE_META_KEY = "KLASSLIVE";


const ID = function (): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
};


const setupMetaObj = (arg: any) => {
    /* Add a KLASSLIVE meta-object, if not already present */
    if (!arg.metadata) {
        arg.metadata = {[KLASSLIVE_META_KEY]: {}};
    }
    if (!arg.metadata[KLASSLIVE_META_KEY]) {
        arg.metadata[KLASSLIVE_META_KEY] = {};
    }
};

const setupId = (arg: any) => {
    if (!arg.metadata[KLASSLIVE_META_KEY].id) {
        arg.metadata[KLASSLIVE_META_KEY].id = ID();
    }
    arg.getId = () => arg.metadata[KLASSLIVE_META_KEY].id;
    return arg.getId();
};

const getId = (arg: any): (string | null) => {
    if (!arg.metadata) return null;
    if (!arg.metadata[KLASSLIVE_META_KEY]) return null;
    return arg.metadata[KLASSLIVE_META_KEY].id;
};


const newCell = (): KlassCell => {
    const cell = new KlassCell();
    setupMetaObj(cell);
    setupId(cell);
    return cell;
};


class NotebookCell {
    constructor(
        public source: string[] = [""],
        public cell_type: string = "code",
        public metadata: object = {},
        public outputs: string[] = [],
        public execution_count: number = 0,
        public getId: any = null) {
    }
}

class KlassCell {
    constructor(
        public id: string = "",
        public problemId: string = "",
        public source: string = "",
        public cell_type: string = "code",
        public submission: object = {},
        public metadata: object = {},
        public outputs: string[] = [],
        public execution_count: number = 0,
        public getId: any = null) {
    }

    static fromNotebookCell(nbCell: NotebookCell): KlassCell {
        let metadata: any = nbCell.metadata;
        let cellMeta: any = metadata[KLASSLIVE_META_KEY];

        // FIXME: no object spread pretty well sucks.
        return new KlassCell(
            cellMeta.id,
            cellMeta.problemId,
            nbCell.source.join(""), /* source */
            nbCell.cell_type,
            {}, /* FIXME: SUBMISSION, convert to outputs etc */
            nbCell.metadata,
            nbCell.outputs,
            nbCell.execution_count,
            () => cellMeta.id
        );
    }

    static toNotebookCell(cell: KlassCell) {
        /* Split source into lines */
        let sourceLines = cell.source.split("\n");
        sourceLines = [
            ...sourceLines.slice(0, sourceLines.length - 1).map(s => s + "\n"),
            ...sourceLines.slice(sourceLines.length - 1)
        ];
        /* Code-only fields (outputs, exec count) can be stored on *any* cell (in fact Jupyter does store them in-memory),
        but generate warnings when loading from disk.  So, only export these fields for code-cells. */
        let codeFields = {};
        if (cell.cell_type === "code") {
            codeFields = {
                execution_count: cell.execution_count,
                outputs: cell.outputs
            };
        }
        return {
            cell_type: cell.cell_type,
            metadata: {
                ...cell.metadata,
                [KLASSLIVE_META_KEY]: {
                    id: cell.id,
                    problemId: cell.problemId
                }
            },
            source: sourceLines,
            ...codeFields
        };
    }
}


class Notebook {
    constructor(
        public nbformat: number = 4,
        public nbformat_minor: number = 2,
        public cells: object[] = [],
        public metadata: object = {}
    ) {
    }
}

type CellsById = { [key: string]: KlassCell };

class Problem {
    constructor(
        public title: string = "",
        public setup: KlassCell[],
        public prompt: KlassCell,
        public solution: KlassCell,
        public tests: KlassCell,
        public metadata: object = {}
    ) {
    }

    static blank = (): Problem => {
        return new Problem(
            "",
            [newCell()],
            newCell(),
            newCell(),
            newCell(),
            {}
        );
    };

    static getCells = (prob: Problem): Array<KlassCell> => {
        // Ordered list of cells
        let cells: KlassCell[] = [];
        const pushCell = (cell: KlassCell) => cells.push(cell);
        prob.setup.forEach(pushCell);
        [prob.prompt, prob.solution, prob.tests].forEach(pushCell);
        return cells;
    };

    static getCellsById = (prob: Problem): CellsById => {
        const cellArray: Array<KlassCell> = Problem.getCells(prob);
        let r: CellsById = {};
        cellArray.forEach((cell: KlassCell) => {
            r[cell.getId()] = cell;
        });
        return r;
    };

    static toStore(prob: Problem): ProblemStore {
        return storeFromProblem(prob);
    };
}

const newProblemStore = (): any => {
    const prob = Problem.blank();
    return storeFromProblem(prob);
};


class ProblemStore {
    constructor(
        public id: string = "",
        public title: string = "",
        public setup: string[],
        public prompt: string,
        public solution: string,
        public tests: string,
        public cellsById: CellsById = {},
        public metadata: object = {}
    ) {
    }
}

const storeFromProblem = (prob: Problem): ProblemStore => {
    const problemId = ID();
    const cellsById: CellsById = {};
    let setupIds: Array<string> = [];
    let specialIds: { [key: string]: string } = {
        prompt: "",
        solution: "",
        tests: ""
    };
    // Create IDs and cellsById entries
    prob.setup.forEach((cell: KlassCell) => {
        const id: string = ID();
        cell.id = id;
        cell.problemId = problemId;
        cellsById[id] = cell;
        setupIds.push(id);
    });
    // Similarly for special cells
    ["prompt", "solution", "tests"].forEach((s: string) => {
        const id = ID();
        // FIXME: TypeScript doesnt like this indexing stuff.
        let indexableProblem = prob as any;
        let cell = indexableProblem[s];
        if (!cell) cell = new KlassCell();
        cell.id = id;
        cell.problemId = problemId;
        cellsById[id] = cell;
        specialIds[s] = id;
    });

    return new ProblemStore(
        problemId,
        prob.title,
        setupIds,
        specialIds.prompt,
        specialIds.solution,
        specialIds.tests,
        cellsById,
        prob.metadata
    );
};


class KlassStore {
    /*
     * KlassStore
     *
     * Primary in-memory structure for klass contents
     * Uses the Redux-recommended "normalized" shape for problems and cells,
     * storing each in a "byId" mapping.
     * */

    constructor(
        public id: string = "",
        public title: string = "",
        public desc: string = "",
        public cellsById: { [key: string]: KlassCell } = {},
        public problemIds: string[] = [],
        public problemsById: { [key: string]: ProblemStore } = {},
        public metadata: object = {},
        public notebookMeta: object = {},
        public owner: object = {},
        public runtime: object = {},
        public visibility: string = "PUBLIC",
    ) {
    }

    static fromKlass = (klass: Klass): KlassStore => {
        let klassStore = new KlassStore();
        klassStore.id = klass.id;
        klassStore.title = klass.title;
        klassStore.desc = klass.desc;
        klassStore.owner = klass.owner;
        klassStore.metadata = klass.metadata;
        klassStore.notebookMeta = klass.notebookMeta;
        klassStore.runtime = klass.runtime;
        klassStore.visibility = klass.visibility;

        klass.problems.forEach((prob: Problem) => {
            let probStore = storeFromProblem(prob);
            addProblemStore(klassStore, probStore);
        });
        return klassStore;
    };

    static fromNotebook = (nb: Notebook): object => {
        let metadata: any = nb.metadata;
        const klMeta = metadata[KLASSLIVE_META_KEY];
        const {problemIds, problemsById} = klMeta;

        let cellsById: { [key: string]: KlassCell } = {};
        nb.cells.forEach((nbCell: any) => {
            const klassCell = KlassCell.fromNotebookCell(nbCell);
            cellsById[klassCell.getId()] = klassCell;
        });

        problemIds.forEach((problemId: string) => {
            const prob = problemsById[problemId];
            if (!prob) console.error("Unknown Problem" + problemId);

            const checkForCell = (cellId: string) => {
                if (!cellsById[cellId]) console.error("Unknown Cell: " + cellId);
                else {
                    // Give the cell the problem ID #
                    let cell = cellsById[cellId];
                    let cellMeta: any = cell.metadata;
                    cellMeta[KLASSLIVE_META_KEY].problemId = problemId;
                }
            };
            // If setup is empty, create a blank cell
            if (!(prob.setup && prob.setup.length)) {
                prob.setup = [newCell()];
            }
            prob.setup.forEach(checkForCell);

            // Similarly for special cells, create blank ones if empty
            ["prompt", "solution", "tests"].forEach(key => {
                if (!prob[key]) {
                    const newKlassCell: KlassCell = newCell();
                    cellsById[newKlassCell.getId()] = newKlassCell;
                    prob[key] = newKlassCell;
                }
                checkForCell(prob[key]);
            });
        });
        return {
            title: "",
            cellsById: cellsById,
            problemIds: problemIds,
            problemsById: problemsById,
            metadata: {...nb.metadata},
            notebookMeta: {
                nbformat: nb.nbformat,
                nbformat_minor: nb.nbformat_minor
            }
        };
    };

    static getProblems = (kls: KlassStore): Array<ProblemStore> => {
        // Ordered list of problems
        return kls.problemIds.map((id: string) => kls.problemsById[id]);
    };

    static getCells = (kls: KlassStore): Array<KlassCell> => {
        // Ordered list of cells
        let cells: KlassCell[] = [];
        const pushCell = (cellId: string) => cells.push(kls.cellsById[cellId]);
        KlassStore.getProblems(kls).forEach((prob: ProblemStore) => {
            prob.setup.forEach(pushCell);
            [prob.prompt, prob.solution, prob.tests].forEach(pushCell);
        });
        return cells;
    };

    static toNotebook = (klass: KlassStore): Notebook => {
        /* Converts an in-memory-form Klass to notebook */
        const nbMeta: any = klass.notebookMeta;
        const nbformat = !!nbMeta ? nbMeta.nbformat : 4;
        const nbformat_minor = !!nbMeta ? nbMeta.nbformat_minor : 2;
        const nbData = {
            cells: KlassStore.getCells(klass).map(KlassCell.toNotebookCell),
            nbformat: nbformat,
            nbformat_minor: nbformat_minor,
            metadata: {
                ...klass.metadata,
                [KLASSLIVE_META_KEY]: {
                    problemIds: klass.problemIds,
                    problemsById: klass.problemsById,
                    cellsById: klass.cellsById
                }
            }
        };
        return nbData;
    };
}

const addProblemStore = (klassStore: KlassStore, problemStore: ProblemStore) => {
    klassStore.problemIds.push(problemStore.id);
    klassStore.problemsById[problemStore.id] = problemStore;
    klassStore.cellsById = {
        ...klassStore.cellsById,
        ...problemStore.cellsById
    };
};

const problemFromKlassStore = (klassStore: KlassStore, problemId: string) => {
    const problemStore = klassStore.problemsById[problemId];
    const setupCells = problemStore.setup.map((id: string) => klassStore.cellsById[id]);
    return new Problem(
        problemStore.title,
        setupCells,
        klassStore.cellsById[problemStore.prompt],
        klassStore.cellsById[problemStore.solution],
        klassStore.cellsById[problemStore.tests],
        klassStore.metadata
    );
};

class Klass {
    /* "Folded" Klass Structure */

    constructor(
        public id: string = "",
        public title: string = "",
        public desc: string = "",
        public problems: Array<Problem> = [],
        public scratch: Array<KlassCell> = [],
        public metadata: object = {},
        public notebookMeta: object = {},
        public owner: object = {},
        public runtime: object = {},
        public visibility: string = "PUBLIC",
    ) {
    }

    static fromKlassStore = (klassStore: KlassStore): Klass => {
        const problems = klassStore.problemIds.map((id: string) =>
            problemFromKlassStore(klassStore, id));
        return new Klass(
            klassStore.id,
            klassStore.title,
            klassStore.desc,
            problems,
            [], // scratch
            klassStore.metadata,
            klassStore.notebookMeta,
            klassStore.owner,
            klassStore.runtime,
            klassStore.visibility
        );
    };
}


export default {
    storeFromKlass: KlassStore.fromKlass,
    fromNotebook: KlassStore.fromNotebook,
    toNotebook: KlassStore.toNotebook,
    fromKlassStore: Klass.fromKlassStore,
    getId,
    newCell,
    newProblemStore
};

