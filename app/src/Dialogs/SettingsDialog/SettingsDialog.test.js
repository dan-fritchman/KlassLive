import React from "react";
import { shallow } from "enzyme";

import { SettingsDialog } from "./SettingsDialog";


it("renders without crashing", () => {
  shallow(
    <SettingsDialog
      open={true}
      user={{}}
      isPerformingAuthAction={false}
      isVerifyingEmailAddress={false}
      fullScreen={false}
    />
  );
});

