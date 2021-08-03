import { makeStyles, createStyles, Grid, Button } from "@material-ui/core";
import { title } from "process";
import React, { FunctionComponent, MouseEventHandler, useState } from "react";
import { Elements, strToElm } from "../../../../types/Elements";
import { DeleteButton } from "./DeleteButton";
import { PropertyIcon } from "./PropertyIcon";

interface IChildrenRecord {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  element: string;
  index: number;
  parentName?: string;
}

const useStyle = makeStyles(() =>
  createStyles({
    button: {
      marginTop: "0.5vh",
      paddingLeft: "3px",
      //marginLeft: "1vw",
      paddingRight: "0px",
      maxWidth: "16vw",
    },
    root: {
      flexGrow: 1,
    },
    buttonText: {
      paddingLeft: "8px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      justifyContent: "left",
      textAlign: "justify",
      textTransform: "none",
    },
  })
);

const ChildrenRecord: FunctionComponent<IChildrenRecord> = ({
  onClick,
  title,
  element,
  index,
  parentName,
}) => {
  const style = useStyle();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  if (element === "connection") {
    return (
      <Grid container className={style.root}>
        <Grid item xs={10}>
          <Button
            variant="outlined"
            onClick={handleOpen}
            fullWidth
            className={style.button}
          >
            <Grid container>
              <Grid item xs={2}>
                <PropertyIcon element={element} />
              </Grid>
              <Grid item xs={10}>
                {title}
              </Grid>
            </Grid>
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            onClick={() => {
              window.api.send("update-attribute", [
                {
                  element: Elements.variable,
                  select: { name: title, index: index },
                  attribute: "connection",
                  value: parentName,
                },
              ]);
            }}
          >
            X
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container direction="row" key={element + title}>
      <Grid item xs={6} sm={6} md={8} lg={10} className={style.button}>
        <Button
          variant="outlined"
          onClick={onClick}
          fullWidth
          className={style.button}
        >
          <Grid container>
            <Grid item xs={1}>
              <PropertyIcon element={element} />
            </Grid>
            <Grid item xs={11} className={style.buttonText}>
              {title}
            </Grid>
          </Grid>
        </Button>
      </Grid>
      <Grid item xs={6} sm={6} md={4} lg={2} className={style.button}>
        <DeleteButton
          elementType={strToElm(element)}
          name={title}
          index={index}
        />
      </Grid>
    </Grid>
  );
};

export { ChildrenRecord };
