import * as React from "react";
import { Theme } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { FunctionComponent } from "react";

interface IHeadingProp {
  title: string;
}

const localStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      backgroundColor: "black",
      flexgrow: "1",
      width: "100%",
      color: "white",
      padding: "0.5rem",
      // justifyContent: 'space-between',
    },
  })
);

const Heading: FunctionComponent<IHeadingProp> = ({ title }) => {
  const styles = localStyles();
  return <div className={styles.heading}>{title}</div>;
};

export { Heading };
