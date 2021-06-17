import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import HelpIcon from '@material-ui/icons/Help';
import React, { FunctionComponent } from 'react';
import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import documentationPdf from '../../media/cellml_2_0_normative_specification.pdf';
import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';

interface IHelpDoc {
  pageRef: number;
  children?: React.ReactNode;
}

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    documentInterface: {
      justifyContent: 'center',
    },
  })
);

const Help: FunctionComponent<IHelpDoc> = ({ pageRef, children }) => {
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
        disableBackdropClick
        disableEscapeKeyDown
        open={openHelp}
        onClose={() => setOpenHelp(false)}
      >
        <DialogTitle>
          <Button onClick={() => setOpenHelp(false)}>X</Button>
        </DialogTitle>
        <DialogContent>
          {children}
          <br />
          <br />
          <Button onClick={() => setOpenDocument(true)}>
            Read the documentation
          </Button>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={openDocument}
            onClose={() => setOpenDocument(false)}
            maxWidth={'lg'}
          >
            <DialogTitle>
              <Grid className={style.documentInterface} xs={12}>
                <Button onClick={() => setPageNum(pageNum - 1)}>{'<<<'}</Button>
                <Button onClick={() => setPageNum(pageNum + 1)}>{'>>>'}</Button>
                <Button
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
                {pageScale}
                <Button onClick={() => setOpenDocument(false)}>X</Button>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <Document file={documentationPdf}>
                <Page pageNumber={pageNum} scale={pageScale} width={2000} />
              </Document>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { Help };
