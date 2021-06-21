import { Elements } from "../../../../types/Elements";

interface IPopup {
  parent: Elements;
  parentName: string;
  handleClose: () => void;
}

export { IPopup };
