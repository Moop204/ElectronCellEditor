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
      fm.saveFile();
    },
  };
};

const ActionSaveAs = (mainWindow: BrowserWindow, fm: FileManagement) => {
  return {
    label: "File Save As",
    accelerator: "Shift+Ctrl+S",
    click: () => {
      fm.saveAsFile();
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
      isMac ? { role: "close" } : { role: "quit" },
      ActionOpen(mainWindow, fm),
      ActionSave(mainWindow, fm),
      ActionSaveAs(mainWindow, fm),
    ],
  };
};

export { FileItem };
