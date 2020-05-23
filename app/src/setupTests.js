import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

console.log("SETTING UP TESTS!!");
Enzyme.configure({ adapter: new Adapter() });
