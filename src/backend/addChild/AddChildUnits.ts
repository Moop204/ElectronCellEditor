import { Elements } from '../../types/Elements';
import { IChildDetail } from '../../types/IChildDetail';
import { Model, Units, Printer, Parser } from '../../types/ILibcellml';
import FileManagement from '../FileManagement';

const AddChildUnits = async (fm: FileManagement, child: IChildDetail) => {
  // Initialised by caller
  const libcellml = fm._cellml;
  const printer: Printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const m: Model = parser.parseModel(fm.getContent());
  // const parser1: Parser = new libcellml.Parser();
  // const printer1: Printer = new libcellml.Printer();
  // Make new element with attributes specified by user
  const newUnits: Units = new libcellml.Units();
  newUnits.setName(child.attribute[0].name as string);
  // Get the truth and update it
  // const m1: Model = parser1.parseModel(this.content);
  m.addUnits(newUnits);
  fm.setCurrentComponent(m.clone(), Elements.model);
  await fm.updateContent(printer.printModel(m, false));
};

export { AddChildUnits };
