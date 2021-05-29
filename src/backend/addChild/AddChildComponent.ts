import { Elements } from '../../types/Elements';
import { IChildDetail } from '../../types/IChildDetail';
import { Component, Model, Parser, Printer } from '../../types/ILibcellml';
import { ISearch } from '../../types/IQuery';
import FileManagement from '../FileManagement';

const AddChildComponent = async (
  fm: FileManagement,
  parent: ISearch,
  parentType: Elements,
  child: IChildDetail
) => {
  const libcellml = fm._cellml;
  const printer: Printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const m: Model = parser.parseModel(fm.getContent());
  const { name } = child.attribute[0];

  const newComp: Component = new libcellml.Component();
  newComp.setName(name as string);
  // Update current component
  // (this.currentComponent as Model | Component).addComponent(newComp);
  // Update the truth
  if (parentType === Elements.model) {
    m.addComponent(newComp);
    fm.setCurrentComponent(m.clone(), Elements.model);
  } else {
    const parentComponent = m.componentByName(parent.name as string, true);
    parentComponent.addComponent(newComp);
    m.replaceComponentByName(parent.name as string, parentComponent, true);

    const curComp = m.componentByName(parent.name as string, true);
    fm.setCurrentComponent(curComp, Elements.component);
  }
  await fm.updateContent(printer.printModel(m, false));
};

export { AddChildComponent };
