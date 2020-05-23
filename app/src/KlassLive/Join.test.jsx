import React from 'react';
import {shallow} from "enzyme";

import {JoinKlass} from './Join';

it('JoinKlass', () => {

    const props = {
        user: {
            displayName: "JOIN_USER",
            email: "join@user.com",
            photoUrl: "user.com"
        },
        host: {
            displayName: "I_AM_THE_HOST",
            email: "host@user.com",
            photoUrl: "host.com"
        },
        title: "Join Me Plz!",
        user_sessions: []
    };
    shallow(<JoinKlass {...props}/>);
});

