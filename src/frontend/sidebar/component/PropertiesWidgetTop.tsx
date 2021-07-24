import {
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { Elements, elmToStr } from "../../../types/Elements";
import { capitaliseFirst } from "../../../utility/CapitaliseFirst";
import { ElementHelp } from "../help/ElementHelp";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

interface IPropertiesWidgetTop {
  type: Elements;
  onClick: () => void;
}

const localStyles = makeStyles(() =>
  createStyles({
    propertyWidget: {
      leftPadding: "1wv",
    },
    root: {
      flexGrow: 1,
    },
  })
);

const PropertiesWidgetTop: FunctionComponent<IPropertiesWidgetTop> = ({
  type,
  onClick,
}) => {
  const style = localStyles();
  return (
    <Grid
      container
      direction="row"
      alignContent="space-between"
      className={style.root}
    >
      <Grid item xs={1}>
        <IconButton
          onClick={() => {
            onClick();
            window.api.send("to-parent");
            window.api.send("get-element");
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
      </Grid>
      <Grid
        item
        container
        xs={11}
        alignContent="space-between"
        direction="row-reverse"
      >
        <Grid item>
          <Typography variant="h5" style={{ paddingRight: "5px" }}>
            {capitaliseFirst(elmToStr(type))}
          </Typography>
        </Grid>
        <Grid item>
          <span>
            <ElementHelp type={type} />
          </span>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { PropertiesWidgetTop };
