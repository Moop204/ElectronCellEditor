import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import React, { useState, ChangeEventHandler, FunctionComponent } from "react";
import { Elements, elmToStr } from "../../../../types/Elements";
//import { ElementHelp } from "../../components/helper/ElementHelp";
import Grid from "@material-ui/core/Grid";
import { ComponentChildForm } from "./form/ComponentChildForm";
import { ResetChildForm } from "./form/ResetChildForm";
import { UnitsChildForm } from "./form/UnitsChildForm";
import { VariableChildForm } from "./form/VariableChildForm";
import { UnitChildForm } from "./form/UnitChildForm";
import { ElementHelp } from "../../help/ElementHelp";

interface IAddChild {
  childElement: Elements;
  parentElement: Elements;
  parentName: string;
  handleClose: () => void;
}

const ElementForm: FunctionComponent<IAddChild> = ({
  childElement,
  parentElement,
  parentName,
  handleClose,
}) => {
  console.log(`ComponentChildForm elementcheck: ${parentElement}`);

  let form;
  switch (childElement) {
    case Elements.component:
      form = (
        <ComponentChildForm
          parent={parentElement}
          parentName={parentName}
          handleClose={() => handleClose()}
        />
      );
      break;
    case Elements.units:
      form = (
        <UnitsChildForm
          parent={parentElement}
          parentName={parentName}
          handleClose={handleClose}
        />
      );
      break;
    case Elements.variable:
      form = (
        <VariableChildForm
          parent={parentElement}
          parentName={parentName}
          handleClose={handleClose}
        ></VariableChildForm>
      );
      break;
    case Elements.reset:
      form = (
        <ResetChildForm
          parent={parentElement}
          parentName={parentName}
          handleClose={handleClose}
        />
      );
      break;
    case Elements.unit:
      form = (
        <UnitChildForm
          parent={parentElement}
          parentName={parentName}
          handleClose={handleClose}
        />
      );
      break;
    default:
  }

  return form;
};

export { ElementForm };
