import Range, { Monaco } from "@monaco-editor/loader";
import { ElementObject } from "./ElementObject";

const documentationTemplate = (
  elementObject: ElementObject,
  range: Range,
  monaco: Monaco
) => {
  const { label, insertion, tooltip } = elementObject;
  return {
    kind: monaco.languages.CompletionItemKind.Constant,
    label: label,
    insertText: insertion,
    insertTextRules: monaco.languages.CompletionItemKind.Snippet,
    description: tooltip,
    documentation: tooltip,
    range: range,
  };
};

const elementList: ElementObject[] = [
  { label: "model", insertion: "model name=", tooltip: `wip` },
  { label: "import", insertion: "import", tooltip: `wip` },
  //  { label: 'units', insertion: 'units name="', tooltip: `wip` },
  //  { label: 'unit', insertion: 'unit units="', tooltip: `wip` },
  { label: "component", insertion: 'component name="', tooltip: `wip` },
  { label: "variable", insertion: 'variable name="', tooltip: `wip` },
  { label: "reset", insertion: 'reset variable="', tooltip: `wip` },
  { label: "reset_value", insertion: "reset_value", tooltip: `wip` },
  { label: "test_value", insertion: "test_value", tooltip: `wip` },
  { label: "math", insertion: "math", tooltip: `wip` },
  { label: "ci", insertion: "ci", tooltip: `wip` },
  { label: "cn", insertion: "cn", tooltip: `wip` },
  { label: "sep", insertion: "sep", tooltip: `wip` },
  { label: "apply", insertion: "apply", tooltip: `wip` },
  { label: "piecewise", insertion: "piecewise", tooltip: `wip` },
  { label: "piece", insertion: "piece", tooltip: `wip` },
  { label: "otherwise", insertion: "otherwise", tooltip: `wip` },
  { label: "eq", insertion: "eq", tooltip: `wip` },
  { label: "neg", insertion: "neg", tooltip: `wip` },
  { label: "gt", insertion: "gt", tooltip: `wip` },
  { label: "lt", insertion: "lt", tooltip: `wip` },
  { label: "geq", insertion: "geq", tooltip: `wip` },
  { label: "leq", insertion: "leq", tooltip: `wip` },
  { label: "and", insertion: "and", tooltip: `wip` },
  { label: "or", insertion: "or", tooltip: `wip` },
  { label: "xor", insertion: "xor", tooltip: `wip` },
  { label: "not", insertion: "not", tooltip: `wip` },
  { label: "plus", insertion: "plus", tooltip: `wip` },
  { label: "minus", insertion: "minus", tooltip: `wip` },
  { label: "times", insertion: "times", tooltip: `wip` },
  { label: "divide", insertion: "divide", tooltip: `wip` },
  { label: "power", insertion: "power", tooltip: `wip` },
  { label: "root", insertion: "root", tooltip: `wip` },
  { label: "abs", insertion: "abs", tooltip: `wip` },
  { label: "exp", insertion: "exp", tooltip: `wip` },
  { label: "ln", insertion: "ln", tooltip: `wip` },
  { label: "log", insertion: "log", tooltip: `wip` },
  { label: "floor", insertion: "floor", tooltip: `wip` },
  { label: "ceiling", insertion: "ceiling", tooltip: `wip` },
  { label: "min", insertion: "min", tooltip: `wip` },
  { label: "max", insertion: "max", tooltip: `wip` },
  { label: "rem", insertion: "rem", tooltip: `wip` },
  { label: "diff", insertion: "diff", tooltip: `wip` },
  { label: "bvar", insertion: "bvar", tooltip: `wip` },
  { label: "logbase", insertion: "logbase", tooltip: `wip` },
  { label: "degree", insertion: "degree", tooltip: `wip` },
  { label: "sin", insertion: "sin", tooltip: `wip` },
  { label: "cos", insertion: "cos", tooltip: `wip` },
  { label: "tan", insertion: "tan", tooltip: `wip` },
  { label: "sec", insertion: "sec", tooltip: `wip` },
  { label: "csc", insertion: "csc", tooltip: `wip` },
  { label: "cot", insertion: "cot", tooltip: `wip` },
  { label: "sinh", insertion: "sinh", tooltip: `wip` },
  { label: "cosh", insertion: "cosh", tooltip: `wip` },
  { label: "tanh", insertion: "tanh", tooltip: `wip` },
  { label: "sech", insertion: "sech", tooltip: `wip` },
  { label: "csch", insertion: "csch", tooltip: `wip` },
  { label: "coth", insertion: "coth", tooltip: `wip` },
  { label: "arcsin", insertion: "arcsin", tooltip: `wip` },
  { label: "arccos", insertion: "arccos", tooltip: `wip` },
  { label: "arctan", insertion: "arctan", tooltip: `wip` },
  { label: "arcsec", insertion: "arcsec", tooltip: `wip` },
  { label: "arccsc", insertion: "arccsc", tooltip: `wip` },
  { label: "arccot", insertion: "arccot", tooltip: `wip` },
  { label: "arcsinh", insertion: "arcsinh", tooltip: `wip` },
  { label: "arccosh", insertion: "arccosh", tooltip: `wip` },
  { label: "arctanh", insertion: "arctanh", tooltip: `wip` },
  { label: "arcsech", insertion: "arcsech", tooltip: `wip` },
  { label: "arccsch", insertion: "arccsch", tooltip: `wip` },
  { label: "arccoth", insertion: "arccoth", tooltip: `wip` },
  { label: "pi", insertion: "pi", tooltip: `wip` },
  { label: "exponentiale", insertion: "exponentiale", tooltip: `wip` },
  { label: "notanumber", insertion: "notanumber", tooltip: `wip` },
  { label: "infinity", insertion: "infinity", tooltip: `wip` },
  { label: "true", insertion: "true", tooltip: `wip` },
  { label: "false", insertion: "false", tooltip: `wip` },
  { label: "encapsulation", insertion: 'encapsulation"', tooltip: `wip` },
  {
    label: "component_ref",
    insertion: 'component_ref component="',
    tooltip: `wip`,
  },
  {
    label: "connection",
    insertion: 'connection component_1="',
    tooltip: `wip`,
  },
  {
    label: "map_variables",
    insertion: 'map_variables variable_1="',
    tooltip: `wip`,
  },
];

const attributesList = [
  { label: "name", insertion: "name", tooltip: `wip` },
  { label: "href", insertion: "href", tooltip: `wip` },
  { label: "units_ref", insertion: "units_ref", tooltip: `wip` },
  { label: "component_ref", insertion: "component_ref", tooltip: `wip` },
  { label: "units", insertion: "units", tooltip: `wip` },
  { label: "prefix", insertion: "prefix", tooltip: `wip` },
  { label: "multiplier", insertion: "multiplier", tooltip: `wip` },
  { label: "exponent", insertion: "exponent", tooltip: `wip` },
  { label: "variable", insertion: "variable", tooltip: `wip` },
  { label: "test_variable", insertion: "test_variable", tooltip: `wip` },
  { label: "order", insertion: "order", tooltip: `wip` },
  { label: "component", insertion: "component", tooltip: `wip` },
  { label: "component_1", insertion: "component_1", tooltip: `wip` },
  { label: "component_2", insertion: "component_2", tooltip: `wip` },
  { label: "variable_1", insertion: "variable_1", tooltip: `wip` },
  { label: "variable_2", insertion: "variable_2", tooltip: `wip` },
];

const constantsList = [
  { label: "ampere", insertion: "ampere", tooltip: `wip` },
  { label: "becquerel", insertion: "becquerel", tooltip: `wip` },
  { label: "candela", insertion: "candela", tooltip: `wip` },
  { label: "coulomb", insertion: "coulomb", tooltip: `wip` },
  { label: "dimensionless", insertion: "dimensionless", tooltip: `wip` },
  { label: "farad", insertion: "farad", tooltip: `wip` },
  { label: "gram", insertion: "gram", tooltip: `wip` },
  { label: "gray", insertion: "gray", tooltip: `wip` },
  { label: "henry", insertion: "henry", tooltip: `wip` },
  { label: "hertz", insertion: "hertz", tooltip: `wip` },
  { label: "joule", insertion: "joule", tooltip: `wip` },
  { label: "katal", insertion: "katal", tooltip: `wip` },
  { label: "kelvi", insertion: "kelvi", tooltip: `wip` },
  { label: "kilogram", insertion: "kilogram", tooltip: `wip` },
  { label: "litre", insertion: "litre", tooltip: `wip` },
  { label: "lumen", insertion: "lumen", tooltip: `wip` },
  { label: "lux", insertion: "lux", tooltip: `wip` },
  { label: "metre", insertion: "metre", tooltip: `wip` },
  { label: "mole", insertion: "mole", tooltip: `wip` },
  { label: "newton", insertion: "newton", tooltip: `wip` },
  { label: "ohm", insertion: "ohm", tooltip: `wip` },
  { label: "pascal", insertion: "pascal", tooltip: `wip` },
  { label: "radian", insertion: "radian", tooltip: `wip` },
  { label: "second", insertion: "second", tooltip: `wip` },
  { label: "siemens", insertion: "siemens", tooltip: `wip` },
  { label: "sievert", insertion: "sievert", tooltip: `wip` },
  { label: "steradian", insertion: "steradian", tooltip: `wip` },
  { label: "tesla", insertion: "tesla", tooltip: `wip` },
  { label: "volt", insertion: "volt", tooltip: `wip` },
  { label: "watt", insertion: "watt", tooltip: `wip` },
  { label: "weber", insertion: "weber", tooltip: `wip` },
  { label: "yotta", insertion: "yotta", tooltip: `wip` },
  { label: "zetta", insertion: "zetta", tooltip: `wip` },
  { label: "exa", insertion: "exa", tooltip: `wip` },
  { label: "peta", insertion: "peta", tooltip: `wip` },
  { label: "tera", insertion: "tera", tooltip: `wip` },
  { label: "giga", insertion: "giga", tooltip: `wip` },
  { label: "mega", insertion: "mega", tooltip: `wip` },
  { label: "kilo", insertion: "kilo", tooltip: `wip` },
  { label: "hecto", insertion: "hecto", tooltip: `wip` },
  { label: "deca", insertion: "deca", tooltip: `wip` },
  { label: "deci", insertion: "deci", tooltip: `wip` },
  { label: "centi", insertion: "centi", tooltip: `wip` },
  { label: "milli", insertion: "milli", tooltip: `wip` },
  { label: "micro", insertion: "micro", tooltip: `wip` },
  { label: "nano", insertion: "nano", tooltip: `wip` },
  { label: "pico", insertion: "pico", tooltip: `wip` },
  { label: "femto", insertion: "femto", tooltip: `wip` },
  { label: "atto", insertion: "atto", tooltip: `wip` },
  { label: "zepto", insertion: "zepto", tooltip: `wip` },
  { label: "yocto", insertion: "yocto", tooltip: `wip` },
];

interface DocumentationTemplate {
  kind: any;
  label: string;
  insertText: string;
  insertTextRules: any;
  description: string;
  documentation: string;
  range: Range;
}

const autoFill = (range: any, monaco: Monaco): DocumentationTemplate[] => {
  const result: DocumentationTemplate[] = [];
  // const elms = elementList.map((element: elementObject) => {
  //   result.push(docElementTemplate(element, range, monaco));
  // });
  // const consts = constantsList.map((element: elementObject) => {
  //   result.push(documentationTemplate(element, range, monaco));
  // });

  attributesList.map((element: ElementObject) => {
    result.push(documentationTemplate(element, range, monaco));
  });

  return result;
};

export { autoFill };
