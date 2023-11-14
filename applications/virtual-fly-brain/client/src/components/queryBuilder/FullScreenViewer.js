import React from "react";
import Dialog from '@mui/material/Dialog';
import { CrossCircle } from "../../icons";
import { IconButton, Typography } from "@mui/material";
import { Slide } from 'react-slideshow-image';
import { ChevronLeft, FullScreen } from '../../icons';
import vars from '../../theme/variables';

const { whiteColor, listHeadingColor } = vars;
const imageStyle =  {
  height: '100%',
  width: '100%',
  objectFit: 'cover'
}

const FullScreenViewer = ({ open, onClose, maxWidth = 'md', images }) => {
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
      <Slide canSwipe={ false } slidesToShow={ 1 } slidesToScroll={ 1 } infinite={ false } indicators={ true } prevArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> } nextArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> } arrows={ true }>
        {images.length > 0 && (
          <>
            {images?.map((slideImage, index) => (
              <div key={index}>
                <img
                  style={imageStyle}
                  src={slideImage}
                />
              </div>
            ))}
          </>
        )}
      </Slide>
    </Dialog>
  )
};

export default FullScreenViewer;