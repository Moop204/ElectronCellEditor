import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { useStyles } from "./style";
import Button from "@material-ui/core/Button";
import { SubHeader } from "./SubHeader.js";
import styled from "styled-components";
import TextField from "@material-ui/core/Input";
import { Heading } from "./Heading";

const ElementChildren = (props) => {
  const styles = useStyles();
  const { desc } = props;
  return (
    <Grid item container>
      <Button>X</Button> <p>[IMG]</p> <p> {desc} </p>
    </Grid>
  );
};

const PropertyAttribute = (props) => {
  const { label } = props;
  console.log(label);
  const AttributeLabel = styled.p`
    padding-right: 1rem;
  `;
  return (
    <Grid container item direction="row">
      <AttributeLabel>{label}</AttributeLabel>
      <TextField id="standard-full-width" label="Label" />
    </Grid>
  );
};

const Properties = () => {
  const styles = useStyles();

  const attributes = ["name", "attr1", "attr2"];
  const children = [
    "width",
    "length",
    "perimeter",
    "perimeter=2*(width+length)",
  ];
  let attrVal = 1;
  let childVal = 1;
  return (
    <Grid container item>
      <Heading title="Properties" />
      <Grid item md={12}>
        <SubHeader title="Attributes" />
        {attributes.map((elm) => {
          const key = "attr" + attrVal;
          attrVal++;
          return <PropertyAttribute label={elm} key={key} />;
        })}
        <SubHeader title="Children" />
        {children.map((child) => {
          const key = "attr" + childVal;
          childVal++;
          return <ElementChildren desc={child} key={key} />;
        })}
      </Grid>
    </Grid>
  );
};

export { Properties };
