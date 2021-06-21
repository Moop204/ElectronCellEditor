import { InterfaceType } from "../types/ILibcellml";

const AllInterfaceType = () => {
  const interfaceType = Object.values(InterfaceType);
  let res = interfaceType.slice(0, interfaceType.length / 2) as string[];
  res = res.map((elm) => elm.toLowerCase());
  return res;
};

export { AllInterfaceType };
