import { MenuItem, dialog, BrowserWindow } from "electron";
import { Object } from "lodash";
import FileManagement from "../backend/FileManagement";
const fs = require("fs");

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
    label: "Save File",
    accelerator: "Ctrl+S",
    click: () => {
      const options = {
        title: "Save file",
        buttonLabel: "Save",

        filters: [{ name: "All Files", extensions: ["*"] }],
      };

      dialog
        .showSaveDialog(mainWindow, options)
        .then(({ filePath }) => {
          fs.writeFileSync(filePath, fm.getContent(), "utf-8");
        })
        .catch((e) => {
          console.log("Failed to save");
        });
    },
  };
};

const FileItem = (
  isMac: boolean,
  mainWindow: BrowserWindow,
  fm: FileManagement
): MenuItem => {
  return {
    label: "File",
    submenu: [
      isMac ? { role: "close" } : { role: "quit" },
      ActionOpen(mainWindow, fm),
      ActionSave(mainWindow, fm),
    ],
  };
};

export { FileItem };
