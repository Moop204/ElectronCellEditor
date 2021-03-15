import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useStyles, standardStyle } from "./style";
import { Heading } from "./Heading";
import { useState } from "react";
import { ipcRenderer } from "electron";
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
      return (<Grid item> <span className={styles.issueMarker}>{">>>"}</span> {desc}  </Grid>);
    })

    console.log(issues);
    return (<div className={styles.plainText}>
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
  
  ipcRenderer.on('error-reply', (event: Event, message: string) => {
    setErrors(message);
  })



  const log = [
    "You made a mistake so that happened.",
    "Theres another mistake here.",
    "Heres the last error O:",
  ];
  return (
    <Grid container item>
      <Heading title="Issues" />
      <Grid item md={12}  >
        <IssueText errors={errors}/>
      </Grid>
    </Grid>
  );
};

export { Issues };
