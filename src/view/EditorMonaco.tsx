import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { languages, Position } from 'monaco-editor';
import { autoFill } from './Autofill';
import { loader, Monaco } from '@monaco-editor/react'; //import Util from 'util';
import { Path } from 'history';
const path = require('path');

interface EditorProp {
  xmlInput: string;
}

const config = () => {
  function ensureFirstBackSlash(str: string) {
    return str.length > 0 && str.charAt(0) !== '/' ? '/' + str : str;
  }

  function uriFromPath(_path: Path) {
    const pathName = path.resolve(_path).replace(/\\/g, '/');
    return encodeURI('file://' + ensureFirstBackSlash(pathName));
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
  const { xmlInput } = props;
  const handleBeforeMount = (monaco: Monaco) => {
    monaco.languages.registerCompletionItemProvider('xml', {
      provideCompletionItems: function (model, position, context, token) {
        // Provide stronger context
        // find out if we are completing a property in the 'dependencies' object.
        var textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });
        var word = model.getWordUntilPosition(position);
        var range = {
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
    />
  );
};

export { EditorMonaco };
