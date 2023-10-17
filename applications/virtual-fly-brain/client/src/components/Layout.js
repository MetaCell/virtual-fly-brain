
import React, { useEffect, useState } from "react";
import { useDispatch, useStore } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Box, Button, useMediaQuery, useTheme, CircularProgress } from "@mui/material";import ThreeDCanvas from "./ThreeDCanvas"
import TermInfo from "./TermInfo"
import Images from "./Images";
import StackViewer from './StackViewer';
import ROIBrowser from './ROIBrowser/ROIBrowser';
import vars from "../theme/variables";
import SideBar from "../shared/sidebar";
import Circuit from "./Circuit";
import StackViewerComponent from "./StackViewerComponent";
import VFBDownloadContents from "./VFBDownloadContents/VFBDownloadContents";
import VFBUploader from "./VFBUploader/VFBUploader";
import QueryBuilder from "./queryBuilder";
import { getLayoutManagerInstance } from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
import { addWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import { threeDCanvasWidget, stackViewerWidget, sideBarWidget, roiBrowserWidget } from "./layout/widgets";
import store from "../store";
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
  { id: 3, name: 'ROI Browser' }
]

const MainLayout = ({ bottomNav, setBottomNav }) => {
  const theme = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const desktopScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const defaultActiveTab = desktopScreen ? [0, 1, 2, 3] : [0];
  const [tab, setTab] = useState([]);
  const [LayoutComponent, setLayoutComponent] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setTab(defaultActiveTab)
    if (!desktopScreen) {
      setBottomNav(2)
    }
  }, [desktopScreen])

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
    dispatch(addWidget(threeDCanvasWidget));
    // TODO: fix stack viewer
    // dispatch(addWidget(stackViewerWidget));
    //dispatch(addWidget(sideBarWidget(sidebarOpen, setSidebarOpen)));
    dispatch(addWidget(roiBrowserWidget));
  }, [sidebarOpen, setSidebarOpen])

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
  }

  const handleTabSelect = (id) => {
    setTab([id])
  }

  const tabContent = (
    <>
      {tab.includes(0) && (
        <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
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
      <MediaQuery maxWidth={1199}>
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
            {bottomNav === 0 && <VFBUploader open={true} setBottomNav={setBottomNav} />}
            {bottomNav === 1 && <VFBDownloadContents open={true} setBottomNav={setBottomNav} />}
            {bottomNav === 2 && <QueryBuilder setBottomNav={setBottomNav} fullWidth={sidebarOpen} />}
          </>
        ) : (
          <>
            {
              bottomNav != 2 && tabContent
            }
            {bottomNav === 0 && <VFBUploader open={true} setBottomNav={setBottomNav} />}
            {bottomNav === 1 && <VFBDownloadContents open={true} setBottomNav={setBottomNav} />}
            {bottomNav === 2 && <QueryBuilder setBottomNav={setBottomNav} fullWidth={sidebarOpen} />}
          </>
        )}
      </Box>
    </>
  )
};

export default MainLayout;
