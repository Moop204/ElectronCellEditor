import { IXmlElement, IXmlJs } from "../../../backend/compressCellml";
import xml from "xml-js";

// Remove cellml references
// Required to stop MathJax from throwing errors
const removeCellMl = (mathml: IXmlElement) => {
  if (mathml.attributes) {
    const attrs = Object.keys(mathml.attributes);
    const attrs1 = attrs.filter((key) => {
      if (key.match(/^.*:.*$/)) {
        return true;
      } else {
        return false;
      }
    });
    attrs1.forEach((key) => {
      delete mathml.attributes[key];
    });
  }
  if (mathml.elements) {
    mathml.elements.forEach((element) => removeCellMl(element));
  }
  return mathml;
};

export { removeCellMl };
