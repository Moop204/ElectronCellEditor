import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { NewModel, Model } from "../block/Model";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Box from "@material-ui/core/Box";
import { Button, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);

const FolderInput = () => {
  const handleFileInput = () => {};
  return (
    <div className="file-uploader">
      Open Folder
      <input type="file" onChange={handleFileInput} />
    </div>
  );
};

const Editor = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper} square>
      <AppBar position="static">
        <Tabs aria-label="simple tabs example">
          <Tab label="current_file" />
          <Tab label="another_file" />
          <Tab label="+New File" />
        </Tabs>
      </AppBar>
      <Model />
      <NewModel />
    </Paper>
  );
};

const Terminal = () => {
  const classes = useStyles();
  return (
    <Box height="25%">
      <AppBar position="static">
        <Tabs aria-label="simple tabs example">
          <Tab label="Terminal" />
        </Tabs>
      </AppBar>
      <Paper variant="outlined" square>
        Error (errno, lineno): Component test_component_name is not correctly
        formed
      </Paper>
    </Box>
  );
};

const View = () => {
  const classes = useStyles();
  return (
    <Box height="50%">
      <Paper className={classes.paper}>
        <Typography>View</Typography>
        <Button>View</Button>
      </Paper>
    </Box>
  );
};

const Dashboard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid container item xs={3}>
          <Box height="50%">
            <Paper className={classes.paper}>
              <Paper className={classes.paper}>
                <Terminal />
              </Paper>
              <Paper className={classes.paper}>
                <FolderInput />
              </Paper>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Terminal />
        </Grid>
        <Grid item xs={8}>
          <Editor />
        </Grid>
      </Grid>
    </div>
  );
};

export { Dashboard };
