import { IXmlElement, IXmlJs } from "../../../backend/compressCellml";
import xml from "xml-js";
import { Buffer } from "buffer";
import { string } from "yup/lib/locale";

const splitMath = (mathml: string): string[] => {
  // return [mathml];
  try {
    const parsed: IXmlJs = JSON.parse(
      xml.xml2json(mathml, { compact: false, spaces: 4 })
    );

    const mathElement: IXmlElement = parsed.elements[0];
    const listOfSecondLevelApply: any[] = mathElement.elements.map(
      (apply: IXmlElement) => {
        return apply;
      }
    );
    const res = listOfSecondLevelApply.map((apply) => {
      const mathHeading = mathElement;
      parsed.elements[0].elements = [apply];
      const stringedXml = xml.json2xml(JSON.stringify(parsed), {
        spaces: 4,
      });
      return stringedXml;
    });

    return res;
  } catch {
    return [];
  }
};

export { splitMath };
