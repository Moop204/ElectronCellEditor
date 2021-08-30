import { contextBridge, ipcRenderer } from "electron";
import { Buffer } from "buffer";
declare global {
  interface Window {
    api: {
      send: (channel: string, data?: unknown) => void;
      receive: (channel: string, func: any) => void;
      sendSync: (channel: string, data?: unknown) => any;
      remove: (channel: string, func: any) => void;
    };
  }
}

const validChannels = [
  // Frontend -> Backend
  // Takes a string containing content of file
  // Triggers
  // "validated file"
  // "error-reply"
  // "res-get-element" if file is invalid
  "validate-file",

  "get-element",
  "save-content",
  "all-variable",
  "all-units",
  "all-components",
  "validate-file",
  "reset-parent",
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
    console.log(`SENDING ${channel}`);
    console.log(data);
    // }
  },
  sendSync: (channel: string, data?: unknown) => {
    // whitelist channels
    // if (true || validChannels.includes(channel)) {
    console.log(`SENDING SYNC ${channel}`);
    console.log(data);
    return ipcRenderer.sendSync(channel, data);
    // }
  },
  receive: (channel: string, func: any) => {
    // if (true || validChannels.includes(channel)) {
    console.log(`RECEIVING ${channel}`);
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
    // }
  },

  remove: (channel: string, func: any) => {
    ipcRenderer.removeListener(channel, (event, ...args) =>
      func(event, ...args)
    );
  },
});
