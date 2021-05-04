/* eslint-disable array-callback-return */
const xml = require('xml-js');

interface IDecl {
  attributes: {
    version: string;
    encoding: string;
  };
}

interface IElement {
  type: string;
  name: string;
  attributes: any;
  elements: IElement[];
}

interface IXmlJs {
  declaration: IDecl;
  elements: IElement[];
}

const parseReset = (reset: IElement) => {
  console.log(reset);
  reset.elements = reset.elements.map((elm: IElement) => {
    elm.attributes = {};
    if (elm.name === 'reset_value') {
      elm.attributes.math = xml.json2xml(elm.elements[0]);
      elm.elements = [];
    } else if (elm.name === 'test_value') {
      elm.attributes.math = xml.json2xml(elm.elements[0]);
      elm.elements = [];
    }
    return elm;
  });
  return reset;
};

// Inside components
const parseComponent = (elms: IElement[]) => {
  let math = '';
  const newElm: IElement[] = [];
  elms.map((elm: IElement) => {
    // When facing Math
    // Take Math
    // Stringify it
    if (elm.name === 'math') {
      math += xml.json2xml(elm);
    } else if (elm.name === 'reset') {
      newElm.push(parseReset(elm));
    } else {
      newElm.push(elm);
    }
  });
  return { newElm, math };
};

const compressCellml = (s: string) => {
  const parsed: IXmlJs = JSON.parse(
    xml.xml2json(s, { compact: false, spaces: 4 })
  );

  console.log(parsed);
  const componentMap: Record<string, any> = [];
  const newElements: IElement[] = [];
  parsed.elements[0].elements.map((elm: IElement) => {
    if (elm.name === 'component' && elm.elements) {
      const { newElm, math } = parseComponent(elm.elements);
      elm.elements = newElm;
      // Assign math as an attribute
      elm.attributes.math = math;
      newElements.push(elm);
      componentMap[elm.name] = elm;
    } else if (elm.name === 'import') {
      // Reduce imports
      console.log(elm);
      elm.elements.map((childElm: IElement) => {
        const newElm = childElm;
        newElm.name = `imported-${newElm.name}`;
        newElm.attributes['xlink:href'] = elm.attributes['xlink:href'];
        newElm.attributes['xmlns:xlink'] = elm.attributes['xmlns:xlink'];
        newElements.push(newElm);
      });
    } else {
      newElements.push(elm);
    }
  });
  parsed.elements[0].elements = newElements;

  // Parse to remove encapsulation and sub variables

  const result = xml.json2xml(parsed);
  return result;
};

export { compressCellml };
