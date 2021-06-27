import React, { FunctionComponent } from "react";
import { ctop } from "./ctop";
import MathJax from "mathjax3-react";

interface IMath {
  mathml: string;
}

// Turns content mathml into presentation mathml
// MathML written in cellml is always content type
const convertToPresentation = (mathml: string) => {
  const parser = new DOMParser();
  const documentSource = parser.parseFromString(mathml, "text/xml");
  const transform = parser.parseFromString(ctop, "text/xml");
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(transform);
  const resultDocument = xsltProcessor.transformToDocument(documentSource);

  const serializer = new XMLSerializer();
  const transformed = serializer.serializeToString(
    resultDocument.documentElement
  );
  return (
    '<math xmlns="http://www.w3.org/1998/Math/MathML">' +
    transformed +
    "</math>"
  );
  return transformed;
};

const PresentationMath: FunctionComponent<IMath> = ({ mathml }) => {
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

export { PresentationMath };
