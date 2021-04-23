import React, { useState } from 'react';
import { languages, Position } from 'monaco-editor';
import Editor, { loader, Monaco } from '@monaco-editor/react';
import { Path } from 'history';
import { autoFill } from './Autofill';

const path = require('path');

interface EditorProp {
  xmlInput: string;
  onChange: any;
}

const config = () => {
  function ensureFirstBackSlash(str: string) {
    return str.length > 0 && str.charAt(0) !== '/' ? `/${str}` : str;
  }

  function uriFromPath(_path: Path) {
    const pathName = path.resolve(_path).replace(/\\/g, '/');
    return encodeURI(`file://${ensureFirstBackSlash(pathName)}`);
  }

  loader.config({
    paths: {
      vs: uriFromPath(
        path.join(__dirname, '../node_modules/monaco-editor/min/vs')
      ),
    },
  });
};

const EditorMonaco = (props: EditorProp) => {
  config();
  const { xmlInput, onChange } = props;
  const handleBeforeMount = (monaco: Monaco) => {
    monaco.languages.registerCompletionItemProvider('xml', {
      provideCompletionItems(model, position, context, token) {
        // Provide stronger context
        // find out if we are completing a property in the 'dependencies' object.
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });
        const word = model.getWordUntilPosition(position);
        const range: Range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: autoFill(range, monaco),
        };
      },
    });
  };

  return (
    <Editor
      height="90vh"
      defaultLanguage="xml"
      defaultValue={xmlInput}
      beforeMount={handleBeforeMount}
      onChange={onChange}
    />
  );
};

export { EditorMonaco };
