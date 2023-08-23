import React from "react";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { CrossCircle } from "../../icons";
import { IconButton } from "@mui/material";
import IMAGE from "../../assets/query-large.png";

const FullScreenViewer = ({ open, onClose, maxWidth = 'md' }) => {
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
      <img style={{width: '100%', display: 'block'}} src={IMAGE} alt="" />
    </Dialog>
  )
};

export default FullScreenViewer;