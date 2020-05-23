/*
Render Markdown in the Style of our UI.
Primarily used by Markdown-format Notebook cells.
 */
import React from "react";
import /*ReactMarkdown, */ { compiler } from "markdown-to-jsx";

import { withStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";

import Ui from "./Ui";


const styles = theme => ({
  listItem: {
    marginTop: theme.spacing(1)
  }
});

const defaultOptions = {
  overrides: {
    // Note we "downshift" headings by two levels.
    h1: { component: Ui.h3 },
    h2: { component: Ui.h4 },
    h3: { component: Ui.h5 },
    h4: { component: Ui.h6 },
    h5: { component: Ui.h6 },
    h6: { component: Ui.h6 },
    span: { component: Ui.span },
    p: { component: Ui.p },
    a: { component: Link },
    li: {
      component: withStyles(styles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          <Ui.span {...props} />
        </li>
      ))
    }
  }
};

export default function Markdown(props) {
  const { source, options } = props;
  const compileOptions = { ...defaultOptions, ...options };
  return compiler(source, compileOptions);
}
