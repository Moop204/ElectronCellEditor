import React from 'react';
import { ctop } from '../utils/ctop';
import MathJax from 'mathjax3-react';

interface IMath {
  mathml: string;
}

// Turns content mathml into presentation mathml
// MathML written in cellml is always content type
const convertToPresentation = (mathml: string) => {
  const parser = new DOMParser();
  console.log(`MathML: ` + mathml);
  const documentSource = parser.parseFromString(mathml, 'text/xml');
  console.log(`ctop: ` + ctop);
  const transform = parser.parseFromString(ctop, 'text/xml');
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(transform);
  const resultDocument = xsltProcessor.transformToDocument(documentSource);

  var serializer = new XMLSerializer();
  var transformed = serializer.serializeToString(
    resultDocument.documentElement
  );
  console.log(`res: ` + transformed);
  return '<math>' + transformed + '</math>';
  return transformed;
};

const Math = ({ mathml }: IMath) => {
  return (
    <div>
      <MathJax.Provider>
        <MathJax.Html
          html={
            `<p style="color:red; text-align:center;">` +
            convertToPresentation(mathml) +
            `</p>`
          }
        />
      </MathJax.Provider>
    </div>
  );
};

export { Math };
