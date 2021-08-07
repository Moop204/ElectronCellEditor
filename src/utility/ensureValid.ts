import { Parser, Validator } from "../types/ILibcellml";
import FileManagement from "../backend/FileManagement";

const ensureValid = (fm: FileManagement): boolean => {
  const v: Validator = new fm._cellml.Validator();
  v.validateModel(fm._parser.parseModel(fm.getContent()));
  return v.issueCount() === 0;
};

export { ensureValid };
