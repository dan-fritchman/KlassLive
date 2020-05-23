import Api from "../KlassLive/api";


xit('Makes a lot of API calls', async () => {
    const numUsers = 2;
    const numRequests = 3;

    // FIXME: iteration over users, no worky
    let userPromises = [];
    for (const u of Array(numUsers).keys()) {
        userPromises.push((async () => {
            let healthData, canaryData;
            for (const r of Array(numRequests).keys()) {
                // console.log(`User #${u} Request #${r}`)
                healthData = await Api.query({query: Api.HEALTH_QUERY});
                canaryData = await Api.query({query: Api.CANARY_QUERY});
            }
            return canaryData;
        })());
    }
    console.log(userPromises);
    const results = await Promise.all(userPromises);
    console.log(results);
}, 60 * 60 * 1000);

