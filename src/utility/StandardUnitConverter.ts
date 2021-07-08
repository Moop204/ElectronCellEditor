import { StandardUnit } from "../types/ILibcellml";

const AllStandardUnits = () => {
  const standardValues = Object.values(StandardUnit);
  let res = standardValues.slice(0, standardValues.length / 2) as string[];
  res = res.map((elm) => elm.toLowerCase());
  return res;
};

export { AllStandardUnits };
