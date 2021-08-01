const { shell } = require("electron");

/* eslint-disable @typescript-eslint/no-var-requires */
const HelpItem = {
  role: "help",
  submenu: [
    {
      label: "Learn About CellML",
      click: async (): Promise<void> => {
        await shell.openExternal(
          "https://www.cellml.org/specifications/cellml_2.0"
        );
      },
    },
    {
      label: "Learn About MathML",
      click: async (): Promise<void> => {
        await shell.openExternal("https://www.w3.org/TR/MathML3/");
      },
    },
  ],
};
export { HelpItem };
