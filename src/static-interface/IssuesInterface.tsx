import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useStyles } from "./style";
import { Heading } from "./Heading";

const IssueElement = (props) => {
  const { issue } = props;
  return (
    <Grid item md={12}>
      <p>
        {">>>"} {issue}{" "}
      </p>
    </Grid>
  );
};

const Issues = () => {
  const styles = useStyles();

  const log = [
    "You made a mistake so that happened.",
    "Theres another mistake here.",
    "Heres the last error O:",
  ];
  let val: number = 1;
  return (
    <Grid container item>
      <Heading title="Issues" />
      <Grid item md={12}>
        {log.map((issue) => {
          const key = "attr" + val;
          val++;
          return <IssueElement issue={issue} key={key} />;
        })}
      </Grid>
    </Grid>
  );
};

export { Issues };
