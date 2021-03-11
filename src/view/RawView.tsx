const { ipcRenderer } = require('electron');
import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { EditorXml } from './EditorXml';
import { XmlEditor } from 'react-xml-editor';
//import Util from 'util';

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

const RawView = () => {
  const [contentExist, setContentExist] = useState('');

  const requestFile = (event: React.MouseEvent) => {
    ipcRenderer.invoke('loadFile', 'ping').then((res: any) => {
      setContentExist(res);
    });
    console.log('SENT PING');
  };

  const StartButton = () => {
    const style = rawStyles();
    // return (
    //     <div>
    //         <button onClick={requestFile}>
    //             Click me for content
    //         </button>
    //         <code className={style.content}  contentEditable="true">
    //         {contentExist}
    //         </code>
    //     </div>
    // )

    const demoProps = {
      mode: 'laic',
    };

    if (contentExist) {
      return (
        <div className={style.rawView}>
          <EditorXml xmlInput={contentExist} {...demoProps} />
        </div>
      );
    } else {
      return (
        <div>
          No Content
          <button onClick={requestFile}>Click me for content</button>
        </div>
      );
    }
  };

  return (
    <div>
      <StartButton />
    </div>
  );
};

export { RawView };
