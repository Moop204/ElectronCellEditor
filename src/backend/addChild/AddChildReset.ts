import { Elements } from "../../types/Elements";
import { ChildDetail } from "../../types/ChildDetail";
import { Model, Parser, Reset } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

const AddChildReset = async (
  fm: FileManagement,
  child: ChildDetail,
  parent: ISearch
) => {
  const libcellml = fm._cellml;
  const newReset: Reset = new libcellml.Reset();
  const printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const { reset_variable, test_variable, order, reset_value, test_value } =
    child.attribute;
  console.log(child.attribute);
  // Make reset element
  const m: Model = parser.parseModel(fm.getContent());

  // Find the variables
  // NOTE: Valid variables are within the same component
  const parentComponent = m.componentByName(parent.name as string, true);
  const v = parentComponent.variableByName(reset_variable);
  const vTest = parentComponent.variableByName(test_variable);

  // Detail Reset element
  // NOTE: All are mandatory
  console.log(child.attribute);
  newReset.setVariable(v);
  newReset.setOrder(order);
  newReset.setTestVariable(vTest);
  newReset.setResetValue(reset_value as string);
  newReset.setTestValue(test_value as string);

  // Attach it to parent component
  // parentComponent.addReset(newReset);
  // m.replaceComponentByName(
  //   parent.name as string,
  //   parentComponent.clone(),
  //   true
  // );
  m.componentByName(parent.name as string, true).addReset(newReset);
  await fm.updateContent(printer.printModel(m, false));

  // Update current element
  fm.setCurrentComponent(parentComponent.clone(), Elements.component);
};

export { AddChildReset };
