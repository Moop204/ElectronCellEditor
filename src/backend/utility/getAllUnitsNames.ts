import FileManagement from "../FileManagement";

const getAllUnitsNames = async (fm: FileManagement) => {
  if (!fm._cellmlLoaded) {
    await fm.init();
  }
  try {
    const model = fm._parser.parseModel(fm.content);
    const res = [];
    const unitsCount = model.unitsCount();
    for (let i = 0; i < unitsCount; i++) {
      res.push(model.unitsByIndex(i).name());
    }
    return res;
  } catch {
    console.log("Threw an error in getAllUnitsNames");
  }
};

export { getAllUnitsNames };
