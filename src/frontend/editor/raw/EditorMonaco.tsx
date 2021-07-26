import React, { useState, FunctionComponent, useEffect } from "react";
import Editor, { loader, Monaco } from "@monaco-editor/react";
import { autoFill, AutoFillOption } from "./autofill/Autofill";
import { Container } from "@material-ui/core";
import { IDisposable } from "monaco-editor";
// import { Path } from "history";
// import { autoFill } from "./autofill/Autofill";
// import path from "path";

interface EditorProp {
  xmlInput: string;
  onChange: any;
  option?: AutoFillOption;
}

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

const singleTag = (tag: string) => {
  switch (tag) {
    case "variable":
      return true;
    default:
      return false;
  }
};

const EditorMonaco: FunctionComponent<EditorProp> = ({
  xmlInput,
  onChange,
  option = {
    cellml: true,
    mathml: true,
  },
}) => {
  const [disposables, setDisposables] = useState<IDisposable[]>([]);
  useEffect(() => {
    return () => {
      disposables.map((d) => {
        d.dispose();
      });
    };
  }, []);

  const handleBeforeMount = (monaco: Monaco) => {
    const autoClosingTag = monaco.languages.setLanguageConfiguration("xml", {
      brackets: [],
      autoClosingPairs: [
        // { open: "<", close: ">" },
        { open: "'", close: "'" },
        { open: '"', close: `"` },
        { open: "<apply>", close: `</apply>` },
        { open: "<ci>", close: `</ci>` },
        { open: "<cn>", close: `</cn>` },
        { open: "<piecewise>", close: `</piecewise>` },
        { open: "<piece>", close: `</piece>` },
        { open: "<otherwise>", close: `</otherwise>` },
        { open: "<logbase>", close: `</logbase>` },
        { open: "<degree>", close: `</degree>` },
        { open: "<reset_value>", close: `</reset_value>` },
        { open: "<test_value>", close: `</test_value>` },
        { open: "<encapsulation>", close: `</encapsulation>` },
        { open: "<variable", close: `/>` },
      ],
      surroundingPairs: [
        // { open: "<", close: ">" },
        { open: "'", close: "'" },
        { open: '"', close: '"' },
      ],
    });
    const indentTag = monaco.languages.registerCompletionItemProvider("xml", {
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
          formatOnPaste: true,
        };
      },
    });
    // When an open tag is applied make a copy that closes the tag
    // Following section taken from github.com/Microsoft/monaco-editor/issues/221 from theoomoregbee
    const removeClosing = monaco.languages.registerCompletionItemProvider(
      "xml",
      {
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
      }
    );

    monaco.languages.IndentAction;

    disposables.push(autoClosingTag, indentTag, removeClosing);
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
