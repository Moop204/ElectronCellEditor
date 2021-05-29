import { Elements } from '../../types/Elements';
import { IChildDetail } from '../../types/IChildDetail';
import { Model, Parser, Reset } from '../../types/ILibcellml';
import { ISearch } from '../../types/IQuery';
import FileManagement from '../FileManagement';

const AddChildReset = async (
  fm: FileManagement,
  child: IChildDetail,
  parent: ISearch
) => {
  const libcellml = fm._cellml;
  const newReset: Reset = new libcellml.Reset();
  const printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const {
    variable,
    variableTest,
    order,
    resetValue,
    testValue,
  } = child.attribute[0];
  // Make reset element
  const m: Model = parser.parseModel(fm.getContent());

  // Find the variables
  // NOTE: Valid variables are within the same component
  const varName: string = variable;
  const varTestName: string = variableTest;
  const parentComponent = m.componentByName(parent.name as string, true);
  const v = parentComponent.variableByName(varName);
  const vTest = parentComponent.variableByName(varTestName);

  // Detail Reset element
  // NOTE: All are mandatory
  newReset.setVariable(v);
  newReset.setOrder(order);
  newReset.setTestVariable(vTest);
  newReset.setResetValue(resetValue as string);
  newReset.setTestValue(testValue as string);

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
