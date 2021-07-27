import { IOptionButtonProp } from "./component/IOptionButtonProp";

interface ISidebar extends IOptionButtonProp {
  viewSidebar: boolean;
  view: boolean;
  valid: boolean;
  baseContent?: string;
  updateBaseContent?: (content: string) => void;
}

export { ISidebar };
