import libcellModule from './wasm/libcellml';
const fs = require('fs');
const { ipcMain } = require('electron');

const mainAsync = async () => {
  const libcellml = await libcellModule();
  const file: string = fs.readFileSync(
    'src/example/complex_encapsulation.xml',
    'utf8'
  );
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
    const tmpArg = 'src/example/complex_encapsulation.xml'; // To be properly implemented
    const loadfile: string = fs.readFileSync(tmpArg, 'utf8');
    const readModel = parser.parseModel(file);
    const printedModel = printer.printModel(readModel);
    return printedModel;
  });
};

export { mainAsync };
