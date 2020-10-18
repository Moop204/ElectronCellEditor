import { useStyles } from "./Block";
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import LabelIcon from "@material-ui/icons/Label";
import TextField from "@material-ui/core/TextField";

import Grid from "@material-ui/core/Grid";

const Layout = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          id="filled-required"
          label="Name"
          variant="filled"
        />
      </Grid>
      <Grid item xs={12}>
        <NewComponentBlock />
      </Grid>
    </Grid>
  );
};

const NewComponentBlock = () => {
  const style = useStyles();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={style.heading}>
          <AddIcon />
          <LabelIcon />
          Component
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TextField
          required
          id="filled-required"
          label="Name"
          variant="filled"
        />
      </AccordionDetails>
    </Accordion>
  );
};

const ComponentBlock = () => {
  const style = useStyles();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={style.heading}>
          <LabelIcon />
          Component
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Layout />
      </AccordionDetails>
    </Accordion>
  );
};

export { ComponentBlock, NewComponentBlock };
