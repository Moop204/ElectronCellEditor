import { Divider, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import React, { FunctionComponent } from "react";
import { Level } from "../../../types/ILibcellml";
import { ErrorComponent } from "./ErrorComponent";
import { HintComponent } from "./HintComponent";
import { IssueDescriptor, IssueList } from "./Issue";
import { WarningComponent } from "./WarningComponent";

const useStyle = makeStyles(() =>
  createStyles({
    plainText: {
      color: "black",
    },
  })
);

const IssueText: FunctionComponent<IssueList> = ({ issues }) => {
  const styles = useStyle();

  if (issues.length > 0) {
    const mapIssues = issues.map((record: IssueDescriptor) => {
      const { desc, cause, type, url } = record;
      return (
        <Grid item key={desc} xs={12}>
          <Divider />
          {type === Level.ERROR && (
            <ErrorComponent desc={desc} section={cause} url={url} />
          )}
          {type === Level.WARNING && (
            <WarningComponent desc={desc} section={cause} url={url} />
          )}
          {type === Level.HINT && (
            <HintComponent desc={desc} section={cause} url={url} />
          )}
        </Grid>
      );
    });
    return (
      <div className={styles.plainText} key="issue-text">
        {mapIssues}
      </div>
    );
  }
  return (
    <Grid item>
      <Divider />
      <Typography variant="body1" style={{ paddingLeft: "5px" }}>
        No problems!
      </Typography>
    </Grid>
  );
};

export { IssueText };
