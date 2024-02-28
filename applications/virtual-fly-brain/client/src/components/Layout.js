
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Box, Button,Modal, useMediaQuery, useTheme, Typography, CircularProgress, Link } from "@mui/material";
import TermInfo from "./TermInfo"
import vars from "../theme/variables";
import VFBDownloadContents from "./VFBDownloadContents/VFBDownloadContents";
import VFBUploader from "./VFBUploader/VFBUploader";
import QueryBuilder from "./queryBuilder";
import ErrorModal from "./ErrorModal";
import { getLayoutManagerInstance } from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
import { addWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import { setTermInfoOpened } from './../reducers/actions/globals'
import { templateLoaded,  removeAllInstances } from './../reducers/actions/instances';
import { widgets } from "./layout/widgets";

const {
  secondaryBg,
  headerBorderColor,
  tabActiveColor,
  blackColor
} = vars;

const tabsArr = [
  { id: 0, name: 'Term Info' },
  { id: 1, name: 'Images' },
  { id: 2, name: 'Stack Viewers' },
  { id: 3, name: 'Template ROI Browser' }
]

const MainLayout = ({ bottomNav, setBottomNav }) => {
  const theme = useTheme();
  
  const sidebarOpen = useSelector(state => state.globalInfo.termInfoOpened)
  const [modalOpen, setModalOpen] = useState(false);
  const desktopScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const defaultActiveTab = desktopScreen ? [0, 1, 2, 3, 4] : [0];
  const [tab, setTab] = useState([]);
  const [LayoutComponent, setLayoutComponent] = useState(undefined);
  const launchTemplate = useSelector(state => state.instances.launchTemplate)
  const dispatch = useDispatch();
  let templateRef = window.location.origin + "?id=" + launchTemplate?.metadata?.Id;
  const store = useStore();

  //global reducers errors
  const instancesError = useSelector(state => state.instances.error);
  const instancesErrorMessage = useSelector(state => state.instances.errorMessage);
  const queriesError = useSelector(state => state.queries.error);
  const queriesErrorMessage = useSelector(state => state.queries.errorMessage);
  const allLoadedInstances = useSelector( state => state.instances.allLoadedInstances);

  const modalError = instancesError || queriesError;
  const modalErrorMessage = instancesErrorMessage || queriesErrorMessage;

  useEffect(() => {
    setTab(defaultActiveTab)
  }, [desktopScreen])

  useEffect(() => {
    if ( launchTemplate !== null ) {
      setModalOpen(true)
    } else {
      setModalOpen(false)
    }
  }, [launchTemplate])

  useEffect(() => {
    if (LayoutComponent === undefined) {
      const myManager = getLayoutManagerInstance();
      if (myManager) {
        myManager.enableMinimize = true
        setLayoutComponent(myManager.getComponent());
      }
    }
  }, [store])

  useEffect(() => {
    dispatch(addWidget(widgets.threeDCanvasWidget));
    dispatch(addWidget(widgets.stackViewerWidget));
    dispatch(addWidget(widgets.circuitBrowserWidget));
    dispatch(addWidget(widgets.roiBrowserWidget));
    dispatch(addWidget(widgets.termContextWidget));
    dispatch(addWidget(widgets.listViewerWidget));
  }, [])

  const classes = {
    tabs: {
      height: '2.75rem',
      background: secondaryBg,

      '& .MuiButton-text': {
        height: '100%',
        flex: 1,
        position: 'relative',

        '&.active': {
          '&:after': {
            position: 'absolute',
            content: '""',
            height: '0.125rem',
            width: '100%',
            bottom: 0,
            background: tabActiveColor,
          }
        }
      }
    },

    tabContent: {
      background: headerBorderColor,
      '& > div': {
        flex: 1,
        // display: 'flex'
      }
    },
    modalStyle : {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    }
  }

  const handleTabSelect = (id) => {
    setTab([id])
  }

  const setSidebarOpen = (opened) => {
    dispatch(setTermInfoOpened(opened))
  }


  const handleModalClose = (id, openTemplate) => {
    templateLoaded(id, openTemplate);
    setModalOpen(false)
    templateRef = window.location.origin + "?id=" + id
  }

  const tabContent = (
    <>
      {tab.includes(0) && (
        <TermInfo open={sidebarOpen} setOpen={setSidebarOpen} />
      )}

      {tab.includes(1) && (
        // TODO the styling is just temporary, needs to be fixed
        <Box>
          {LayoutComponent === undefined ? <CircularProgress/> : <LayoutComponent/>}
        </Box>
      )}
    </>
  )

  return (
    <>
      {/*<MediaQuery maxWidth={1199}>
        {!bottomNav ? (
          <Box display='flex' sx={classes.tabs}>
            {tabsArr.map((el) => (
              <Button sx={{ px: 0 }} className={tab.includes(el.id) ? 'active' : ''} key={el.id} onClick={() => handleTabSelect(el.id)}>
                {el.name}
              </Button>
            ))}
          </Box>
        ) : null}
      </MediaQuery>
      */}
      <ErrorModal display={modalError} message={modalErrorMessage} />
      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={classes.modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Template Alignation
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            The image you requested is aligned to another template. Click Okay
            to open in a new tab or Cancel to just view the image metadata.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleModalClose(launchTemplate?.metadata?.Id, true )} target="_blank" href={templateRef}>Okay</Button>
          <Button variant="outlined" color="secondary" onClick={() => handleModalClose(launchTemplate?.metadata?.Id, false )}>Cancel</Button>
        </Box>
      </Modal>
      <Box
        display='flex'
        flexWrap='wrap'
        alignItems='flex-start'
        gap={1}
        sx={{
          ...classes.tabContent,
          position: {
            lg: 'relative'
          },
          paddingTop: {
            lg: 1
          },
          paddingRight: {
            lg: 1
          },
          pb: {
            xs: 7,
            sm: 9,
            lg: 0
          },
          overflow: {
            xs: 'auto',
            md: 'visible'
          },
          height: {
            xs: !bottomNav ? 'calc(100vh - 8.8125rem)' : 'calc(100vh - 6.0625rem)',
            lg: 'calc(100vh - 6rem)'
          },
        }}
      >
        {desktopScreen ? (
          <>
            {tabContent}
            {bottomNav === 0 && < VFBUploader open={true} setBottomNav={setBottomNav} />}
            {bottomNav === 1 && <VFBDownloadContents open={true} setBottomNav={setBottomNav} />}
            {bottomNav === 2 && <QueryBuilder setBottomNav={setBottomNav} fullWidth={sidebarOpen} />}
            {bottomNav === 4 && ( allLoadedInstances?.length > 1 && removeAllInstances())}
            {bottomNav === 5 && <QueryBuilder setBottomNav={setBottomNav} fullWidth={sidebarOpen} tabSelected={1}/>}
          </>
        ) : (
          <>
            {
              bottomNav != 2 && tabContent
            }
            {bottomNav === 0 && <VFBUploader open={true} setBottomNav={setBottomNav} />}
            {bottomNav === 1 && <VFBDownloadContents open={true} setBottomNav={setBottomNav} />}
            {bottomNav === 2 && <QueryBuilder setBottomNav={setBottomNav} fullWidth={sidebarOpen} />}
            {bottomNav === 4 && ( allLoadedInstances?.length > 1 && removeAllInstances())}
            {bottomNav === 5 && <QueryBuilder setBottomNav={setBottomNav} fullWidth={sidebarOpen} tabSelected={1}/>}
          </>
        )}
      </Box>
    </>
  )
};

export default MainLayout;
