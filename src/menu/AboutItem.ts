/* eslint-disable @typescript-eslint/no-var-requires */
const AboutItem = {
  role: "about",
  submenu: [
    {
      label: "Read source code",
      click: async (): Promise<void> => {
        const { shell } = require("electron");
        await shell.openExternal(
          "https://github.com/Moop204/ElectronCellEditor"
        );
      },
    },
  ],
};

export { AboutItem };
