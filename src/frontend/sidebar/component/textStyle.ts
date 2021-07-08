import { makeStyles, createStyles } from "@material-ui/core";

const textStyle = makeStyles(() =>
  createStyles({
    optionText: {
      color: "black",
      paddingLeft: "1vh",
    },
  })
);

export { textStyle };
