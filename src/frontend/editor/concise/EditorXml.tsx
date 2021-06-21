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
    <>
      <div>
        <XmlEditor
          key={xmlInput}
          docSpec={{}}
          ref={editorRef}
          xml={xmlInput}
          mode="laic"
        />
      </div>
    </>
  );
};

export { EditorXml };
