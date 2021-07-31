import { InterfaceType } from "../types/ILibcellml";

// Obtains list of standard interfaces
const AllInterfaceType = () => {
  const interfaceType = Object.values(InterfaceType);
  let res = interfaceType.slice(0, interfaceType.length / 2) as string[];
  return res.map((elm) => elm.toLowerCase());
};

export { AllInterfaceType };
