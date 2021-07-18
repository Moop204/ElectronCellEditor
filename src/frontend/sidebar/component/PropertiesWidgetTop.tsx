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
}

const localStyles = makeStyles(() =>
  createStyles({
    propertyWidget: {
      leftPadding: "1wv",
    },
  })
);

const PropertiesWidgetTop: FunctionComponent<IPropertiesWidgetTop> = ({
  type,
}) => {
  const style = localStyles();
  return (
    <Grid container direction="row">
      <Grid item xs={1}>
        <IconButton
          onClick={() => {
            window.api.send("resetParent");
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
      </Grid>
      <Grid item xs={11}>
        <Typography variant="h5" style={{ paddingRight: "5px" }}>
          {capitaliseFirst(elmToStr(type))}
        </Typography>
        <span>
          <ElementHelp type={type} />
        </span>
      </Grid>
    </Grid>
  );
};

export { PropertiesWidgetTop };
