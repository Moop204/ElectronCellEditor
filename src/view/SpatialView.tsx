import { makeStyles, createStyles } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { useStyles } from '../static-interface/style';
import EditorXml from './EditorXml';
import { compressCellml } from '../compression/compress';

const SpatialView = (prop) => {
  const { setContentExist, contentExist } = prop;
  const styles = useStyles();
  if (contentExist === '') {
    return <div className={styles.notLoaded}>No File Loaded</div>;
  }

  return (
    <div className={styles.spatialView}>
      <div>{compressCellml(contentExist)}</div>
      <EditorXml xmlInput={compressCellml(contentExist)} />
    </div>
  );
};

export { SpatialView };
