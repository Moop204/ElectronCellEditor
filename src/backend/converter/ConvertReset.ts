import { Elements } from "../../types/Elements";
import { Reset } from "../../types/ILibcellml";
import { IProperties } from "../../types/IProperties";
import FileManagement from "../FileManagement";

// Convert Reset into property-ready format
const convertReset = (element: Reset) => {
  const resetProp: IProperties = {
    type: Elements.reset,
    attribute: {
      variable: element.variable().name(),
      test_variable: element.testVariable().name(),
      order: element.order(),
      reset_value: element.resetValue(),
      test_value: element.testValue(),
    },
    children: {},
    unit: [],
  };
  return resetProp;
};

export { convertReset };
