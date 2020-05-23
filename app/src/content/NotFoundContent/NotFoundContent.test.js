import React from 'react';
import {shallow} from "enzyme";

import NotFoundContent from './NotFoundContent';


it('renders without crashing', () => {
    shallow(<NotFoundContent/>);
});
