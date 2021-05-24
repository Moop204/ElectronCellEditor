import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { EditorMonaco } from './EditorMonaco';
interface EditorProp {
  xmlInput: string;
}

const rawStyles = makeStyles((theme) =>
  createStyles({
    content: {
      whiteSpace: 'pre-wrap',
    },
    rawView: {
      overflow: 'auto',
      height: '80vh',
      width: '100%',
    },
  })
);

//export declare const newElementChild: (parameter: string) => (xml: Xml, id: string[]) => Promise<Xml>;
// Directly update based on setContent
const RawView = ({
  setContentExist,
  contentExist,
}: {
  setContentExist: React.Dispatch<React.SetStateAction<string>>;
  contentExist: string;
}) => {
  const handleEditorChange = (value: string, _: any) => {
    setContentExist(value);
  };

  return <EditorMonaco xmlInput={contentExist} onChange={handleEditorChange} />;
};

export { RawView };
