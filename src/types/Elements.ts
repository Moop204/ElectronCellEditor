enum Elements {
  model,
  component,
  units,
  reset,
  variable, // TODO: Remove maybe?
  none, // For Model parents
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
    case 'none':
      return Elements.none;
    default:
      console.log(`ELEMENTS: Failed to identify ${s} as an Element`);
  }
  return null;
};

const elmToStr = (e: Elements): string => {
  switch (e) {
    case Elements.model:
      return 'model';
    case Elements.component:
      return 'component';
    case Elements.units:
      return 'units';
    case Elements.reset:
      return 'reset';
    case Elements.variable:
      return 'variable';
    case Elements.none:
      return 'none';

    default:
      console.log(`ELEMENTS: Failed to identify ${e} as an Element`);
  }
  return '';
};

export { Elements, strToElm, elmToStr };
