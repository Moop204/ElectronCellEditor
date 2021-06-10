import FileManagement from '../../../backend/FileManagement';
import { Level, Model, Parser, Validator } from '../../../types/ILibcellml';

const formatErrors = (v: Validator) => {
  const noError = v.errorCount();
  const errors = [];
  for (let errorNum = 0; errorNum < noError; errorNum += 1) {
    const issue = v.error(errorNum);
    errors.push({
      desc: issue.description(),
      cause: issue.referenceHeading(),
      type: Level.ERROR,
    });
  }
  return errors;
};

const formatWarnings = (v: Validator) => {
  const noWarning = v.warningCount();
  const warnings = [];
  for (let warningNum = 0; warningNum < noWarning; warningNum += 1) {
    const warning = v.warning(warningNum);
    warnings.push({
      desc: warning.description(),
      cause: warning.referenceHeading(),
      type: Level.WARNING,
    });
  }
  return warnings;
};

const formatHints = (v: Validator) => {
  const noHint = v.hintCount();
  const hints = [];
  for (let i = 0; i < noHint; i += 1) {
    const hint = v.hint(i);
    hints.push({
      desc: hint.description(),
      cause: hint.referenceHeading(),
      type: Level.HINT,
    });
  }
  return hints;
};

const validateModel = async (self: FileManagement, file: string) => {
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

const obtainIssues = async (v: Validator) => {
  const errors = formatErrors(v);
  const warnings = formatWarnings(v);
  const hints = formatHints(v);

  const formattedErrors = errors.concat(warnings).concat(hints);
  return formattedErrors;
};

export { validateModel, obtainIssues };
