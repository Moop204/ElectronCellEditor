import { makeStyles, createStyles } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useStyles } from '../static-interface/style';
import EditorXml from './EditorXml';
import { compressCellml } from '../compression/compress';

// Updated through ipc calls to the backend
const SpatialView = (prop) => {
  const { contentExist } = prop;
  const styles = useStyles();
  if (contentExist === '') {
    return <div className={styles.notLoaded}>No File Loaded</div>;
  }

  return (
    <div className={styles.spatialView}>
      {/* <div>{compressCellml(contentExist)}</div> */}
      <EditorXml xmlInput={compressCellml(contentExist)} />
    </div>
  );
};

export { SpatialView };
