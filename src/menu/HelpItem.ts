/* eslint-disable @typescript-eslint/no-var-requires */
const HelpItem = {
  role: "help",
  submenu: [
    {
      label: "Learn About CellML",
      click: async (): Promise<void> => {
        const { shell } = require("electron");
        await shell.openExternal("https://www.cellml.org");
      },
    },
    {
      label: "Learn About MathML",
      click: async (): Promise<void> => {
        const { shell } = require("electron");
        await shell.openExternal("https://www.w3.org/Math/");
      },
    },
  ],
};
export { HelpItem };
