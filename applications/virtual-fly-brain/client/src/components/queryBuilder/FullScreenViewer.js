import React from "react";
import Dialog from '@mui/material/Dialog';
import { ChevronRight, CrossCircle } from "../../icons";
import { IconButton, Typography } from "@mui/material";
import { Slide } from 'react-slideshow-image';
import { ChevronLeft, FullScreen } from '../../icons';
import vars from '../../theme/variables';

const { listHeadingColor } = vars;
const imageStyle =  {
  height: '100%',
  width: '100%',
  objectFit: 'cover'
}

const FullScreenViewer = ( { open, onClose, maxWidth = 'md', images, sx, children } ) =>
{
  return (
    <Dialog
      fullWidth
      onClose={onClose}
      scroll="body"
      maxWidth={maxWidth}
      open={open}
      sx={sx}
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
      <Slide canSwipe={ false } slidesToShow={ 1 } slidesToScroll={ 1 } infinite={ false } indicators={ true } prevArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> } nextArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> } arrows={ true }>
            {Object.keys(images)?.map((src, index) => (
                <img
                  key={index}
                  style={imageStyle}
                  src={images[src]?.[0].thumbnail}
                />
            ))}
        </Slide>
    </Dialog>
  )
};

export default FullScreenViewer;