import FileManagement from "../FileManagement";

const getAllUnitsNames = async (fm: FileManagement) => {
  if (!fm._cellmlLoaded) {
    await fm.init();
  }
  const model = fm._parser.parseModel(fm.content);
  const res = [];
  const unitsCount = model.unitsCount();
  for (let i = 0; i < unitsCount; i++) {
    res.push(model.unitsByIndex(i).name());
  }
  return res;
};

export { getAllUnitsNames };
