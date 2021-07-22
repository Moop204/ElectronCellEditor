import React, { FunctionComponent } from "react";
import { ctop } from "./ctop";
import MathJax from "mathjax3-react";
import { stripMath } from "./stripMath";
import { splitMath } from "./splitMath";
import { Grid } from "@material-ui/core";

interface IMath {
  mathml: string;
}

const ErrorMathMl: FunctionComponent = () => {
  return <div>Invalid MathML Input</div>;
};

// Turns content mathml into presentation mathml
// MathML written in cellml is always content type
const convertToPresentation = (mathml: string) => {
  // Stripping mathml of math outer tag
  const strippedMathml = stripMath(mathml);
  if (mathml !== "" && strippedMathml === "") {
    return <ErrorMathMl />;
  }
  console.log(mathml);
  // Processing
  const parser = new DOMParser();
  const documentSource = parser.parseFromString(strippedMathml, "text/xml");
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
  if (formulas.length === 0) {
    return <ErrorMathMl />;
  }
  return (
    <Grid style={{ textTransform: "none" }}>
      {/* <MathJax.Provider> */}
      {formulas.map((formula) => (
        <PresentFormula mathml={formula} />
      ))}
      {/* </MathJax.Provider> */}
    </Grid>
  );
};

export { PresentationMath, convertToPresentation };
