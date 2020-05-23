/*
 * Images for home/ info pages
 * Includes some swapping for light/ dark themes
 */


import install from "./install.gif";

import problem_dark from "./problem_dark.png";
import problem_light from "./problem_light.png";
import scoreboard_dark from "./scoreboard_dark.png";
import scoreboard_light from "./scoreboard_light.png";
import review_dark from "./review_dark.png";
import review_light from "./review_light.png";
import join_dark from "./join_dark.png";
import join_light from "./join_light.png";


const images = {
    dark: {
        install: install,
        problem: problem_dark,
        scoreboard: scoreboard_dark,
        review: review_dark,
        join: join_dark,
    },
    light: {
        install: install,
        problem: problem_light,
        scoreboard: scoreboard_light,
        review: review_light,
        join: join_light,
    },
};

export default images;

