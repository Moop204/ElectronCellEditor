import { XmlEditor } from 'react-xml-editor';
import Builder from 'react-xml-editor/lib/Builder';
import React, { useState } from 'react';
import { docSpec } from './Specification';
import './css/xonomy.css';
import { FunctionComponent } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

interface IEditor {
  xmlInput: string;
}

const EditorXml: FunctionComponent<IEditor> = ({ xmlInput }) => {
  const editorRef = useRef<XmlEditor | null>(null);
  const [xml, setXml] = useState(xmlInput);
  console.log('>>> XML INPUT <<<');
  console.log(xmlInput);
  const onClickHarvest = () => {
    if (editorRef.current) {
      const builder = new Builder({});
      const xml = editorRef.current.getXml();
      if (xml) {
        setXml(builder.buildObject(xml));
      }
    }
  };

  return (
    <>
      <div>
        <XmlEditor
          key={xmlInput}
          docSpec={docSpec}
          ref={editorRef}
          xml={xmlInput}
          mode="laic"
        />
      </div>
    </>
  );
};

export default EditorXml;
