import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import HelpIcon from '@material-ui/icons/Help';
import React, { FunctionComponent } from 'react';
import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import documentationPdf from '../../media/cellml_2_0_normative_specification.pdf';

interface IHelpDoc {
  pageRef: number;
  children?: React.ReactNode;
}

const Help: FunctionComponent<IHelpDoc> = ({ pageRef, children }) => {
  const [openHelp, setOpenHelp] = useState(false);
  const [openDocument, setOpenDocument] = useState(false);
  const [pageNum, setPageNum] = useState(pageRef);
  const [pageScale, setPageScale] = useState(1);

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
              <Button onClick={() => setPageNum(pageNum - 1)}>{'<<<'}</Button>
              {pageNum}
              <Button onClick={() => setPageNum(pageNum + 1)}>{'>>>'}</Button>
              <Button onClick={() => setPageScale(pageScale + 0.3)}>+</Button>
              <Button onClick={() => setPageScale(pageScale - 0.3)}>-</Button>

              <Button onClick={() => setOpenDocument(false)}>X</Button>
            </DialogTitle>
            <DialogContent>
              <Document file={documentationPdf}>
                <Page pageNumber={pageNum} scale={pageScale} />
              </Document>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { Help };
