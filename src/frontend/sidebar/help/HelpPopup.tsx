import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import HelpIcon from "@material-ui/icons/Help";
import React, { useState, FunctionComponent } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import documentationPdf from "./cellml_2_0_normative_specification.pdf";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";

interface IHelpDoc {
  pageRef: number;
  title: string;
  children?: React.ReactNode;
}

const useStyle = makeStyles(() =>
  createStyles({
    documentInterface: {
      justifyContent: "center",
    },
  })
);

const HelpPopup: FunctionComponent<IHelpDoc> = ({
  pageRef,
  title,
  children,
}) => {
  const [openHelp, setOpenHelp] = useState(false);
  const [openDocument, setOpenDocument] = useState(false);
  const [pageNum, setPageNum] = useState(pageRef);
  const [pageScale, setPageScale] = useState(1);
  const style = useStyle();
  return (
    <div>
      <Button onClick={() => setOpenHelp(true)}>
        <HelpIcon />
      </Button>
      <Dialog
        disableEscapeKeyDown
        open={openHelp}
        onClose={() => setOpenHelp(false)}
        maxWidth="lg"
        fullWidth
        style={{ height: "90vh" }}
      >
        <DialogTitle>
          <Grid container item xs={12}>
            <Grid item xs={10}>
              <Typography variant="h4" style={{ paddingLeft: "5px" }}>
                {title}
              </Typography>
            </Grid>
            <Grid container item xs={2} direction="row-reverse">
              <Button onClick={() => setOpenHelp(false)}>Close</Button>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {children}
          <br />
          <br />
          <Button onClick={() => setOpenDocument(true)}>
            Read the documentation
          </Button>
          <Dialog
            disableEscapeKeyDown
            open={openDocument}
            onClose={() => setOpenDocument(false)}
            maxWidth={"lg"}
          >
            <DialogTitle>
              <Grid item className={style.documentInterface} xs={12}>
                <Button onClick={() => setPageNum(pageNum - 1)}>
                  {"<<< Prev Page"}
                </Button>
                <Button onClick={() => setPageNum(pageNum + 1)}>
                  {"Next Page >>>"}
                </Button>
                {/* <Button
                  onClick={() =>
                    setPageScale(pageScale + 0.3 > 1.2 ? 1.2 : pageScale + 0.3)
                  }
                >
                  +
                </Button>
                <Button
                  onClick={() =>
                    setPageScale(pageScale - 0.3 < 0.6 ? 0.6 : pageScale - 0.3)
                  }
                >
                  -
                </Button>
                {pageScale} */}
                <Button onClick={() => setOpenDocument(false)}>Close</Button>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <Document file={documentationPdf}>
                <Page pageNumber={pageNum} scale={0.6} width={2000} />
              </Document>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { HelpPopup };
