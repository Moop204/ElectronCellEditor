import { BrowserWindow } from "electron";
const { dialog } = require("electron");
const fs = require("fs");

const SaveAs = (content: string) => {
  const options = {
    title: "Save file",
    buttonLabel: "Save",

    filters: [{ name: "All Files", extensions: ["*"] }],
  };

  const mainWindow = BrowserWindow.getFocusedWindow();

  dialog
    .showSaveDialog(mainWindow, options)
    .then(({ filePath }) => {
      fs.writeFileSync(filePath, content, "utf-8");
    })
    .catch((e) => {
      console.log("Failed to save");
    });
};

export { SaveAs };
