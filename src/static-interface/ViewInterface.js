import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useStyles } from "./style";
import { Heading } from "./Heading";

const View = () => {
  const styles = useStyles();

  return (
    <Grid container item>
      <Heading title="Views" />
      <Grid container item>
        <Grid item md={2}>
          <Button className={styles.viewButton}>Text View</Button>
        </Grid>
        <Grid item md={2}>
          <Button className={styles.viewButton}>Hierarchy View</Button>
        </Grid>
        <Grid item md={2}>
          <Button className={styles.viewButton}>Hide Interface</Button>
        </Grid>
        <Grid item md={2}>
          <Button className={styles.viewButton}>
            Show Interface (TO BE REMOVED?)
          </Button>
        </Grid>
        <Grid item md={2}>
          <Button className={styles.viewButton}>UNDO</Button>
        </Grid>
        <Grid item md={2}>
          <Button className={styles.viewButton}>REDO</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { View };
