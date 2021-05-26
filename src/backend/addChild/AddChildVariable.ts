import { IChildDetail } from '../../types/IChildDetail';
import { Variable, InterfaceType, Model, Parser } from '../../types/ILibcellml';
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

  const { name, varInterface, initialValue, units } = child.attribute[0];

  const newVariable: Variable = new libcellml.Variable();
  newVariable.setName(name as string);
  // TODO: CASE WHERE CUSTOM UNITS USED
  newVariable.setUnitsByName(units as string);
  if (varInterface) {
    newVariable.setInterfaceTypeByInterfaceType(varInterface as InterfaceType);
  }
  if (initialValue) {
    newVariable.setInitialValueByString(initialValue as string);
  }

  // Add to Model
  const parentComponent = m.componentByName(parent.name as string, true);
  parentComponent.addVariable(newVariable);
  m.replaceComponentByName(parent.name as string, parentComponent, true);
  await fm.updateContent(printer.printModel(m, false));
};

export { AddChildVariable };
