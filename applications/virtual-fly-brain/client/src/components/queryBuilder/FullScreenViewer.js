import React from "react";
import Dialog from '@mui/material/Dialog';
import { Box, Button, DialogTitle, IconButton, Typography } from "@mui/material";
import { CrossCircle } from "../../icons";
import { Compare } from "../../icons";
import FullscreenSlider from "./FullscreenSlider";
import { Slide } from 'react-slideshow-image';
import { ChevronLeft, ChevronRight } from '../../icons';
import { useSelector } from "react-redux";
import vars from '../../theme/variables';

const {
  listHeadingColor
} = vars;

const spanStyle = {
  color: '#181818',
  fontSize: '1rem',
  fontWeight: 400
}

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: '100% 100%',
  height: '320px',
  borderRadius: '8px',
  backgroundPosition: 'center center'
}

const FullScreenViewer = ({ open, onClose, maxWidth = 'md', images, sx, children }) => {
  const [openLayersImages, setOpenLayersImages] = React.useState(false);
  const [layersImages, setLayersImages] = React.useState([]);
  const [slideImages, setSlideImages] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [slideImageCurrentSlide, setSlideImageCurrentSlide] = React.useState(0);
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances);

  const handleCompare = () => {
    setOpenLayersImages(!openLayersImages)
  }

  const handleClose = () => {
    setOpenLayersImages(false);
    onClose()
  }

  React.useEffect(() => {
    let images = [];
    allLoadedInstances.filter(i => i.meshCreated).map(instance => {
      if (instance?.metadata?.Images) {
        let keys = Object.keys(instance?.metadata?.Images);
        keys.forEach(key => {
          images = images.concat(instance?.metadata?.Images[key][0])
        })
      } else if (instance?.metadata?.Examples) {
        let keys = Object.keys(instance?.metadata?.Examples);
        keys.forEach(key => {
          images = images.concat(instance?.metadata?.Examples[key][0])
        })
      }
    })
    setLayersImages(images)
  }, [allLoadedInstances])


  return (
    <Dialog
      fullWidth
      onClose={event => handleClose(event)}
      scroll="body"
      maxWidth={maxWidth}
      open={open}
      sx={sx}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 0, mb: 1.5, ...spanStyle }}>
        {images[Object.keys(images)[currentSlide]]?.[0].label}
        <Button
          variant="contained"
          color="info"
          onClick={handleCompare}
          sx={{ gap: '0.25rem' }}
        >
          <Compare />
          {openLayersImages ? "Stop comparison" : "Compare images with current"}
        </Button>
      </DialogTitle>
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
      <Slide canSwipe={false} slidesToShow={1} slidesToScroll={1} infinite={false} indicators={true} prevArrow={<Typography><ChevronLeft color={listHeadingColor} /></Typography>} nextArrow={<Typography><ChevronRight color={listHeadingColor} /></Typography>} arrows={true} onChange={(slideIndex) => setCurrentSlide(slideIndex)}>
        {Object.keys(images)?.map((src, index) => (
          <div key={index}>
            <div style={{ ...divStyle, 'backgroundImage': `url(${images[src]?.[0].thumbnail})` }}></div>
          </div>
        ))}
      </Slide>
      {
        openLayersImages ? (
          <Box
            sx={{
              width: '100%',
              background: 'transparent',
              overflow: 'hidden',
              mt: '0.75rem'
            }}
          >
            <Typography sx={{ ...spanStyle, mb: '0.75rem' }}>
              {slideImages[slideImageCurrentSlide]?.caption}
            </Typography>
            <FullscreenSlider
              fullScreen={true}
              examples={layersImages}
              slideImages={slideImages}
              setSlideImages={setSlideImages}
              setSlideImageCurrentSlide={setSlideImageCurrentSlide}
            />
          </Box>
        )
          :
          null
      }
    </Dialog>
  )
};

export default FullScreenViewer;