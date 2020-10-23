const r = require("./build/Release/Reader.node");
export interface ReaderExport {
  importFile: Function;
}

export var ReaderExport: {
  new (arg: string): ReaderExport;
} = r.ReaderExport;



