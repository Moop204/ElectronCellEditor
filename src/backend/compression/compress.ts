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
  reset.elements.map((elm: IElement) => {
    if (elm.name === 'reset_value') {
      reset.attributes.reset_value = xml.json2xml(elm.elements[0]);
    } else if (elm.name === 'test_value') {
      reset.attributes.test_value = xml.json2xml(elm.elements[0]);
    }
    return elm;
  });
  reset.elements = [];
  return reset;
};

// Inside components
const parseComponent = (elms: IElement[]) => {
  let math = '';
  const newElm: IElement[] = [];
  elms.map((elm: IElement) => {
    // When facing Math
    if (elm.name === 'math') {
      // Take Math
      // Stringify it
      math += xml.json2xml(elm);
    } else if (elm.name === 'reset') {
      newElm.push(parseReset(elm));
    } else {
      newElm.push(elm);
    }
  });
  return { newElm, math };
};

// ComponentMap refers to the list of all components
// Elms are the elements of the parent
const parseEncapsulationReferences = (
  elms: IElement[],
  componentMap: Record<string, any>
) => {
  if (elms === undefined || elms === []) {
    return [];
  }
  const res = [];
  for (let i = 0; i < elms.length; i += 1) {
    const elm = elms[i];
    // Replace with component
    if (elm.attributes.component) {
      const conciseComponent: IElement = componentMap[elm.attributes.component];
      // Append rest as children recursively
      conciseComponent.elements = [
        ...(conciseComponent ? conciseComponent.elements : []),
        ...parseEncapsulationReferences(elms ? elm.elements : [], componentMap),
      ];
      res.push(conciseComponent);
    }
  }
  return res;
};

const compressCellml = (s: string) => {
  const parsed: IXmlJs = JSON.parse(
    xml.xml2json(s, { compact: false, spaces: 4 })
  );

  const componentMap: Record<string, any> = [];
  const newElements: IElement[] = [];

  parsed.elements[0].elements.map((elm: IElement) => {
    // For child of model
    if (elm.name === 'component') {
      const { newElm, math } = parseComponent(elm.elements || []);
      elm.elements = newElm;
      // Assign math as an attribute
      elm.attributes.math = math;
      // newElements.push(elm);
      componentMap[elm.attributes.name] = elm;
    } else if (elm.name === 'import') {
      // Reduce imports
      elm.elements.map((childElm: IElement) => {
        const newElm = childElm;
        newElm.name = `imported-${newElm.name}`;
        newElm.attributes['xlink:href'] = elm.attributes['xlink:href'];
        newElm.attributes['xmlns:xlink'] = elm.attributes['xmlns:xlink'];
        newElements.push(newElm);
      });
    } else if (elm.name === 'connection' || elm.name === 'map_variable') {
      // empty
    } else {
      newElements.push(elm);
    }
  });

  let finalElements: IElement[] = [];

  for (let i = 0; i < newElements.length; i += 1) {
    const newElm = newElements[i];
    // elm = newElements[i];
    if (newElm.name !== 'encapsulation') {
      finalElements.push(newElm);
      // finalElements.push(elm);
    } else {
      const compressedComponents = parseEncapsulationReferences(
        newElm.elements,
        // elm.elements,
        componentMap
      );
      finalElements = [...finalElements, ...compressedComponents];
    }
  }
  parsed.elements[0].elements = finalElements;

  // Parse to remove encapsulation and sub variables
  const result = xml.json2xml(parsed, { spaces: 4 });
  return result;
};

export { compressCellml };
