import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { ctop } from "./ctop";
import MathJax from "mathjax3-react";
import { stripMath } from "./stripMath";
import { splitMath } from "./splitMath";
import { Grid } from "@material-ui/core";

const parser = new DOMParser();
const xsltProcessor = new XSLTProcessor();
const serializer = new XMLSerializer();
const transform = parser.parseFromString(ctop, "text/xml");
xsltProcessor.importStylesheet(transform);

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
  // console.log(mathml);
  // Processing

  const documentSource = parser.parseFromString(strippedMathml, "text/xml");
  const resultDocument = xsltProcessor.transformToDocument(documentSource);
  const transformed = serializer.serializeToString(
    resultDocument.documentElement
  );

  return (
    '<math xmlns="http://www.w3.org/1998/Math/MathML">' +
    transformed +
    "</math>"
  );
};

// const PresentFormula: FunctionComponent<IMath> = ({ mathml }) => {
//   const memod = useMemo(() => convertToPresentation(mathml), [mathml]);

//   return (
//     <MathJax.Html
//       html={`<div style="color:red; text-align:center;">` + memod + `</div>`}
//     />
//   );
// };

const PresentationMath: FunctionComponent<IMath> = ({ mathml }) => {
  const [formulas, setFormulas] = useState<string[]>([]);

  // const stringFormulas = splitMath(mathml);
  useEffect(() => {
    const stringFormulas = splitMath(mathml);
    setFormulas(
      stringFormulas.map(
        (formula) =>
          `<div style="color:red; text-align:center;">` +
          convertToPresentation(formula) +
          `</div>`
      )
    );
  }, [mathml]);

  if (formulas.length === 0) {
    return (
      <Grid style={{ textTransform: "none" }}>
        <ErrorMathMl />
      </Grid>
    );
  }

  return (
    <Grid style={{ textTransform: "none" }}>
      {/* <MathJax.Provider> */}
      {formulas.map((formula) => (
        <MathJax.Html html={formula} />
      ))}
      {/* </MathJax.Provider> */}
    </Grid>
  );
};

export { PresentationMath, convertToPresentation };
