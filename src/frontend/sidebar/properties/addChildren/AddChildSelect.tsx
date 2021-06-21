import Grid from "@material-ui/core/Grid";
import React, { FunctionComponent } from "react";
import { Elements } from "../../../../types/Elements";
//import { ElementHelp } from "../../../components/helper/ElementHelp";
import { ElementForm } from "./ElementForm";

interface IAddChild {
  childElement: Elements;
  parentElement: Elements;
  parentName: string;
}

// Describes children that user can choose to add
const AddChildSelect: FunctionComponent<IAddChild> = ({
  childElement,
  parentElement,
  parentName,
}) => {
  console.log(`ComponentChildForm elementcheck: ${parentElement}`);

  return (
    <Grid container item direction="row">
      <Grid item xs={10}>
        <ElementForm
          childElement={childElement}
          parentElement={parentElement}
          parentName={parentName}
        />
      </Grid>
      <Grid item xs={2}>
        {/* <ElementHelp type={childElement} /> */}
      </Grid>
    </Grid>
  );
};

export { AddChildSelect };
