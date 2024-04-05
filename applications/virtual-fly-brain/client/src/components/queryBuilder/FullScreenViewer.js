import React from "react";
import Dialog from '@mui/material/Dialog';
import { Box, Button,IconButton,Typography } from "@mui/material";
import { CrossCircle } from "../../icons";
import { Compare } from "../../icons";
import FullscreenSlider from "./FullscreenSlider";
import { Slide } from 'react-slideshow-image';
import { ChevronLeft, ChevronRight } from '../../icons';
import { useSelector } from "react-redux";
import vars from '../../theme/variables';

const {
  carouselBg,
  headerBorderColor,
  listHeadingColor
} = vars;

const imageStyle =  {
  height: '100%',
  width: '100%',
  objectFit: 'cover'
}

const spanStyle = {
  padding: '5px',
  position: 'absolute',
  bottom : '0px',
  background: '#efefef',
  color: '#000000'
}

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '400px'
}

const FullScreenViewer = ( { open, onClose, maxWidth = 'md', images, sx, children } ) =>
{
  const [openLayersImages, setOpenLayersImages] = React.useState(false);
  const [layersImages, setLayersImages] = React.useState([]);
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances);

  const handleCompare = () => {
    setOpenLayersImages(!openLayersImages)
  }

  const handleClose = () => {
    setOpenLayersImages(false);
    onClose()
  }

  React.useEffect( () => {
    let images = [];
    allLoadedInstances.filter(i => i.meshCreated).map(instance => {
      if ( instance?.metadata?.Images ) {
        let keys = Object.keys(instance?.metadata?.Images);
        keys.forEach( key => {
          images = images.concat(instance?.metadata?.Images[key][0])
        })
      } else if ( instance?.metadata?.Examples ){
        let keys = Object.keys(instance?.metadata?.Examples);
        keys.forEach( key => {
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
      <Button 
        sx={ { position: 'absolute', zIndex: 9, gap: '0.25rem', right: '1.75rem', top: '1.75rem' } }
        variant="contained"
        color="info"
        onClick={handleCompare}  
      >
        <Compare />
        Compare images with current
      </Button>
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
      <Slide canSwipe={ false } slidesToShow={ 1 } slidesToScroll={ 1 } infinite={ false } indicators={ true } prevArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> } nextArrow={ <Typography><ChevronRight color={ listHeadingColor } /></Typography> } arrows={ true }>
            {Object.keys(images)?.map((src, index) => (
                <div key={index}>
                  <div
                    style={{ ...divStyle, 'backgroundImage': `url(${images[src]?.[0].thumbnail})` }}>
                    <span style={spanStyle}>{images[src]?.[0].label}</span>
                  </div>
                </div>
            ))}
      </Slide>
      {
        openLayersImages ? (
          <Box
          sx={{
            width: '100%',
            height: {
              xs: '15.188rem',
              lg: '14.25rem'
            },
            background: {
              xs: carouselBg,
              lg: headerBorderColor
            },
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}
          >
            <FullscreenSlider
              fullScreen={true} examples={layersImages}
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