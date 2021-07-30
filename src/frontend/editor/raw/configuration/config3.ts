import { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const singleTag = (tag: string) => {
  switch (tag) {
    case "variable":
      return true;
    default:
      return false;
  }
};

const avoidTag = (tag: string) => {
  switch (tag) {
    case "apply":
    case "ci":
    case "cn":
    case "piecewise":
    case "piece":
    case "otherwise":
    case "logbase":
    case "degree":
    case "reset_value":
    case "test_value":
    case "encapsulation":
    case "eq":
    case "sep":
    case "neg":
    case "gt":
    case "lt":
    case "geq":
    case "leq":
    case "and":
    case "or":
    case "xor":
    case "plus":
    case "not":
    case "plus":
    case "minus":
    case "times":
    case "divide":
    case "power":
    case "root":
    case "abs":
    case "exp":
    case "ln":
    case "log":
    case "floor":
    case "ceiling":
    case "min":
    case "max":
    case "rem":
    case "diff":
    case "sin":
    case "cos":
    case "tan":
    case "sec":
    case "csc":
    case "cot":
    case "sinh":
    case "cosh":
    case "tanh":
    case "sech":
    case "csch":
    case "coth":
    case "arcsin":
    case "arccos":
    case "arctan":
    case "arcsec":
    case "arccsc":
    case "arccot":
    case "arcsinh":
    case "arccosh":
    case "arctanh":
    case "arcsech":
    case "arccsch":
    case "arccoth":
    case "pi":
    case "notanumber":
    case "infinity":
    case "true":
    case "false":
      return true;
    default:
      return false;
  }
};

const config3 = (monaco: Monaco): monaco.languages.CompletionItemProvider => ({
  triggerCharacters: [">"],
  provideCompletionItems: (model, position) => {
    const codePre: string = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    });

    console.log("MATCHED ");
    console.log(codePre.match(/.*<(\w+)[\w\s\"\=]*>$/));
    const tag = codePre.match(/.*<(\w+)[\w\s\"\=]*>$/)?.[1];
    if (!tag || avoidTag(tag)) {
      return;
    }

    const word = model.getWordUntilPosition(position);
    return {
      suggestions: [
        {
          label: `</${tag}`,
          kind: monaco.languages.CompletionItemKind.EnumMember,
          insertText: singleTag(tag) ? "/>" : `</${tag}>`,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          },
        },
      ],
    };
  },
});

export { config3 };
