import { Monaco } from "@monaco-editor/loader";
import { ElementObject } from "./ElementObject";

const docElementTemplate = (
  elementObject: ElementObject,
  range: Range,
  monaco: Monaco
) => {
  const { label, insertion, tooltip } = elementObject;
  return {
    label: label,
    kind: monaco.languages.CompletionItemKind.Class,
    insertText: insertion,
    insertTextRules: monaco.languages.CompletionItemKind.Snippet,
    description: tooltip,
    documentation: tooltip,
    range: range,
    triggerCharacters: "<",
  };
};

export { docElementTemplate };
