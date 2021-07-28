import { Parser, Validator } from "../types/ILibcellml";
import FileManagement from "../backend/FileManagement";

const ensureValid = (fm: FileManagement): boolean => {
  const p: Parser = fm._cellml.Parser();

  const v: Validator = fm._cellml.Validator();
  v.validateModel(p.parseModel(fm.getContent()));
  return v.issueCount() === 0;
};

export { ensureValid };
