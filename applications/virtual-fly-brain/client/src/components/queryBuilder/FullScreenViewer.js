import React from "react";
import Dialog from '@mui/material/Dialog';
import { CrossCircle } from "../../icons";
import { IconButton } from "@mui/material";

const FullScreenViewer = ({ open, onClose, maxWidth = 'md', children }) => {
  return (
    <Dialog
      fullWidth
      onClose={onClose}
      scroll="body"
      maxWidth={maxWidth}
      open={open}
    >
      <IconButton
        sx={{
          position: 'absolute',
          right: '-1.25rem',
          top: '-1.25rem',
        }}
        onClick={onClose}
      >
        <CrossCircle />
      </IconButton>
      {children}
    </Dialog>
  )
};

export default FullScreenViewer;