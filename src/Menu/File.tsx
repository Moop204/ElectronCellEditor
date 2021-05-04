import { BrowserWindow, dialog } from 'electron';
import FileManagement from '../FileManagement';
const fs = require('fs');

const ActionOpen = (mainWindow: BrowserWindow, fm: FileManagement) => {
  return {
    label: 'Open File',
    acceleration: 'Ctrl+O',
    click: () => {
      const filePath = dialog.showOpenDialogSync({});
      if (filePath) {
        // Get content of file
        fm.openedFile(String(filePath), mainWindow);
      }
    },
  };
};

const ActionClose = (mainWindow: BrowserWindow, fm: FileManagement) => {
  return {
    label: '&Close',
    accelerator: 'Ctrl+W',
    click: () => {
      mainWindow.close();
    },
  };
};

const ActionSave = (mainWindow: BrowserWindow, fm: FileManagement) => {
  return {
    label: 'Save File',
    acceleration: 'Ctrl+S',
    click: () => {
      var options = {
        title: 'Save file',
        buttonLabel: 'Save',

        filters: [{ name: 'All Files', extensions: ['*'] }],
      };

      dialog.showSaveDialog(mainWindow, options).then(({ filePath }) => {
        fs.writeFileSync(filePath, fm.getContent(), 'utf-8');
      });
    },
  };
};

const FileMenuBar = (mainWindow: BrowserWindow, fm: FileManagement) => {
  return {
    label: '&File',
    submenu: [
      ActionOpen(mainWindow, fm),
      ActionClose(mainWindow, fm),
      ActionSave(mainWindow, fm),
    ],
  };
};

export { FileMenuBar };
