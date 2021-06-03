import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import ExtensionIcon from '@material-ui/icons/Extension';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import { strToElm, Elements } from '../../../types/Elements';
import IPropertyChild from '../../../types/IPropertyChild';

const PropertyChild = (props: IPropertyChild) => {
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
    default:
      icon = <div> {element} </div>;
  }
  return (
    // <Grid item direction="row">
    //   {icon}
    //   {/* <Button onClick={onClick}>{title}</Button> */}
    // </Grid>
    <div>
      {icon}
      <Button onClick={onClick}>{title}</Button>
    </div>
  );
};

export default PropertyChild;
