import React from "react";
import {Route, Switch} from "react-router-dom";

import KlassRouter from "./KlassRouter";
import KlassSession from "./KlassSession";
import UserPage from "./UserPage";

import HomeContent from "../content/HomeContent/HomeContent";
import NotFoundContent from "../content/NotFoundContent/NotFoundContent";


const Matcher = MatchComp => {
    /* HOC to extract `id` from router `match` props.
     * Sort through `props.match` to find an `id` parameter
     * And create a `MatchComp` with prop `id` if we find it.  */

    return (props) => {
        const {match, ...otherProps} = props;

        if (!(match && match.params && match.params.id)) {
            return <NotFoundContent/>;
        }
        return <MatchComp id={match.params.id} {...otherProps} />;
    };
};

const KlassMatcher = Matcher(KlassRouter);
const SessionMatcher = Matcher(KlassSession);
// const UserMatcher = Matcher(UserPage);

const ToPyConDe = props => <KlassSession {...props} id={"5d9dc9519ea311001bb6d03d"}/>;

class KlassLiveRouter extends React.Component {
    render() {
        return (
            <Switch>
                <Route path="/" exact component={HomeContent}/>)}/>
                <Route path="/pyconde" exact component={ToPyConDe}/>)}/>
                <Route path={`/account`} exact component={UserPage} exact={false}/>
                <Route path={`/klass/:id`} component={KlassMatcher} exact={false}/>
                <Route path={`/session/:id`} component={SessionMatcher} exact={false}/>
                {/*<Route path={`/user/:id`} component={UserMatcher} exact={false}/>*/}
                <Route component={NotFoundContent}/>
            </Switch>

        );
    }
}

export default KlassLiveRouter;
