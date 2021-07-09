import { BrowserWindow } from "electron";
import { flip } from "lodash";
const { dialog } = require("electron");
const fs = require("fs");

const SaveAs = async (content: string, recentFile: string) => {
  const options = {
    title: "Save file",
    buttonLabel: "Save",
    filters: [{ name: "All Files", extensions: ["*"] }],
  };

  const mainWindow = BrowserWindow.getFocusedWindow();

  if (recentFile !== "") {
    fs.writeFileSync(recentFile, content, "utf-8");
    return recentFile;
  } else {
    let file = "";
    const res = await dialog
      .showSaveDialog(mainWindow, options)
      .then(({ filePath }) => {
        fs.writeFileSync(filePath, content, "utf-8");
        return filePath;
      })
      .catch((e) => {
        console.log("Failed to save new file");
        return recentFile;
      });
    return res;
  }
};

export { SaveAs };
