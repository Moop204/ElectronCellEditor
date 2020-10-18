import React from "react";
import { Terminal } from "./Terminal";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { NewModel, Model } from "../block/Model";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
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

const Dashboard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid container item xs={4}>
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
        <Grid item xs={8}>
          <Editor />
        </Grid>
      </Grid>
    </div>
  );
};

export { Dashboard };
