import React from "react";
import * as TestUtils from "../TestUtils";
import Api from "../KlassLive/api";


beforeAll(TestUtils.initFirebase);


it("Updates User Data", async () => {
    const {context, userData} = await TestUtils.getMockUser('fakeHost');
    let json;

    json = await Api.mutate({
        mutation: Api.UPDATE_USER_MUTATION,
        variables: {data: userData},
        context
    });
});

it("Creates A Klass", async () => {
    const {context, userData} = await TestUtils.getMockUser('fakeHost');
    let json;

    json = await Api.mutate({
        mutation: Api.CREATE_KLASS_MUTATION,
        variables: {user: userData}, // FIXME
        context
    });
    const {createKlass} = json.data;

    expect(createKlass.id).not.toBeNull();
    expect(createKlass.title).toBeNull();
    expect(createKlass.desc).toBeNull();

    json = await Api.query({
        query: Api.GET_KLASS_FOLDED_QUERY,
        variables: {id: createKlass.id},
        context
    });
    const readBackKlass = json.data.klass_folded;

    expect(readBackKlass.id).toEqual(createKlass.id);
    expect(readBackKlass.title).toEqual(createKlass.title);
    expect(readBackKlass.desc).toEqual(createKlass.desc);
});


it("Creates a KlassSession", async () => {
    const uid = 'fakeHost';
    const {context, userData} = await TestUtils.getMockUser(uid);
    let json;

    // Create Klass
    json = await Api.mutate({
        mutation: Api.CREATE_KLASS_MUTATION,
        variables: {user: userData}, // FIXME
        context
    });
    const klass = json.data.createKlass;

    // Create Klass Session
    const data = {
        title: "_1234",
        times: {start: null, finish: null, duration: 24},
        klass_id: klass.id,
        host_id: uid,
    };
    json = await Api.mutate({
        mutation: Api.CREATE_KLASS_SESSION_MUTATION,
        variables: {data},
        context
    });

    const klassSession = json.data.createKlassSession;
    expect(klassSession).not.toBeNull();
    expect(klassSession.id).not.toBeNull();
    expect(klassSession.title).not.toBeNull();
    expect(klassSession.host).not.toBeNull();
    expect(klassSession.session_state).toEqual("ACTIVE");

    // Add Users to it
    for (const n of Array(3).keys()) {
        const uid = `fakeUser${n}`;
        const {context, userData} = await TestUtils.getMockUser(uid);

        json = await Api.mutate({
            mutation: Api.CREATE_USER_SESSION_MUTATION,
            variables: {
                data: {
                    klass_session_id: klassSession.id,
                    user_id: uid,
                }
            }, context
        });
        const userSession = json.data.joinKlassSession;
        expect(userSession.responses).toHaveLength(0);
    }

    json = await Api.query({
        query: Api.KLASS_SESSION_STATE_QUERY,
        variables:{id:klassSession.id},
        context
    });
    const updatedKlassSession = json.data.klass_session;
    expect(updatedKlassSession.user_sessions).toHaveLength(4);
}, 10*1000);

it("Forks A Klass", async () => {
    const uid = 'fakeHost';
    const {context, userData} = await TestUtils.getMockUser(uid);
    let json;

    json = await Api.mutate({
        mutation: Api.CREATE_KLASS_MUTATION,
        variables: {user: userData}, // FIXME
        context
    });
    const {createKlass} = json.data;

    json = await Api.mutate({
        mutation: Api.FORK_KLASS_MUTATION,
        variables: {klass_id: createKlass.id},
        context
    });
    const {forkKlass} = json.data;

    expect(forkKlass.id).not.toEqual(createKlass.id);
    expect(forkKlass.title).toEqual(createKlass.title);
    expect(forkKlass.desc).toEqual(createKlass.desc);
});

