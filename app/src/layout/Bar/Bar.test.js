import React from "react";
import { shallow } from "enzyme";

import { Bar } from "./Bar";

describe("Bar", () => {
  it("Renders without props", () => {
    const bar = shallow(
      <Bar
        title=""
        isPerformingAuthAction
        user={null}
      />);
  });
});
