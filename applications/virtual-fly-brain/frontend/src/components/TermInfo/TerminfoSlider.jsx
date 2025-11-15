import React, {
  useState,
  useEffect,
} from 'react';
import vars from '../../theme/variables';
import { useSelector } from 'react-redux';
import { Slide } from 'react-slideshow-image';
import { ChevronLeft, FullScreen } from '../../icons';
import { Box, Button, Typography } from '@mui/material';
import { getInstanceByID } from '../../reducers/actions/instances';
import Modal from '../../shared/modal/Modal';
import 'react-slideshow-image/dist/styles.css'

const { whiteColor, listHeadingColor } = vars;

const imageStyle =  {
  height: '100%',
  width: '100%',
  objectFit: 'contain',
  backgroundColor: 'black',
  cursor: 'pointer',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%'
}

const TerminfoSlider = (props) => {
  const classes = {
    root: {
      height: '100%',
      position: 'relative',
      overflow: !props.allowFullscreen ? 'hidden' : 'visible',
      borderRadius: !props.allowFullscreen ? '0.5rem' : '0',

      '& img': {
        display: 'block'
      },

      '& > div:first-of-type': {
        height: '100%',
        '& > div': {
          height: '100%',
        }
      },
      '& .react-slideshow-wrapper': {
        height: '100%'
      },

      '& .react-slideshow-container': {
        height: '100%',
      },

      '& .react-slideshow-container .nav': {
        zIndex: 10,
        position: 'absolute',
        cursor: 'pointer',
        bottom: '0.5rem',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
      },

      '& .react-slideshow-container .nav svg': {
        width: '1.25rem',
        height: '1.25rem'
      },

      '& .react-slideshow-container .nav.disabled': {
        opacity: 0.6
      },

      '& .react-slideshow-container .nav:first-of-type': {
        left: '2.75rem'
      },

      '& .react-slideshow-container .nav:last-of-type': {
        right: '2.75rem',

        '& svg': {
          transform: 'rotate(180deg)'
        }
      },

      '& .react-slideshow-container + ul.indicators .each-slideshow-indicator::before': {
        background: whiteColor,
        position: 'static',
        display: 'block',
        width: '0.375rem',
        height: '0.375rem'
      },

      '& .react-slideshow-container + ul.indicators li': {
        width: 'auto',
        height: 'auto',
        padding: 0,
        display: 'flex',

      },

      '& .react-slideshow-container + ul.indicators': {
        margin: 0,
        padding: 0,
        position: 'absolute',
        bottom: '0.938rem',
        height: 'auto',
        width: '100%',
      }
    }
  };
  const [slideImages, setSlideImages] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    example: null,
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const reduxState = useSelector(state => state);

  const handleConfirmLoad = async () => {
    if (!confirmationModal.example) return;
    
    setIsLoading(true);
    try {
      const templateId = confirmationModal.example.template;
      const instanceId = confirmationModal.example.id;
      const url = new URL(window.location.origin);
      url.searchParams.set('id', templateId);
      url.searchParams.set('i', instanceId);

      window.open(url.toString(), '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error loading instance:', error);
    } finally {
      setIsLoading(false);
      setConfirmationModal({ open: false, example: null, message: '' });
    }
  };

  const handleCancelLoad = () => {
    setConfirmationModal({ open: false, example: null, message: '' });
  };

  const imageClick = (image) => {
    if (image !== reduxState.instances.launchTemplate?.metadata?.Id) {
      const templates = Object.keys(reduxState.instances.focusedInstance.metadata.Examples);
      const examples = new Map();
      templates.forEach(t => {
        reduxState.instances.focusedInstance.metadata.Examples[t].forEach(e => {
          examples.set(e.id, {...e, template: t});
        });
      });
      const example = examples.get(image);
      if (example.template !== reduxState.instances.launchTemplate?.metadata?.Id) {
        setConfirmationModal({
          open: true,
          example,
          message: "The image selected is aligned with another template, do you want to load it?"
        });
      } else {
        getInstanceByID(image, true, true, true);
      }
    }
  }

  useEffect( () => {
    if(props?.examples) {
      const images = [];
      const keys = Object.keys(props.examples);
      
      // Get current template from store
      const currentTemplate = reduxState.instances.launchTemplate?.metadata?.Id;
      
      // Define the priority order for templates
      const templatePriorityOrder = [
        "VFB_00101567", "VFB_00200000", "VFB_00017894", "VFB_00101384", 
        "VFB_00050000", "VFB_00049000", "VFB_00100000", "VFB_00030786", 
        "VFB_00110000", "VFB_00120000"
      ];
      
      // Create ordered keys array: current template first, then by priority order
      const orderedKeys = [];
      
      // Add current template first if it exists in the examples
      if (currentTemplate && keys.includes(currentTemplate)) {
        orderedKeys.push(currentTemplate);
      }
      
      // Add remaining templates based on priority order
      templatePriorityOrder.forEach(templateId => {
        if (keys.includes(templateId) && templateId !== currentTemplate) {
          orderedKeys.push(templateId);
        }
      });
      
      // Add any remaining templates that weren't in the priority list
      keys.forEach(k => {
        if (!orderedKeys.includes(k)) {
          orderedKeys.push(k);
        }
      });
      
      // Build images array using ordered keys
      orderedKeys.forEach(k => {
        props.examples[k].forEach(e => {
          images.push({
            url: e.thumbnail,
            caption: e.label,
            id: e.id
          });
        });
      });
      
      console.log('TerminfoSlider: Setting slideImages with priority order', images);
      setSlideImages(images);
    } else {
      setSlideImages([]);
    }
  }, [props.examples, reduxState.instances.launchTemplate?.metadata?.Id]);

  return (
    <Box sx={classes.root}>
      <Slide
        key={`${slideImages.length}-${slideImages[0]?.id || 'empty'}`}
        transitionDuration={250}
        canSwipe={ false }
        slidesToShow={ 1 }
        slidesToScroll={ 1 }
        infinite={ false }
        indicators={ true }
        autoplay={ false }
        defaultIndex={0}
        prevArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> }
        nextArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> } 
        arrows={ true }
      >
            {slideImages?.map((slideImage, index) => (
                <img
                  key={`${slideImage.id}-${index}`}
                  style={imageStyle}
                  src={slideImage.url}
                  onClick={() => imageClick(slideImage.id)}
                  alt={slideImage.caption}
                  onLoad={() => console.log(`Image ${index} loaded:`, slideImage.url)}
                  onError={() => console.log(`Image ${index} failed to load:`, slideImage.url)}
                />
            ))}
      </Slide>
      {props.allowFullscreen && (
        <Button onClick={() => props.setFullScreen(true)} sx={ {
          position: 'absolute',
          bottom: '0.5rem',
          right: '0.5rem',
          padding: 0,
          minWidth: '0.0625rem',
          height: 'auto',
          lineHeight: 1,
        }}>
          <FullScreen size="20" />
        </Button>
      )}
      <Modal
        open={confirmationModal.open}
        handleClose={handleCancelLoad}
        title="Template not aligned"
        description={confirmationModal.message}
        >
          <Button onClick={handleCancelLoad} variant="outlined" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirmLoad} variant="contained" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load Template'}
          </Button>
      </Modal>
    </Box>
  )
}

export default TerminfoSlider ;
