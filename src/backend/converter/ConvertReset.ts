import { Component, Variable } from "../../types/ILibcellml";
import { Elements } from "../../types/Elements";
import { Reset } from "../../types/ILibcellml";
import { IProperties } from "../../types/IProperties";
import FileManagement from "../FileManagement";

const convertReset = (element: Reset, fm: FileManagement) => {
  console.log("CONVERTING R E S E T ");
  console.log(element);
  const resetProp: IProperties = {
    type: Elements.reset,
    attribute: {
      variable: element.variable(),
      test_variable: element.testVariable(),
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
