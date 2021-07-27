import { IXmlElement, IXmlJs } from "../../../backend/compressCellml";
import xml from "xml-js";
import { removeCellMl } from "./removeCellMl";

// Remove the Math element for transformation
const stripMath = (mathml: string) => {
  try {
    const parsed: IXmlJs = JSON.parse(
      xml.xml2json(mathml, { compact: false, spaces: 4 })
    );
    parsed.elements.forEach((elements) => removeCellMl(elements));
    parsed.elements = parsed.elements[0].elements;
    const stripped = xml.json2xml(JSON.stringify(parsed), {
      spaces: 4,
    });
    return stripped;
  } catch {
    return "";
  }
};

export { stripMath };
