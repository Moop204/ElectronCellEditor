/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, Menu } from "electron";
import FileManagement from "../backend/FileManagement";
import { AboutItem } from "./AboutItem";
import { FileItem } from "./FileItem";
import { HelpItem } from "./HelpItem";
import { ViewItem } from "./ViewItem";
import { MacWindowItem, NonMacWindowItem } from "./WindowItem";

const isMac = process.platform === "darwin";

const menuTemplate = (mainWindow: BrowserWindow, fm: FileManagement): any => {
  return [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    FileItem(isMac, mainWindow, fm),
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
              },
            ]
          : [{ type: "separator" }, { role: "selectAll" }]),
      ],
    },
    ViewItem,
    isMac ? MacWindowItem : NonMacWindowItem,
    HelpItem,
    AboutItem,
  ];
};

export { menuTemplate };
