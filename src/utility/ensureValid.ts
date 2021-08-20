import FileManagement from "../backend/FileManagement";
import { validateModel } from "../frontend/sidebar/issues/IssueUtilities";

// Returns a boolean describing whether or not a file is valid
const ensureValid = (fm: FileManagement): boolean => {
  const v = validateModel(fm._processor, fm.getContent());

  // v.validateModel(fm._parser.parseModel(fm.getContent()));
  if (v.issueCount() > 0) {
    for (let i = 0; i < v.errorCount(); i++) {
      console.log(v.error(i).description());
    }
  }
  return v.issueCount() === 0;
};

export { ensureValid };
