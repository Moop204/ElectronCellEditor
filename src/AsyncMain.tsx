import { Parser } from 'webpack';
import libcellModule from './wasm/libcellml';
const fs = require('fs');
const { ipcMain } = require('electron');

interface ImportInterface {
  model: string;
  valid: boolean;
}

const importFile = (fileLoc: string, parser) => {
  const file: string = fs.readFileSync(fileLoc, 'utf8');
  //    const loadfile: string = fs.readFileSync(tmpArg, 'utf8');
  const model: string = parser.parseModel(file);
  const valid = true;
  return { model, valid };
};

const mainAsync = async () => {
  const libcellml = await libcellModule();
  const parser = new libcellml.Parser();
  const printer = new libcellml.Printer();
  /*
    const component = new libcellml.Component();
    component.setName('newly added component');
    readModel.addComponent(component);
    */

  // Waits for invocation from renderer and load in the requested file
  ipcMain.handle('loadFile', async (event: Event, arg: string) => {
    console.log('Requested we open ' + arg);
    // const tmpArg = 'src/example/complex_encapsulation.xml'; // To be properly implemented
    const { model, valid } = importFile(
      'src/example/complex_encapsulation.xml',
      parser
    );
    const printedModel = printer.printModel(model);
    console.log(printedModel);
    return printedModel;
  });
};

export { mainAsync, importFile };
