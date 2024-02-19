import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 'none', 
};

const ErrorModal = ({ display, message }) => {
  return (
    <Modal
      open={display}
      onClose={() => {}}
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-description"
    >
      <Box sx={style}>
        <Typography id="error-modal-title" variant="h6" component="h2">
          Error
        </Typography>
        <Typography id="error-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={() => {}} variant="contained" color="error">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ErrorModal;