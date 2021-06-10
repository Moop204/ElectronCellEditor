import { BrowserWindow } from 'electron';

const ActionReload = (mainWindow: BrowserWindow) => {
  return {
    label: '&Reload',
    accelerator: 'Ctrl+R',
    click: () => {
      mainWindow.webContents.reload();
    },
  };
};

const ActionFullscreen = (mainWindow: BrowserWindow) => {
  return {
    label: 'Toggle &Full Screen',
    accelerator: 'F11',
    click: () => {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    },
  };
};

const ViewMenuBar = (mainWindow: BrowserWindow) => {
  return {
    label: '&View',
    submenu:
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? [ActionReload(mainWindow), ActionFullscreen(mainWindow)]
        : [ActionFullscreen(mainWindow)],
  };
};

export { ViewMenuBar };
