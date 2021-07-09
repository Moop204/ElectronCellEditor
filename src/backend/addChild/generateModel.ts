import { Parser, Model } from "./../../types/ILibcellml";

const generateModel = (cellml: any, stringifiedModel: string): Model => {
  const parser: Parser = new cellml.Parser();
  const m: Model = parser.parseModel(stringifiedModel);
  return m;
};

export { generateModel };
