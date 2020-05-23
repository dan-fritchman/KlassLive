import React from "react";
import { shallow } from "enzyme";

import { ConfirmationDialogWrapper } from "./ConfirmationDialog";


it("renders without crashing", () => {
  let wrapper = shallow(<ConfirmationDialogWrapper isPerformingAuthAction={false}/>);
});
