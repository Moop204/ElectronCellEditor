import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import CreateIcon from '@material-ui/icons/Create';

const TextViewButton = () => {
  return (
    <Tooltip title="Text View">
      <Link to="">
        <IconButton aria-label="Text View" color="primary">
          <CreateIcon />
        </IconButton>
      </Link>
    </Tooltip>
  );
};

export { TextViewButton };
