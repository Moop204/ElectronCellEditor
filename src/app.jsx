import * as React from "react";
import * as ReactDOM from "react-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
//import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
//import FormControlLabel from "@material-ui/core/FormControlLabel";
import styled from "styled-components";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginLeft: 0,
    },
    viewButton: {
      padding: theme.spacing(2),
      maxWidth: "12rem",
      textAlign: "center",
      color: theme.palette.text.secondary,
      flexGrow: 1,
    },
    heading: {
      backgroundColor: "black",
      flexgrow: "1",
      width: "100%",
      color: "white",
      padding: "0.5rem",
    },
    subheading: {
      borderTop: "solid",
      borderBottom: "solid",
      marginTop: "1vh",
    },
    contentView: {
      height: "100%",
      background: "#000",
    },
    test: {
      height: "50%",
      background: "#00efff",
    },
  })
);

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

const SubHeader = (props) => {
  const styles = useStyles();
  const { title } = props;
  return <div className={styles.subheading}>{title}</div>;
};

const ElementChildren = (props) => {
  const styles = useStyles();
  const { desc } = props;
  return (
    <Grid item container>
      <Button>X</Button> <p>[IMG]</p> <p> {desc} </p>
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
      <Grid container item md={12}>
        <Button className={styles.heading}> Properties </Button>
      </Grid>
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

const IssueElement = (props) => {
  const { issue } = props;
  return (
    <Grid item md={12}>
      <p>Issue: {issue} </p>
    </Grid>
  );
};

const Issues = () => {
  const styles = useStyles();

  const log = [
    "You made a mistake here which is why that happened.",
    "Theres another mistake here you nugget.",
    "Heres the last error O:",
  ];
  let val = 1;
  return (
    <Grid container item>
      <Grid item md={12}>
        <Button className={styles.heading}>Issues</Button>
      </Grid>
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

const View = () => {
  const styles = useStyles();

  return (
    <Grid container item>
      <Grid container item md={12}>
        <Button className={styles.heading}>Views</Button>
      </Grid>
      <Grid container item>
        <Grid item md={2}>
          <Button className={styles.viewButton}>A</Button>
        </Grid>
        <Grid item md={2}>
          <Button className={styles.viewButton}>B</Button>
        </Grid>
        <Grid item md={2}>
          <Button className={styles.viewButton}>C</Button>
        </Grid>
        <Grid item md={2}>
          <Button className={styles.viewButton}>A</Button>
        </Grid>
        <Grid item md={2}>
          <Button className={styles.viewButton}>B</Button>
        </Grid>
        <Grid item md={2}>
          <Button className={styles.viewButton}>C</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default function AutoGrid() {
  const useStyles = makeStyles((theme) =>
    createStyles({
      root: {
        flexGrow: 1,
        marginLeft: 0,
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
      },
      grid: {
        borderStyle: "solid",
      },
    })
  );
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div></div>
      <Grid container spacing={1}>
        <Grid item md={3}>
          <View />
          <Properties />
          <Issues />
          <Paper className={styles.paper}>xs</Paper>
          <Paper className={styles.paper}>xs</Paper>
          <Paper className={styles.paper}>xs</Paper>
        </Grid>
        <Grid item md={8} className={styles.contentView} height="50%">
          <div className={styles.test}>xs</div>
        </Grid>
      </Grid>
    </div>
  );
}

const Dashboard = () => {
  return <AutoGrid />;
};

function render() {
  ReactDOM.render(<Dashboard />, document.getElementById("app"));
}

render();
