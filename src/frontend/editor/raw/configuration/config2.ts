import { autoFill, AutoFillOption } from "../autofill/Autofill";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { Monaco } from "@monaco-editor/react";

const config2 = (
  monaco: Monaco,
  option: AutoFillOption
): monaco.languages.CompletionItemProvider => ({
  //@ts-ignore
  provideCompletionItems(model, position, context, token) {
    // // Provide stronger context
    // // find out if we are completing a property in the 'dependencies' object.
    // // const textUntilPosition = model.getValueInRange({
    // //   startLineNumber: 1,
    // //   startColumn: 1,
    // //   endLineNumber: position.lineNumber,
    // //   endColumn: position.column,
    // // });
    const word = model.getWordUntilPosition(position);
    const range = new monaco.Range(
      position.lineNumber,
      word.startColumn,
      position.lineNumber,
      word.endColumn
    );
    // return null;
    return {
      suggestions: autoFill(range, monaco, option),
      indentationRules: {
        increaseIndentPattern: "<.*>$",
        // "^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$",
        decreaseIndentPattern: "/>", //"^((?!.*?\\/\\*).*\\*/)?\\s*[\\)\\}\\]].*$",
      },
      brackets: [],
      formatOnPaste: true,
    };
  },
});

export { config2 };
