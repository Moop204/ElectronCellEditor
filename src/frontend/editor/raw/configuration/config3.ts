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
