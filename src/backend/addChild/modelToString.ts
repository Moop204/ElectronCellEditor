import { Printer, Parser, Model } from "./../../types/ILibcellml";

const modelToString = (cellml: any, model: Model): string => {
  const printer: Printer = new cellml.Printer();
  return printer.printModel(model, false);
};

export { modelToString };
