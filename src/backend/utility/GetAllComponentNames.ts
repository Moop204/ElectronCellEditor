import { ComponentEntity } from "../../types/ILibcellml";

// Gathers all component names from a model recursively
const getAllComponentNames = (res: string[], parent: ComponentEntity) => {
  const componentCount = parent.componentCount();
  for (let i = 0; i < componentCount; i++) {
    const cur = parent.componentByIndex(i);
    res = getAllComponentNames(res, cur);
    res.push(cur.name());
  }
  return res;
};

export { getAllComponentNames };
