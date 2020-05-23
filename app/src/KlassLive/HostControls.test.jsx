import React from "react";
import {shallow} from "enzyme";

import {HostControls} from "./HostControls";


it("HostControls", () => {
    const unloaded = shallow(<HostControls loaded={false}/>);
    expect(unloaded.type()).toBeNull();

    const props = {
        loaded: true,
        problem_num: 0,
        num_problems: 10,
        klass_session_id: "FAKEFAKEFAKE",
    };
    const comp = shallow(<HostControls{...props}/>);
    expect(comp).not.toBeNull();
});

