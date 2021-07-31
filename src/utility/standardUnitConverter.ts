import { StandardUnit } from "../types/ILibcellml";

// Provides a list of all base units in CellML
const allStandardUnits = (): string[] => {
  const standardValues = Object.values(StandardUnit);
  let res = standardValues.slice(0, standardValues.length / 2) as string[];
  return res.map((elm) => elm.toLowerCase());
};

export { allStandardUnits };
