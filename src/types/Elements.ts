enum Elements {
  model,
  component,
  units,
  reset,
  variable, // TODO: Remove maybe?
}

const strToElm = (s: string) => {
  switch (s) {
    case 'model':
      return Elements.model;
    case 'component':
      return Elements.component;
    case 'units':
      return Elements.units;
    case 'reset':
      return Elements.reset;
    case 'variable':
      return Elements.variable;
    default:
      console.log(`ELEMENTS: Failed to identify ${s} as an Element`);
  }
  return null;
};

export { Elements, strToElm };
