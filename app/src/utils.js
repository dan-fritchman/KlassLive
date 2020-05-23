/*
 * Shared Utility Stuff
 */

import React from 'react';

import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";


export function getEventValue(func) {
    /* Given a function `func` with argument `value`,
    return a new function accepting `event`,
    and extracting `value` from `event.target.value`.
    Mostly some glue logic between how different
    Select/ UI elements are handled.   */
    return function innerFunc(ev) {
        const {target} = ev;
        const {value} = target;
        return func(value);
    };
}

export const toCapWords = num => {
    /* Convert number `num` to capitalized words,
    * e.g. 21 -> "Twenty One", with capital T and O. */

    var converter = require('number-to-words');
    const lowerCase = converter.toWords(num);

    const upperCaseList = lowerCase.split(/\s/).map(s => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1)
    });
    return upperCaseList.join(" ");
};

export const userDisplay = user => {
    // Peel out user info
    const {displayName, photoURL, email} = user;
    const showName = displayName || email || "NoName";
    const avatarGen = () => photoURL ? <Avatar src={photoURL}/> : <PersonIcon/>;
    return {showName, avatarGen};
};

export const comingSoon = () => console.log("COMING SOON!");

