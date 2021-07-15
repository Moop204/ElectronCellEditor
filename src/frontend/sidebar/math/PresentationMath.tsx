import React, { FunctionComponent } from "react";
import { ctop } from "./ctop";
import MathJax from "mathjax3-react";
import { stripMath } from "./stripMath";
import { splitMath } from "./splitMath";

interface IMath {
  mathml: string;
}

// Turns content mathml into presentation mathml
// MathML written in cellml is always content type
const convertToPresentation = (mathml: string) => {
  // Stripping mathml of math outer tag
  mathml = stripMath(mathml);
  console.log(mathml);
  // Processing
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
};

const PresentFormula: FunctionComponent<IMath> = ({ mathml }) => {
  return (
    <MathJax.Html
      html={
        `<div style="color:red; text-align:center;">` +
        convertToPresentation(mathml) +
        `</div>`
      }
    />
  );
};

const PresentationMath: FunctionComponent<IMath> = ({ mathml }) => {
  const formulas = splitMath(mathml);
  return (
    <div>
      <MathJax.Provider>
        {formulas.map((formula) => (
          <PresentFormula mathml={formula} />
        ))}
      </MathJax.Provider>
    </div>
  );
};

export { PresentationMath, convertToPresentation };
