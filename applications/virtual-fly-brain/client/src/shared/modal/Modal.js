import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { ModalCloseIcon } from '../../icons';
import vars from '../../theme/variables';

const { dialogBgColor, whiteColor, primaryBg, dialogContentTextColor, secondaryBtnColor, dialogBoxShadow } = vars;


const Modal = ({ open, handleClose, title, description, children, sx }) => {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="error-dialog-title"
            aria-describedby="error-dialog-description"
            sx={{
                '& .MuiPaper-root': {
                    backgroundColor: dialogBgColor,
                    padding: 0,
                    boxShadow: dialogBoxShadow,
                    backdropFilter: 'blur(10px)',
                    borderRadius: '0.25rem',
                    maxWidth: '25rem',
                    '& .MuiButton-root': {
                        padding: '0.5rem 1rem',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        borderRadius: '0.25rem',
                        lineHeight: '1rem',
                        minWidth: '11rem',
                        height: 'auto',
                        '& svg': {
                            marginRight: '0.25rem'
                        }
                    },
                    '& .MuiButton-outlined': {
                        border: `1px solid ${secondaryBtnColor}`,
                        color: secondaryBtnColor,
                        '&:hover': {
                            border: `1px solid ${secondaryBtnColor}`,
                            color: secondaryBtnColor,
                            background: 'transparent'
                        }
                    },
                    '& .MuiButton-contained': {
                        background: secondaryBtnColor,
                        '&:hover': {
                            background: secondaryBtnColor,
                            boxShadow: 'none'
                        }
                    },
                    ...sx
                }
            }}
        >
            <DialogTitle id="error-dialog-title"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: whiteColor,
                    padding: '1.5rem',
                    paddingBottom: '0.25rem',
                    zIndex: '10000'
                }}
            >
                {title}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    borderRadius: '1.125rem',
                    border: `1px solid ${primaryBg}`
                }}
            >
                <ModalCloseIcon />
            </IconButton>
            <DialogContent sx={{ zIndex: '100000', py: 0 }}>
                <DialogContentText id="error-dialog-description" sx={{ color: dialogContentTextColor, fontSize: '0.875rem' }}>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: '2rem 1rem 1.25rem 1rem', justifyContent: 'space-between' }}>
                {children}
            </DialogActions>
        </Dialog>
    );
}

export default Modal;