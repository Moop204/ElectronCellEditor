import FileManagement from "../../../backend/FileManagement";
import { Level, Model, Parser, Validator } from "../../../types/ILibcellml";
import { IssueDescriptor } from "./Issue";

const formatErrors = (v: Validator): IssueDescriptor[] => {
  const noError = v.errorCount();
  const errors = [];
  for (let errorNum = 0; errorNum < noError; errorNum += 1) {
    const issue = v.error(errorNum);
    errors.push({
      desc: issue.description(),
      cause: issue.referenceHeading(),
      type: Level.ERROR,
      url: issue.url(),
    });
  }
  return errors;
};

const formatWarnings = (v: Validator): IssueDescriptor[] => {
  const noWarning = v.warningCount();
  const warnings = [];
  for (let warningNum = 0; warningNum < noWarning; warningNum += 1) {
    const warning = v.warning(warningNum);
    warnings.push({
      desc: warning.description(),
      cause: warning.referenceHeading(),
      type: Level.WARNING,
      url: warning.url(),
    });
  }
  return warnings;
};

const formatMessage = (v: Validator): IssueDescriptor[] => {
  const noHint = v.messageCount();
  const hints = [];
  for (let i = 0; i < noHint; i += 1) {
    const hint = v.message(i);
    hints.push({
      desc: hint.description(),
      cause: hint.referenceHeading(),
      type: Level.HINT,
      url: hint.url(),
    });
  }
  return hints;
};

const validateModel = async (
  self: FileManagement,
  file: string
): Promise<Validator> => {
  if (!self._cellml) {
    await self.init();
  }
  const libcellml = self._cellml;
  const parser: Parser = new libcellml.Parser();
  const m: Model = parser.parseModel(file);
  const v: Validator = new libcellml.Validator();
  v.validateModel(m);
  return v;
};

const obtainIssues = async (v: Validator): Promise<IssueDescriptor[]> => {
  const errors = formatErrors(v);
  const warnings = formatWarnings(v);
  const hints = formatMessage(v);

  const formattedErrors: IssueDescriptor[] = errors
    .concat(warnings)
    .concat(hints);
  return formattedErrors;
};

export { validateModel, obtainIssues };
