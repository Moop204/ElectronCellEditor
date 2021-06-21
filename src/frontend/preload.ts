import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    api: {
      send: (channel: string, data?: unknown) => void;
      receive: (channel: string, func: any) => void;
      sendSync: (channel: string, data?: unknown) => any;
    };
  }
}

const validChannels = [
  "validate-file",
  "get-element",
  "save-content",
  "all-variable",
  "all-units",
  "all-components",
  "validate-file",
  "resetParent",
  "find-element-from-children",
  "add-child",
  "update-attribute",
  "save-content",
  "init-content",
];

contextBridge.exposeInMainWorld("api", {
  send: (channel: string, data?: unknown) => {
    // whitelist channels
    // if (true || validChannels.includes(channel)) {
    ipcRenderer.send(channel, data);
    // }
  },
  sendSync: (channel: string, data?: unknown) => {
    // whitelist channels
    // if (true || validChannels.includes(channel)) {
    return ipcRenderer.sendSync(channel, data);
    // }
  },
  receive: (channel: string, func: any) => {
    // if (true || validChannels.includes(channel)) {
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
    // }
  },
});
