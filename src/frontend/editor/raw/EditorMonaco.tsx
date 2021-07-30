import React, { useState, FunctionComponent, useEffect } from "react";
import Editor, {
  BeforeMount,
  loader,
  Monaco,
  OnMount,
  useMonaco,
} from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { autoFill, AutoFillOption } from "./autofill/Autofill";
import { Container } from "@material-ui/core";
import { IDisposable } from "monaco-editor";
import { config1 } from "./configuration/config1";
import { config2 } from "./configuration/config2";
import { config3 } from "./configuration/config3";
// import { Path } from "history";
// import { autoFill } from "./autofill/Autofill";
// import path from "path";

interface EditorProp {
  xmlInput: string;
  onChange: any;
  option?: AutoFillOption;
}

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

  console.log("Hey guys did you know Vaporeon");

  useEffect(() => {
    return () => {
      disposables.map((d) => {
        d.dispose();
      });
    };
  }, []);

  const handleBeforeMount: BeforeMount = (monaco) => {
    console.log("Handled before mounting");
    const autoClosingTag = monaco.languages.setLanguageConfiguration(
      "xml",
      config1
    );
    const indentTag = monaco.languages.registerCompletionItemProvider(
      "xml",
      config2(monaco, option)
    );
    // When an open tag is applied make a copy that closes the tag
    // Following section taken from github.com/Microsoft/monaco-editor/issues/221 from theoomoregbee
    const removeClosing = monaco.languages.registerCompletionItemProvider(
      "xml",
      config3(monaco)
    );
    // editor.languages.IndentAction;
    disposables.push(autoClosingTag, indentTag, removeClosing);
  };

  const monaco = useMonaco();
  useEffect(() => {
    // do conditional chaining
    // or make sure that it exists by other ways
    if (monaco) {
      handleBeforeMount(monaco);
      console.log("here is the monaco instance:", monaco);
    }
  }, [monaco]);

  return (
    <Editor
      height="100vh"
      defaultLanguage="xml"
      defaultValue=""
      value={xmlInput}
      // beforeMount={handleOnMount}
      // onMount={handleOnMount}
      onChange={onChange}
    />
  );
};

export { EditorMonaco };

// const handleBeforeMount = (monaco: Monaco) => {
//   console.log("Handled before mounting");
//   const autoClosingTag = monaco.languages.setLanguageConfiguration(
//     "xml",
//     config1
//   );
//   const indentTag = monaco.languages.registerCompletionItemProvider("xml", {
//     config2(monaco, option);,
//     // //@ts-ignore
//     // provideCompletionItems(model, position, context, token) {
//     //   // // Provide stronger context
//     //   // // find out if we are completing a property in the 'dependencies' object.
//     //   // // const textUntilPosition = model.getValueInRange({
//     //   // //   startLineNumber: 1,
//     //   // //   startColumn: 1,
//     //   // //   endLineNumber: position.lineNumber,
//     //   // //   endColumn: position.column,
//     //   // // });
//     //   const word = model.getWordUntilPosition(position);
//     //   const range = new monaco.Range(
//     //     position.lineNumber,
//     //     word.startColumn,
//     //     position.lineNumber,
//     //     word.endColumn
//     //   );
//     //   // return null;
//     //   return {
//     //     suggestions: autoFill(range, monaco, option),
//     //     indentationRules: {
//     //       increaseIndentPattern:
//     //         "^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$",
//     //       decreaseIndentPattern: "^((?!.*?\\/\\*).*\\*/)?\\s*[\\)\\}\\]].*$",
//     //     },
//     //     brackets: [],
//     //     formatOnPaste: true,
//     //   };
//     // },
//   });
//   // When an open tag is applied make a copy that closes the tag
//   // Following section taken from github.com/Microsoft/monaco-editor/issues/221 from theoomoregbee
//   const removeClosing = monaco.languages.registerCompletionItemProvider("xml", {
//     triggerCharacters: [">"],
//     provideCompletionItems: (model, position) => {
//       const codePre: string = model.getValueInRange({
//         startLineNumber: position.lineNumber,
//         startColumn: 1,
//         endLineNumber: position.lineNumber,
//         endColumn: position.column,
//       });

//       console.log("MATCHED ");
//       console.log(codePre.match(/.*<(\w+)[\w\s\"\=]*>$/));
//       const tag = codePre.match(/.*<(\w+)[\w\s\"\=]*>$/)?.[1];
//       if (!tag || avoidTag(tag)) {
//         return;
//       }

//       const word = model.getWordUntilPosition(position);
//       return {
//         suggestions: [
//           {
//             label: `</${tag}`,
//             kind: monaco.languages.CompletionItemKind.EnumMember,
//             insertText: singleTag(tag) ? "/>" : `</${tag}>`,
//             range: {
//               startLineNumber: position.lineNumber,
//               endLineNumber: position.lineNumber,
//               startColumn: word.startColumn,
//               endColumn: word.endColumn,
//             },
//           },
//         ],
//       };
//     },
//   });

//   monaco.languages.IndentAction;

//   disposables.push(autoClosingTag, indentTag, removeClosing);
// };
