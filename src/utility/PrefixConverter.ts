import { Prefix } from "../types/ILibcellml";

const AllPrefix = () => {
  const values = Object.values(Prefix);
  let res = values.slice(0, values.length / 2) as string[];
  res = res.map((elm) => elm.toLowerCase());
  return res;
};

export { AllPrefix };
