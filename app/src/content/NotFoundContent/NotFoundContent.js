import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import FindIcon from '@material-ui/icons/FindInPage';
import HomeIcon from '@material-ui/icons/Home';

import Ui from "../../KlassLive/Ui";
import * as Session from "../../Store/sessions";
import * as AppUi from "../../Store/AppUi";
import CenterLayout from "../../layout/CenterLayout";


const styles = (theme) => ({
    emptyStateIcon: {
        fontSize: theme.spacing(12)
    },
    button: {
        marginTop: theme.spacing(1)
    },
    buttonIcon: {
        marginRight: theme.spacing(1)
    }
});

export class NotFoundContent extends Component {
    componentDidMount = async () => {
        Session.reset();
        AppUi.disableDrawers();
    };
    // FIXME: change this to be something more like "request no drawers"
    // componentWillUnmount = () => {
    //     AppUi.enableDrawers();
    // };
    render() {
        const {classes} = this.props;

        return (<CenterLayout>
            <FindIcon className={classes.emptyStateIcon} color="action"/>
            <Ui.h1>Content Not Found</Ui.h1>
            <Ui.h4>Sorry. Cant Find That.</Ui.h4>
            <Fab className={classes.button} color="secondary" component={Link} to="/" variant="extended">
                <HomeIcon className={classes.buttonIcon}/> Go Home
            </Fab>
        </CenterLayout>);
    }
}

NotFoundContent.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NotFoundContent);

