import React, { FunctionComponent } from "react";
import { IEditorProp } from "../IEditorProp";
import { EditorMonaco } from "./EditorMonaco";

const RawView: FunctionComponent<IEditorProp> = ({
  setContentExist,
  contentExist,
}) => {
  const handleEditorChange = (value: string) => {
    setContentExist(value);
  };

  return <EditorMonaco xmlInput={contentExist} onChange={handleEditorChange} />;
};

export { RawView };
