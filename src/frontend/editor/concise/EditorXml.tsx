import { XmlEditor } from "react-xml-editor";
import React, { FunctionComponent } from "react";
import { useRef } from "react";
import { Box } from "@material-ui/core";

interface IEditorXml {
  xmlInput: string;
}

const EditorXml: FunctionComponent<IEditorXml> = ({ xmlInput }) => {
  const editorRef = useRef<XmlEditor | null>(null);

  return (
    <Box
      component="div"
      style={{ height: "100%", overflowX: "hidden" }}
      overflow="scroll"
    >
      <XmlEditor
        key={xmlInput}
        docSpec={{}}
        ref={editorRef}
        xml={xmlInput}
        mode="laic"
      />
    </Box>
  );
};

export { EditorXml };
