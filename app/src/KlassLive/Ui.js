import React from "react";

// Our Common Material-UI imports and re-names 

import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";

import MuiLink from '@material-ui/core/Link';
import {Link as RouterLink} from 'react-router-dom';


// Create short-hands for our typical Typography
let headingNames = ["h1", "h2", "h3", "h4", "h5", "h6"];
let headings = {};
headingNames.forEach(name => {
    headings[name] = props => {
        const {children, classes, ...otherProps} = props;
        const typographyProps = {
            variant: name,
            color: "textPrimary",
            ...otherProps
        };

        return <Typography {...typographyProps} >
            {children}
        </Typography>;
    };
});

const p = props => <Typography paragraph color={"textPrimary"} {...props} />;
const span = props => <Typography component="span" color={"textPrimary"} {...props} />;

const Link = props => {
  /* Wrapped Link component, including MUI styling and React-Router-DOM function. */
  const {children, ...other} = props;
  return <MuiLink {...other} component={RouterLink}>
    {children}
  </MuiLink>
};

export default {
    Button,
    Select,
    MenuItem,
    Option: MenuItem,
    Typography,
    Switch,
    headings,
    ...headings,
    p,
    span,
    Link
};

