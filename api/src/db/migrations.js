/*
 * DB Migrations
 * Generally expected to be performed at API server boot-time
 *
 * All should be designed to run any number of times >1 without ill effect.
 * Some are scheduled for recurring runs;
 * these might more accurately be called maintenance, cron-jobs, etc.
 */

import {models} from "./models";
import DockerNames from "docker-names";


const _migrations = [
    {
        name: "Session Titles with Funny Docker-Names",
        desc: "Add default docker-style titles/names",
        collect: async () => {
            const all = await models.klass_sessions.find({});
            return all.filter(s => !s.title || s.title === "KlassSession");
        },
        onEach: s => {
            s.title = DockerNames.getRandomName(false);
            s.markModified('title');
            s.save();
        },
    }, {
        name: "Klass Titles with Funny Docker-Names",
        desc: "Add default docker-style titles/names",
        collect: async () => {
            const all = await models.klass_foldeds.find({});
            return all.filter(klass => !klass.title);
        },
        onEach: klass => {
            klass.title = DockerNames.getRandomName(false);
            klass.markModified('title');
            klass.save();
        },
    }, {
        name: "Klass Visibility",
        desc: "Migrate invalid visibility-enums to `PUBLIC`",
        collect: async () => {
            const all = await models.klass_foldeds.find({});
            return all.filter(klass =>
                (klass.visibility !== "PUBLIC") && (klass.visibility !== "PRIVATE")
            );
        },
        onEach: klass => {
            klass.visibility = "PUBLIC";
            klass.markModified('visibility');
            klass.save();
        },
    }, {
        name: "Klass Containers",
        desc: "Remove empty and malformed objects from `klass.runtime.img`. Replace with null.",
        collect: async () => {
            const all = await models.klass_foldeds.find({});
            return all.filter(klass =>
                (klass.runtime && klass.runtime.img && !klass.runtime.img.name)
            );
        },
        onEach: klass => {
            klass.runtime.img = null;
            klass.markModified('runtime');
            klass.save();
        },
    }, {
        name: "User Permission Enum",
        collect: async () => {
            const all = await models.users.find({});
            return all.filter(user => (user.permissions.createKlass === true || user.permissions.createKlass === false));
        },
        onEach: user => {
            for (const k of ["admin", "createKlass", "hostSession", "hostFree"]) {
                if (user.permissions[k] === true) user.permissions[k] = "GRANTED";
                else user.permissions[k] = "NONE";
            }
            user.markModified('permissions');
            user.save();
        },
    }, {
        name: "KlassSession Start & Creation Times",
        collect: async () => {
            const all = await models.klass_sessions.find({});
            return all.filter(ks => !ks.times || !ks.times.started || !ks.times.created);
        },
        onEach: ks => {
            if (ks.created_at) {
                ks.times.created = ks.created_at;
                ks.times.started = ks.created_at;
            } else {
                let dt = Date.now();
                dt.setHours(dt.getHours() - 25);
                ks.times.created = dt;
                ks.times.started = dt;
            }
            ks.created_at = null;
            ks.markModified('times');
            ks.save();
        },
    }, {
        name: "KlassSession Durations",
        collect: async () => {
            const all = await models.klass_sessions.find({});
            return all.filter(ks => !ks.times || !ks.times.duration || Number.isNaN(ks.times.duration));
        },
        onEach: ks => {
            ks.times.duration = 24;
            ks.markModified('times');
            ks.save();
        }
    }, {
        name: "KlassSession Expiration",
        period: 1000 * 60 * 60, // 1hr
        collect: async () => {
            const now = Date.now();
            const all = await models.klass_sessions.find({
                session_state: {$in: ["ACTIVE", "CLOSED"]}
            });
            return all.filter(ks => {
                let expirationTime = new Date(ks.times.started);
                expirationTime.setHours(ks.times.started.getHours() + ks.times.duration);
                return expirationTime < now;
            });
        },
        onEach: ks => {
            ks.session_state = "EXPIRED";
            ks.times.expired = Date.now();
            ks.markModified('times');
            ks.save();
        }
    }, {
        name: "Submission Source From Array to String",
        collect: async () => {
            const all = await models.submissions.find({})
            return all.filter(submission => Array.isArray(submission.source));
        },
        onEach: submission => {
            const oldSrc = submission.source;
            submission.source = oldSrc.join('\n');
            submission.markModified('source');
            submission.save();
        },
    }, {
        name: "Klass Session State Enums",
        collect: () => models.klass_sessions.find({}),
        filter: klass_session => !klass_session.session_state,
        onEach: klass_session => {
            klass_session.session_state = "ACTIVE";
            klass_session.save();
        },
    }, {
        name: "User Permissions",
        collect: () => models.users.find({}),
        filter: user => !user.permissions,
        onEach: user => {
            user.permissions = {createKlass: false, hostSession: false};
            user.save();
        },
    }, {
        name: "Klass Owners",
        f: async () => {
            let n = 0;
            const all = await models.klass_foldeds.find({});
            const migrations = all.map(async inst => {
                let owners = await models.users.find({uid: inst.ownerId});
                if (owners.length !== 1) {
                    console.error(`Invalid Owner(s) for Klass {inst.id}`);
                    return;
                }
                let owner = owners[0];
                if (owner.klass_ids === null || owner.klass_ids === undefined) owner.klass_ids = [];
                if (!owner.klass_ids.includes(inst.id)) {
                    owner.klass_ids.push(inst.id);
                    await owner.save();
                    n += 1;
                }
            });
            await Promise.all(migrations);
            return n;
        }
    }, {
        name: "Klass Session Users",
        f: async () => {
            let n = 0;
            const all = await models.user_sessions.find({});
            const migrations = all.map(async inst => {
                let users = await models.users.find({uid: inst.user_id});
                if (users.length !== 1) {
                    console.error(`Invalid User(s) for UserSession ${inst.id}`);
                    return;
                }
                let user = users[0];
                if (user.session_ids === null || user.session_ids === undefined) user.session_ids = [];
                if (!user.session_ids.includes(inst.id)) {
                    user.session_ids.push(inst.id);
                    await user.save();
                    n += 1;
                }
            });
            await Promise.all(migrations);
            return n;
        }
    }, {
        name: "User Session KlassSessions",
        f: async () => {
            let n = 0;
            const all = await models.user_sessions.find({});
            const migrations = all.map(async inst => {
                let klass_session = await models.klass_sessions.findById(inst.klass_session_id);
                if (!klass_session) {
                    n += 1;
                    console.error(`Invalid KlassSession(s) for UserSession ${inst.id}`);
                    inst.remove();
                }
            });
            await Promise.all(migrations);
            return n;
        }
    },
];

async function runMigration(m) {
    /* Run Migration `m`
     * Returns the number of instances updated */

    if (!m.collect || !m.onEach) {
        if (m.f) {
            console.log(`Running old-style Migration function: ${m.name}`);
            const n = await m.f();
            if (!n) console.log(`No Migrations Performed for ${m.name}`);
            else console.log(`${n} Migrations Performed for ${m.name}`);
            return n;
        }
        console.log(`Malformed Migration: ${m.name}`);
        return 0;
    }

    console.log(`Running Migration: ${m.name}`);
    let matches = await m.collect();
    if (m.filter) matches = matches.filter(m.filter); // FIXME: make async-able. Or just get rid of this.
    const migrations = matches.map(m.onEach);
    await Promise.all(migrations);

    // Report whether this made any changes
    if (!matches.length) console.log(`No Migrations Performed for ${m.name}`);
    else console.log(`${matches.length} Migrations Performed for ${m.name}`);

    // Set up a next run, if requested
    if (m.period) {
        console.log(`Scheduling Next Run of ${m.name} in ${m.period} seconds`);
        setTimeout(() => runMigration(m), m.period);
    }

    // Return the # of entries updated
    return matches.length;
}

export default function migrations() {
    Promise.all(_migrations.map(runMigration))
        .then(_ => console.log("Migrations Complete"));
}

