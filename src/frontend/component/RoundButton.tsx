import { makeStyles, createStyles, Button } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React, { forwardRef } from "react";
import { FunctionComponent } from "react";

const useStyle = makeStyles(() =>
  createStyles({
    roundButton: {
      borderRadius: "16px",
      border: "3px solid lightgrey",
      marginBottom: "4px",
      backgroundColor: "#DCDCDC",
      boxShadow:
        "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
      textDecoration: "underline",
    },
  })
);

// const RoundButton = forwardRef((props, ref) => {
//   const style = useStyle();
//   return <div className={style.roundButton}>{props.children}</div>;
// });

const RoundButton: FunctionComponent = (props) => {
  const style = useStyle();
  return <div className={style.roundButton}>{props.children}</div>;
  // return (
  //   <Button disabled fullWidth style={{ backgroundColor: "#DCDCDC" }}>
  //     {props.children}
  //   </Button>
  // );
};

export { RoundButton };
