import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';

const VisibilityButton = () => {
  return (
    <Tooltip title="View Interface">
      <IconButton aria-label="View Interface" color="primary">
        <VisibilityIcon />
      </IconButton>
    </Tooltip>
  );
};

export { VisibilityButton };
