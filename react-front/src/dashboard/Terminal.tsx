import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
//import { importFile } from "../build/Release/Reader.node";
//const r = require("../../../backend/build/Release/Reader.node");

interface Reader {
  importFile: (file: string) => string;
}

declare var require: any;
var r: Reader = require("../backend/build/Release/Reader.node");
//import { importFile } from r;

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

const Terminal = () => {
  const classes = useStyles();
  let loc =
    "/home/moop204/Documents/uni/thesis/OpenCellEd/backend/example/sample.xml";
  //let x = r.importFile(loc);
  let x = "PROBLEM HERE, LOOK AT CODE";
  return (
    <Box height="25%">
      <AppBar position="static">
        <Tabs aria-label="simple tabs example">
          <Tab label="Validator" />
        </Tabs>
      </AppBar>
      <Paper variant="outlined" square>
        Issues:
        {x}
      </Paper>
    </Box>
  );
};

export { Terminal };
