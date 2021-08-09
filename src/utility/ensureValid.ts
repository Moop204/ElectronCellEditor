import { Parser, Validator } from "../types/ILibcellml";
import FileManagement from "../backend/FileManagement";

const ensureValid = (fm: FileManagement): boolean => {
  const v: Validator = new fm._cellml.Validator();
  v.validateModel(fm._parser.parseModel(fm.getContent()));
  if (v.issueCount() > 0) {
    for (let i = 0; i < v.errorCount(); i++) {
      console.log(v.error(i).description());
    }
  }
  return v.issueCount() === 0;
};

export { ensureValid };
