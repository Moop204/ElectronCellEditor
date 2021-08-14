import FileManagement from "../FileManagement";
import { Elements } from "../../types/Elements";
import { IMoveTo } from "./interfaces";
import { Component, ComponentEntity } from "../../types/ILibcellml";

const moveToModel = (fm: FileManagement) => {
  fm.resetToModel();
};

export { moveToModel };
