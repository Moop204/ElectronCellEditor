import { Grid } from "@material-ui/core";
import MathJax from "mathjax3-react";
import React, { FunctionComponent } from "react";
import { Elements } from "../../../../types/Elements";
import { IUnitMath } from "../../../../types/IUnitMath";
import { DeleteButton } from "../children/DeleteButton";

const UnitMath: FunctionComponent<IUnitMath> = ({
  description: { prefix, reference, exponent, multiplier, imported },
  onClick,
  parentName,
  index,
}) => {
  return (
    <Grid container item direction="row">
      <Grid item xs={1}>
        {imported && "I"}
      </Grid>
      <Grid item xs={10} onClick={onClick}>
        <MathJax.Formula
          formula={`$$ ${
            multiplier !== 1 ? multiplier.toString() + "*" : ""
          }${prefix}${
            reference.length > 30 ? reference.substr(0, 27) + "..." : reference
          }^{${exponent !== 1 ? exponent : ""}} $$`}
        />
      </Grid>
      <Grid item xs={1}>
        <DeleteButton
          elementType={Elements.unit}
          name={parentName}
          index={index}
        />
      </Grid>
    </Grid>
  );
};

export { UnitMath };
