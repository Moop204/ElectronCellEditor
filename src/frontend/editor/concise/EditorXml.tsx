import { XmlEditor } from "react-xml-editor";
import React, { FunctionComponent } from "react";
import { useRef } from "react";
import { Box } from "@material-ui/core";
import convert from "xml-js";
interface IEditorXml {
  xmlInput: string;
}

const EditorXml: FunctionComponent<IEditorXml> = ({ xmlInput }) => {
  const editorRef = useRef<XmlEditor | null>(null);

  console.log(convert.xml2json(xmlInput, { compact: false, spaces: 4 }));

  return (
    <Box
      component="div"
      style={{ height: "95vh", overflowX: "hidden" }}
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

export { EditorXml, IEditorXml };
