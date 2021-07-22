import React, { useState, FunctionComponent } from "react";
import Editor, { loader, Monaco } from "@monaco-editor/react";
import { autoFill, AutoFillOption } from "./autofill/Autofill";
import { Container } from "@material-ui/core";
// import { Path } from "history";
// import { autoFill } from "./autofill/Autofill";
// import path from "path";

interface EditorProp {
  xmlInput: string;
  onChange: any;
  option?: AutoFillOption;
}

const EditorMonaco: FunctionComponent<EditorProp> = ({
  xmlInput,
  onChange,
  option = {
    cellml: true,
    mathml: true,
  },
}) => {
  const handleBeforeMount = (monaco: Monaco) => {
    monaco.languages.setLanguageConfiguration("xml", {
      brackets: [],
      autoClosingPairs: [
        // { open: "<", close: ">" },
        { open: "'", close: "T" },
        { open: '"', close: "K" },
      ],
      surroundingPairs: [
        // { open: '<', close: '>' },
        { open: "'", close: "'" },
        { open: '"', close: '"' },
      ],
    });
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
          suggestions: autoFill(range, monaco, option),
          indentationRules: {
            increaseIndentPattern:
              "^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$",
            decreaseIndentPattern: "^((?!.*?\\/\\*).*\\*/)?\\s*[\\)\\}\\]].*$",
          },
          brackets: [],
          autoClosingPairs: [
            // { open: "<", close: ">" },
            { open: "'", close: "T" },
            { open: '"', close: "K" },
          ],
          surroundingPairs: [
            // { open: '<', close: '>' },
            { open: "'", close: "'" },
            { open: '"', close: '"' },
          ],
          formatOnPaste: true,
        };
      },
    });
    // When an open tag is applied make a copy that closes the tag
    // Following section taken from github.com/Microsoft/monaco-editor/issues/221 from theoomoregbee
    monaco.languages.registerCompletionItemProvider("xml", {
      triggerCharacters: [">"],
      provideCompletionItems: (model, position) => {
        const codePre: string = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const tag = codePre.match(/.*<(\w+)>$/)?.[1];
        if (!tag) {
          return;
        }
        const word = model.getWordUntilPosition(position);
        return {
          suggestions: [
            {
              label: `</${tag}`,
              kind: monaco.languages.CompletionItemKind.EnumMember,
              insertText: `</${tag}>`,
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

    monaco.languages.IndentAction;
  };

  return (
    <Editor
      height="100vh"
      defaultLanguage="xml"
      defaultValue=""
      value={xmlInput}
      beforeMount={handleBeforeMount}
      onChange={onChange}
    />
  );
};

export { EditorMonaco };
