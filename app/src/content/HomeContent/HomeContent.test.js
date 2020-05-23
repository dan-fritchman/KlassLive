import React from 'react';
import {shallow} from 'enzyme';

import {HomeContent} from './HomeContent';


it('renders without crashing', () => {
    const props = {
        isSignedIn: false,
        title: "q"
    };

    shallow(<HomeContent {...props} />);
});
