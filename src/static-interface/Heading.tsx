import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { useStyles } from "./style";

interface IHeadingProp {
  title: string
}

const Heading = (props: IHeadingProp) => {
  const styles = useStyles();
  const { title } = props;
  return (
    <Grid item md={12}>
      <div className={styles.heading}>{title}</div>
    </Grid>
  );
};

export { Heading, IHeadingProp };
