import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { EditorMonaco } from './EditorMonaco';
import { Event } from 'electron/renderer';
import { useEffect } from 'react';
const { ipcRenderer } = require('electron');
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

const RawView = (prop) => {
  const { setContentExist, contentExist, requestFile } = prop;

  const handleEditorChange = (value, event) => {
    setContentExist(value);
  };

  if (contentExist !== '') {
    return (
      <EditorMonaco xmlInput={contentExist} onChange={handleEditorChange} />
    );
  } else {
    return (
      <div>
        No Content
        <button onClick={requestFile}>Load a File</button>
      </div>
    );
  }
};

export { RawView };
