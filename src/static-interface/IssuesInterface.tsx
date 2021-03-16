import * as React from "react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import WarningIcon from "@material-ui/icons/Warning";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import ErrorIcon from "@material-ui/icons/Error";
import HintIcon from "@material-ui/icons/EmojiObjects";
import BugIcon from "@material-ui/icons/BugReport";
import { useStyles, standardStyle } from "./style";
import { Heading, IssuesHeading } from "./Heading";
import { useState } from "react";
import { ipcRenderer } from "electron";
import { Key } from "readline";
import error from "../media/error.svg";
import { createMuiTheme } from "@material-ui/core";
import { Palette } from "@material-ui/icons";

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme { 
    status: {
      danger: React.CSSProperties['color'], 
    }
  }

  interface ThemeOptions {
    status: {
      danger: React.CSSProperties['color'],
    }
  }
}

const theme = createMuiTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    neutral: {
      main: "#5c6ac4",
    }
  }
})

interface IssueRecord {
  desc: string,
  cause: string,
}

const IssueText = (props) => {
  const { errors } = props; 
  let val: number = 1;
  const styles = useStyles();

  if(errors.length > 0) {
    let issueList = []; 
    const issues = errors.map((record: IssueRecord) => {
      const {desc, cause} = record;
      const key = "issue" + val;
      val++;
      return (<Grid item key={key}> <span className={styles.issueMarker}>{">>>"}</span> {desc}  </Grid>);
    })

    console.log(issues);
    return (<div className={styles.plainText} key={"issue-text"}>
      {issues}
    </div>);
  } 
  return (
    <Grid item className={styles.plainText}> 
    No problems!
    </Grid>
  );
}

const Issues = () => {
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [hints, setHints] = useState([]);
  const [issueMode, setIssueMode] = useState(0);
  
  const styles = useStyles();
  ipcRenderer.on('error-reply', (event: Event, message) => {
    const {errors, warnings, hints} = message; 
    setErrors(errors);
    setWarnings(warnings);
    setHints(hints);
  })


  const selectMode = (mode: number) => {
    setIssueMode(mode);
  }
  return (
    <ThemeProvider theme={theme}> 

    <Grid container item>
      <Grid item md={12} className={styles.heading}>
        <span className={styles.heading}>Issues</span>
        <span>
          <IconButton color="inherit" className={styles.issueButtons} onClick={() => selectMode(0)}>
            <BugIcon/>
          </IconButton>
        </span>
        <span>
          <IconButton color="inherit" className={styles.issueButtons} onClick={() => selectMode(1)}>
            <ErrorIcon/>
          </IconButton>
        </span>
        <span>
          <IconButton color="inherit" className={styles.issueButtons} onClick={() => selectMode(2)}>
            <WarningIcon/>
          </IconButton>
        </span>
        <span color="#7986cb">
          <IconButton color="inherit" className={styles.issueButtons} onClick={() => selectMode(3)}>
            <HintIcon/>
          </IconButton>
        </span>
      </Grid>

      <Grid item md={12}  >
        <div className={styles.heading}> 
          {issueMode===0 ? "All Issues" : issueMode===1 ? "Errors" : issueMode===2 ? "Warnings" : "Hints"}
        </div>
        {issueMode===0 && <IssueText errors={errors.concat(warnings.concat(hints))}/> }
        {issueMode===1 && <IssueText errors={errors}/> } 
        {issueMode===2 && <IssueText errors={warnings}/> } 
        {issueMode===3 && <IssueText errors={hints}/> } 
      </Grid>
    </Grid>
    </ThemeProvider>
  );
};

export { Issues };
