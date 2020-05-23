import React from "react";
import { shallow } from "enzyme";

import { UserSession } from "./UserSession";


const props = {
  user_session:
    { id: "QWERTY", submissions: Array(0) }
};


it("UserSession", () => {
  let wrapper = shallow(<UserSession {...props}/>);

  expect(wrapper.type()).not.toBeNull();

  // wrapper.setState({ loaded: true });
  // expect(wrapper.type()).not.toBeNull();
  //

});
