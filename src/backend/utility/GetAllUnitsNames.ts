import { Parser } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";

const getAllUnitsNames = async (fm: FileManagement) => {
  if (!fm._cellmlLoaded) {
    await fm.init();
  }
  const libcellml = fm._cellml;
  const parser: Parser = new libcellml.Parser();
  const model = parser.parseModel(fm.content);
  const res = [];
  const unitsCount = model.unitsCount();
  for (let i = 0; i < unitsCount; i++) {
    res.push(model.unitsByIndex(i).name());
  }
  return res;
};

export { getAllUnitsNames };
