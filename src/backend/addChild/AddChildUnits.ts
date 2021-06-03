import { Elements } from '../../types/Elements';
import { IChildDetail } from '../../types/IChildDetail';
import {
  Model,
  Units,
  Printer,
  Parser,
  ImportSource,
} from '../../types/ILibcellml';
import FileManagement from '../FileManagement';

const AddChildUnits = async (fm: FileManagement, child: IChildDetail) => {
  const { name, imported, source, component_ref } = child.attribute;

  // Initialised by caller
  const libcellml = fm._cellml;
  const printer: Printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const m: Model = parser.parseModel(fm.getContent());

  // Make new element with attributes specified by user
  const newUnits: Units = new libcellml.Units();
  newUnits.setName(name as string);
  if (imported) {
    const importSource: ImportSource = new libcellml.ImportSource();
    importSource.setUrl(source);
    newUnits.setSourceUnits(importSource, component_ref);
  }

  // Get the truth and update it
  m.addUnits(newUnits);
  fm.setCurrentComponent(m.clone(), Elements.model);
  await fm.updateContent(printer.printModel(m, false));
};

export { AddChildUnits };
