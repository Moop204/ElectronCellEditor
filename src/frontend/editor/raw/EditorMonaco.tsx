import React, { useState, FunctionComponent } from "react";
import Editor, { loader, Monaco } from "@monaco-editor/react";
import { autoFill } from "./autofill/Autofill";
// import { Path } from "history";
// import { autoFill } from "./autofill/Autofill";
// import path from "path";

interface EditorProp {
  xmlInput: string;
  onChange: any;
}

const EditorMonaco: FunctionComponent<EditorProp> = ({
  xmlInput,
  onChange,
}) => {
  const handleBeforeMount = (monaco: Monaco) => {
    monaco.languages.registerCompletionItemProvider("xml", {
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
          suggestions: autoFill(range, monaco),
          indentationRules: {
            increaseIndentPattern:
              "^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$",
            decreaseIndentPattern: "^((?!.*?\\/\\*).*\\*/)?\\s*[\\)\\}\\]].*$",
          },
          surroundingPairs: [
            ["<", ">"],
            ['"', '"'],
          ],
        };
      },
    });
    monaco.languages.IndentAction;
  };

  return (
    <Editor
      height="95vh"
      defaultLanguage="xml"
      defaultValue=""
      value={xmlInput}
      beforeMount={handleBeforeMount}
      onChange={onChange}
    />
  );
};

export { EditorMonaco };
