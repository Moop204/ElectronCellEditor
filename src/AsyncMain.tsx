const fs = require('fs');
const { ipcMain} = require('electron');

interface ImportInterface {
  model: string;
  valid: boolean;
}

const mainAsync = async () => {
  // const libcellml = await libcellModule();
  // const parser = new libcellml.Parser();
  // const validator = new libcellml.Validator();
  // const printer = new libcellml.Printer();

};

export { mainAsync };
