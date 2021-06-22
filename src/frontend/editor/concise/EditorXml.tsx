import { XmlEditor } from "react-xml-editor";
import React, { FunctionComponent } from "react";
import { useRef } from "react";
import { IEditorProp } from "../IEditorProp";

interface IEditorXml {
  xmlInput: string;
}

const EditorXml: FunctionComponent<IEditorXml> = ({ xmlInput }) => {
  const editorRef = useRef<XmlEditor | null>(null);

  return (
    <XmlEditor
      key={xmlInput}
      docSpec={{}}
      ref={editorRef}
      xml={xmlInput}
      mode="laic"
    />
  );
};

export { EditorXml };
