import { Elements } from '../../types/Elements';
import { IChildDetail } from '../../types/IChildDetail';
import {
  Variable,
  InterfaceType,
  Model,
  Parser,
  Component,
  InterfaceTypeString,
} from '../../types/ILibcellml';
import { ISearch } from '../../types/IQuery';
import FileManagement from '../FileManagement';

const AddChildVariable = async (
  fm: FileManagement,
  parent: ISearch,
  child: IChildDetail
) => {
  // Create Variable
  const libcellml = fm._cellml;
  const printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const m: Model = parser.parseModel(fm.getContent());

  const { name, varInterface, initialValue, units } = child.attribute;

  const newVariable: Variable = new libcellml.Variable();
  newVariable.setName(name as string);
  console.log(units);
  newVariable.setUnitsByName(units as string);
  if (varInterface) {
    newVariable.setInterfaceTypeByString(varInterface);
  }
  if (initialValue) {
    newVariable.setInitialValueByString(initialValue as string);
  }

  console.log('Before replacing');
  console.log(printer.printModel(m, false));
  console.log(`Search for ` + parent.name);
  // Add to Model
  const parentComponent = m.componentByName(parent.name as string, true);
  parentComponent.addVariable(newVariable);

  m.replaceComponentByName(parent.name as string, parentComponent, true);

  console.log('Where updatecontent would be');
  console.log(printer.printModel(m, false));

  await fm.updateContent(printer.printModel(m, false));

  // Add to cur elm
  // const curElm = fm.getCurrentComponent() as Component;
  // console.log(curElm);
  // const cloneNewVariable = newVariable.clone();
  // console.log(cloneNewVariable);
  // curElm.addVariable(cloneNewVariable);
  // console.log(curElm.variableCount());
  // fm.setCurrentComponent(curElm, Elements.component);
  fm.setCurrentComponent(parentComponent.clone(), Elements.component);
};

export { AddChildVariable };
