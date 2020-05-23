import DataLoader from "dataloader";
import {models} from "./models";


const loaderSortById = (keys, entries) => {
    return keys.map(key =>
        entries.find(entry => entry._id.equals(key)));
};

const loaderSortByField = (keys, entries, field) => {
    return keys.map(key =>
        entries.find(entry => entry[field] === key));
};

const modelBatchLoader = (model) => new DataLoader(
    async keys => {
        const entries = await model.find({_id: {$in: keys}});
        return loaderSortById(keys, entries);
    },
    {cacheKeyFn: key => key.toString()},
);

export const getLoaders = () => ({
    users: new DataLoader(
        async keys => {
            const entries = await models.users.find({uid: {$in: keys}});
            return loaderSortByField(keys, entries, 'uid');
        },
        // {cacheKeyFn: key => key.toString()},
    ),
    user_sessions: modelBatchLoader(models.user_sessions),
    klass_sessions: modelBatchLoader(models.klass_sessions),
    submissions: modelBatchLoader(models.submissions),
    klasses: modelBatchLoader(models.klass_foldeds),
});

