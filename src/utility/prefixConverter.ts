import { Prefix } from "../types/ILibcellml";

// Obtains list of standard named prefix
const AllPrefix = (): string[] => {
  const values = Object.values(Prefix);
  let res = values.slice(0, values.length / 2) as string[];
  return res.map((elm) => elm.toLowerCase());
};

export { AllPrefix };
