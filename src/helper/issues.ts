import { Model, Parser, Validator } from '../types/ILibcellml';

const libcellModule = require('libcellml.js/libcellml.common');

const formatErrors = (v: Validator) => {
  const noError = v.errorCount();
  const errors = [];
  for (let errorNum = 0; errorNum < noError; errorNum += 1) {
    const issue = v.error(errorNum);
    errors.push({
      desc: issue.description(),
      cause: issue.referenceHeading(),
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
    });
  }
  return hints;
};

const validateModel = async (file: string) => {
  const libcellml = await libcellModule();
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

  const formattedErrors = {
    errors,
    warnings,
    hints,
  };
  return formattedErrors;
};

export { validateModel, obtainIssues };
