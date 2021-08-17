import FileManagement from "../FileManagement";

const getAllUnitsNames = async (fm: FileManagement) => {
  try {
    const model = fm.parseModel(fm.getContent());
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
