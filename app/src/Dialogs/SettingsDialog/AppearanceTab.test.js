import React from "react";
import { shallow } from "enzyme";

import { AppearanceTab } from "./AppearanceTab";


it("AppearanceTab", () => {
  const _ = shallow(<AppearanceTab
      primaryColor=""
      secondaryColor=""
      type=""
      onClose={() => { } }
    />);
});
