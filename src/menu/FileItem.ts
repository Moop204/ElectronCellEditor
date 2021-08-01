import { MenuItem, dialog, BrowserWindow } from "electron";
import FileManagement from "../backend/FileManagement";

const ActionOpen = (mainWindow: BrowserWindow, fm: FileManagement) => {
  return {
    label: "Open File",
    accelerator: "Ctrl+O",
    click: async () => {
      const filePath = dialog.showOpenDialogSync({});
      if (filePath) {
        console.log("action --- open");
        // Get content of file
        await fm.openedFile(String(filePath), mainWindow);
      }
    },
  };
};

const ActionSave = (mainWindow: BrowserWindow, fm: FileManagement) => {
  return {
    label: "File Save",
    accelerator: "Ctrl+S",
    click: () => {
      fm.saveFile(mainWindow);
    },
  };
};

const ActionSaveAs = (mainWindow: BrowserWindow, fm: FileManagement) => {
  return {
    label: "File Save As",
    accelerator: "Shift+Ctrl+S",
    click: () => {
      fm.saveAsFile(mainWindow);
    },
  };
};

const ActionNewFile = (mainWindow: BrowserWindow, fm: FileManagement) => {
  return {
    label: "Open New File",
    accelerator: "Ctrl+N",
    click: () => {
      fm.newFile();
    },
  };
};

const FileItem = (
  isMac: boolean,
  mainWindow: BrowserWindow,
  fm: FileManagement
) => {
  return {
    label: "File",
    submenu: [
      ActionNewFile(mainWindow, fm),
      ActionOpen(mainWindow, fm),
      ActionSave(mainWindow, fm),
      ActionSaveAs(mainWindow, fm),
      isMac ? { role: "close" } : { role: "quit" },
    ],
  };
};

export { FileItem };
