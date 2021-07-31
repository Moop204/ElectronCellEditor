import { dialog, BrowserWindow } from "electron";
import fs from "fs";

// Requests the user specify where to save. Returns the
// location chosen
// @content     - The text to be written to the file
// @recentFile  - Location of the current file or if no file
//                is current then an empty string
const saveAs = async (content: string, recentFile: string): Promise<string> => {
  const options = {
    title: "Save file",
    buttonLabel: "Save",
    filters: [{ name: "All Files", extensions: ["*"] }],
    defaultPath: recentFile,
  };

  const mainWindow = BrowserWindow.getFocusedWindow();

  const res = await dialog
    .showSaveDialog(mainWindow, options)
    .then(({ filePath }) => {
      fs.writeFileSync(filePath, content, "utf-8");
      return filePath;
    })
    .catch((e) => {
      console.log("Failed to save as new file");
      return recentFile;
    });
  return res;
};

const save = async (content: string, recentFile: string): Promise<string> => {
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

export { saveAs, save };
