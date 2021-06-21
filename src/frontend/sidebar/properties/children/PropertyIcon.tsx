import Button from "@material-ui/core/Button";
import React, { FunctionComponent, MouseEventHandler } from "react";
import ExtensionIcon from "@material-ui/icons/Extension";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import CropSquareIcon from "@material-ui/icons/CropSquare";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";
import { strToElm, Elements } from "../../../../types/Elements";

interface IPropertyIcon {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  element: string;
}

const PropertyIcon: FunctionComponent<IPropertyIcon> = (props) => {
  const { onClick, title, element } = props;

  let icon;
  switch (strToElm(element)) {
    case Elements.component:
      icon = <ExtensionIcon />;
      break;
    case Elements.reset:
      icon = <RotateLeftIcon />;
      break;
    case Elements.units:
      icon = <CropSquareIcon />;
      break;
    case Elements.variable:
      icon = <ChangeHistoryIcon />;
      break;
    default:
      icon = <div> |{element}| </div>;
  }
  return (
    <div>
      {icon}
      <Button onClick={onClick}>{title}</Button>
    </div>
  );
};

export default PropertyIcon;
