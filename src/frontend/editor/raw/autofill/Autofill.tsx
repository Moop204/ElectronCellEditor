import Range, { Monaco } from "@monaco-editor/loader";
import { docElementTemplate } from "./docElementTemplate";
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
    insertTextRules: monaco.languages.CompletionItemKind.Class,
    description: "TIS DESCRIPTION", //tooltip,
    documentation: "YEAH ITS THE DOCO", //tooltip,
    detail: tooltip,
    range: range,
  };
};

// Tooltips taken from W3 Org's Documentation on MathML 3
// https://www.w3.org/TR/MathML3
// www.w3.org/TR/MathML3/chapter4.html
// Copyright © [10 April 2014] World Wide Web Consortium, (MIT, ERCIM, Keio, Beihang). http://www.w3.org/Consortium/Legal/2015/doc-license`,
const mathList: ElementObject[] = [
  {
    label: "ci",
    insertion: "ci",
    tooltip: `Content identifier used to refer to variables.`,
  },
  {
    label: "cn",
    insertion: "cn",
    tooltip: `Content number element used to represent numbers. Includes integers, real numbers, and double precision floating point numbers.`,
  },
  {
    label: "sep",
    insertion: "sep/>",
    tooltip: `A separator with different meaning depending on its parent. Please refer to https://www.w3.org/TR/MathML3/chapter4.html.`,
  },
  {
    label: "apply",
    insertion: "apply",
    tooltip: `Applies a function or operator to its children.`,
  },
  {
    label: "piecewise",
    insertion: "piecewise",
    tooltip: `Declares a piecewise function`,
  },
  {
    label: "piece",
    insertion: "piece",
    tooltip: `Declares a function of the piecewise function. Children describes expression taken from function and condition for function respectively.`,
  },
  {
    label: "otherwise",
    insertion: "otherwise",
    tooltip: `Declares a default function for the piecewise expression.`,
  },
  {
    label: "eq",
    insertion: "eq/>",
    tooltip: `Equality relationship for following arguments.`,
  },
  {
    label: "neg",
    insertion: "neg/>",
    tooltip: `Inequality relationship for two arguments.`,
  },
  {
    label: "gt",
    insertion: "gt/>",
    tooltip: `Greater than function. May be used on 2+ arguments for chain of inequalities.`,
  },
  {
    label: "lt",
    insertion: "lt/>",
    tooltip: `Less than function. May be used on 2+ arguments for chain of inequalities.`,
  },
  {
    label: "geq",
    insertion: "geq/>",
    tooltip: `Less than function. May be used on 2+ arguments for chain of inequalities.`,
  },
  {
    label: "leq",
    insertion: "leq/>",
    tooltip: `Less than equal function. May be used on 2+ arguments for chain of inequalities.`,
  },
  {
    label: "and",
    insertion: "and/>",
    tooltip: `Logical 'and' function for all arguments.`,
  },
  {
    label: "or",
    insertion: "or/>",
    tooltip: `Logical 'and' function or all arguments.`,
  },
  {
    label: "xor",
    insertion: "xor/>",
    tooltip: `Logical 'xor' function for all arguments.`,
  },
  { label: "not", insertion: "not/>", tooltip: `Logical 'not' function.` },
  {
    label: "plus",
    insertion: "plus/>",
    tooltip: `Addition operator is applied to all arguments.`,
  },
  {
    label: "minus",
    insertion: "minus/>",
    tooltip: `Minus operator is applied to all arguments.`,
  },
  { label: "times", insertion: "times/>", tooltip: `Multiplication operator.` },
  { label: "divide", insertion: "divide/>", tooltip: `Division operator.` },
  {
    label: "power",
    insertion: "power/>",
    tooltip: `Raises first argument to the power of the second.`,
  },
  { label: "root", insertion: "root/>", tooltip: `Root function.` },
  { label: "abs", insertion: "abs/>", tooltip: `Absolute value function.` },
  { label: "exp", insertion: "exp/>", tooltip: `Exponential function.` },
  { label: "ln", insertion: "ln/>", tooltip: `Natural logarithm function.` },
  {
    label: "log",
    insertion: "log/>",
    tooltip: `Logarithm function with a specific base.`,
  },
  {
    label: "floor",
    insertion: "floor/>",
    tooltip: `Floor function that rounds down to an integer towards negative infinity.`,
  },
  {
    label: "ceiling",
    insertion: "ceiling/>",
    tooltip: `Ceiling function that rounds up to an integer towards positive infinity.`,
  },
  {
    label: "min",
    insertion: "min/>",
    tooltip: `Minimum function that returns the smallest argument.`,
  },
  {
    label: "max",
    insertion: "max/>",
    tooltip: `Maximum function that returns the largest argument.`,
  },
  { label: "rem", insertion: "rem/>", tooltip: `Modulus operator.` },
  { label: "diff", insertion: "diff/>", tooltip: `Differentiation operator.` },
  { label: "bvar", insertion: "bvar", tooltip: `Bound variable.` },
  {
    label: "logbase",
    insertion: "logbase",
    tooltip: `Specifies the base of a logarithmic function`,
  },
  {
    label: "degree",
    insertion: "degree",
    tooltip: `Defines degree of root, moment and derivatives.`,
  },
  { label: "sin", insertion: "sin/>", tooltip: `Trigonometric sine function.` },
  {
    label: "cos",
    insertion: "cos/>",
    tooltip: `Trigonometric cosine function.`,
  },
  {
    label: "tan",
    insertion: "tan/>",
    tooltip: `Trigonometric tangent function.`,
  },
  {
    label: "sec",
    insertion: "sec/>",
    tooltip: `Trigonometric secant function.`,
  },
  {
    label: "csc",
    insertion: "csc/>",
    tooltip: `Trigonometric cosecant function.`,
  },
  {
    label: "cot",
    insertion: "cot/>",
    tooltip: `Trigonometric cotangent function.`,
  },
  { label: "sinh", insertion: "sinh/>", tooltip: `Hyperbolic sine function.` },
  {
    label: "cosh",
    insertion: "cosh/>",
    tooltip: `Hyperbolic cosine function.`,
  },
  {
    label: "tanh",
    insertion: "tanh/>",
    tooltip: `Hyperbolic tangent function.`,
  },
  {
    label: "sech",
    insertion: "sech/>",
    tooltip: `Hyperbolic secant function.`,
  },
  {
    label: "csch",
    insertion: "csch/>",
    tooltip: `Hyperbolic cosecant function.`,
  },
  {
    label: "coth",
    insertion: "coth/>",
    tooltip: `Hyperbolic cotangent function.`,
  },
  { label: "arcsin", insertion: "arcsin/>", tooltip: `Inverse sine function.` },
  {
    label: "arccos",
    insertion: "arccos/>",
    tooltip: `Inverse cosine function.`,
  },
  { label: "arctan", insertion: "arctan/>", tooltip: `Inverse sine function.` },
  {
    label: "arcsec",
    insertion: "arcsec/>",
    tooltip: `Inverse secant function.`,
  },
  {
    label: "arccsc",
    insertion: "arccsc/>",
    tooltip: `Inverse cosecant function.`,
  },
  {
    label: "arccot",
    insertion: "arccot/>",
    tooltip: `Inverse cotangent function.`,
  },
  {
    label: "arcsinh",
    insertion: "arcsinh/>",
    tooltip: `Inverse hyperbolic sine function.`,
  },
  {
    label: "arccosh",
    insertion: "arccosh/>",
    tooltip: `Inverse hyperbolic cosine function.`,
  },
  {
    label: "arctanh",
    insertion: "arctanh/>",
    tooltip: `Inverse hyperbolic tangent function.`,
  },
  {
    label: "arcsech",
    insertion: "arcsech/>",
    tooltip: `Inverse hyperbolic secant function.`,
  },
  {
    label: "arccsch",
    insertion: "arccsch/>",
    tooltip: `Inverse hyperbolic cosecant function.`,
  },
  {
    label: "arccoth",
    insertion: "arccoth/>",
    tooltip: `Inverse hyperbolic cotangent function.`,
  },
  { label: "pi", insertion: "pi/>", tooltip: `Pi constant.` },
  {
    label: "exponentiale",
    insertion: "exponentiale/>",
    tooltip: `Base of natural log constant.`,
  },
  {
    label: "notanumber",
    insertion: "notanumber/>",
    tooltip: `Represents not a number.`,
  },
  {
    label: "infinity",
    insertion: "infinity/>",
    tooltip: `Represents infinity.`,
  },
  { label: "true", insertion: "true/>", tooltip: `Boolean true.` },
  { label: "false", insertion: "false/>", tooltip: `Boolean false.` },
];

const elementList: ElementObject[] = [
  {
    label: "model",
    insertion: "model",
    tooltip: `Model CellML Element. Describes a CellML model within.`,
  },
  {
    label: "import",
    insertion: "import",
    tooltip: `Import CellML Element. Describes source of imported Units and Components.`,
  },
  //  { label: 'units', insertion: 'units name="', tooltip: `wip` },
  //  { label: 'unit', insertion: 'unit units="', tooltip: `wip` },
  {
    label: "component",
    insertion: "component",
    tooltip: `Component CellML Element.`,
  },
  {
    label: "variable",
    insertion: "variable",
    tooltip: `Variable CellML Element. Describes a variable of its parent Component.`,
  },
  {
    label: "reset",
    insertion: "reset",
    tooltip: `Reset CellML Element. Describes mathematical operations on variable values based on triggers.`,
  },
  {
    label: "reset_value",
    insertion: "reset_value",
    tooltip: `CellML Element that describes the new value of 'variable' attribute in Reset.`,
  },
  {
    label: "test_value",
    insertion: "test_value",
    tooltip: `CellML Element that describes the value of 'test_variable which triggers the Reset element.`,
  },
  {
    label: "math",
    insertion: "math",
    tooltip: `Describes a mathematical formula in MathML.`,
  },
  {
    label: "encapsulation",
    insertion: 'encapsulation"',
    tooltip: `Describes relationship between Components.`,
  },
  {
    label: "component_ref",
    insertion: 'component_ref component="',
    tooltip: `A reference to the name of a Component.`,
  },
  {
    label: "connection",
    insertion: 'connection component_1="',
    tooltip: `Describes connection between two Components.`,
  },
  {
    label: "map_variables",
    insertion: 'map_variables variable_1="',
    tooltip: `States equivalence of two Variables.`,
  },
];

const attributesList = [
  { label: "name", insertion: "name", tooltip: `Name of CellML Element.` },
  { label: "href", insertion: "href", tooltip: `Reference to a resource.` },
  {
    label: "units_ref",
    insertion: "units_ref",
    tooltip: `Reference to name of a Units.`,
  },
  {
    label: "component_ref",
    insertion: "component_ref",
    tooltip: `Reference to name of a Component.`,
  },
  {
    label: "units",
    insertion: "units",
    tooltip: `Reference to a Standard International System of Units or name of custom Units.`,
  },
  {
    label: "prefix",
    insertion: "prefix",
    tooltip: `Prefix of a Units. Describes the exponential of 10 which is then multiplied to the value of the Variable.`,
  },
  {
    label: "multiplier",
    insertion: "multiplier",
    tooltip: `Real number which the value of the Unit will be multiplied by.`,
  },
  {
    label: "exponent",
    insertion: "exponent",
    tooltip: `Real number which acts as the exponent of the Units.`,
  },
  {
    label: "variable",
    insertion: "variable",
    tooltip: `Reference to a Variable which will have its value changed when the Reset is triggered.`,
  },
  {
    label: "test_variable",
    insertion: "test_variable",
    tooltip: `Reference to a Variable which will trigger the Reset.`,
  },
  {
    label: "order",
    insertion: "order",
    tooltip: `Priority of Resets being triggered. Lower values are prioritised first.`,
  },
  {
    label: "component",
    insertion: "component",
    tooltip: `Reference to a Component.`,
  },
  {
    label: "component_1",
    insertion: "component_1",
    tooltip: `Reference to a Component. Cannot be the same as component_2.`,
  },
  {
    label: "component_2",
    insertion: "component_2",
    tooltip: `Reference to a Component. Cannot be the same as component_1.`,
  },
  {
    label: "variable_1",
    insertion: "variable_1",
    tooltip: `Reference to a Variable that is equivalent to variable_2. Cannot be the same as variable_2.`,
  },
  {
    label: "variable_2",
    insertion: "variable_2",
    tooltip: `Reference to a Variable that is equivalent to variable_1. Cannot be the same as variable_1.`,
  },
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

interface AutoFillOption {
  cellml: boolean;
  mathml: boolean;
}

const autoFill = (
  range: any,
  monaco: Monaco,
  option: AutoFillOption = { cellml: true, mathml: true }
): DocumentationTemplate[] => {
  const result: DocumentationTemplate[] = [];

  if (option.cellml) {
    attributesList.map((element: ElementObject) => {
      result.push(documentationTemplate(element, range, monaco));
    });
    elementList.map((element: ElementObject) => {
      result.push(docElementTemplate(element, range, monaco));
    });
  }
  if (option.mathml) {
    mathList.map((element: ElementObject) => {
      result.push(documentationTemplate(element, range, monaco));
    });
    constantsList.map((element: ElementObject) => {
      result.push(documentationTemplate(element, range, monaco));
    });
  }

  return result;
};

export { autoFill, AutoFillOption };
