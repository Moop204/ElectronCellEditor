enum Elements {
  model,
  component,
  units,
  unit,
  reset,
  variable, // TODO: Remove maybe?
  connection,
  none, // For Model parents
  math,
}

const strToElm = (s: string) => {
  switch (s) {
    case "model":
      return Elements.model;
    case "component":
      return Elements.component;
    case "units":
      return Elements.units;
    case "reset":
      return Elements.reset;
    case "variable":
      return Elements.variable;
    case "unit":
      return Elements.unit;
    case "none":
      return Elements.none;
    case "connection":
      return Elements.connection;
    default:
      console.log(`ELEMENTS: Failed to identify ${s} as an Element`);
  }
  return null;
};

const elmToStr = (e: Elements): string => {
  switch (e) {
    case Elements.model:
      return "model";
    case Elements.component:
      return "component";
    case Elements.units:
      return "units";
    case Elements.reset:
      return "reset";
    case Elements.variable:
      return "variable";
    case Elements.unit:
      return "unit";
    case Elements.none:
      return "none";
    case Elements.connection:
      return "connection";

    default:
      console.log(`ELEMENTS: Failed to identify ${e} as an Element`);
  }
  return "";
};

export { Elements, strToElm, elmToStr };
