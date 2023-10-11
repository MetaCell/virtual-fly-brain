import React, { useEffect, useState } from "react";
import MediaQuery from 'react-responsive';
import { useDispatch, useStore } from 'react-redux';
import { Box, Button, useMediaQuery, useTheme, CircularProgress } from "@mui/material";
import vars from "../theme/variables";
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

  const theme = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const desktopScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const defaultActiveTab = desktopScreen ? [0, 1, 2, 3] : [0];
  const [tab, setTab] = useState([]);
  const [LayoutComponent, setLayoutComponent] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setTab(defaultActiveTab)
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
    //dispatch(addWidget(threeDCanvasWidget));
    //dispatch(addWidget(stackViewerWidget));
    //dispatch(addWidget(sideBarWidget(sidebarOpen, setSidebarOpen)));
    //dispatch(addWidget(roiBrowserWidget));
  }, [sidebarOpen, setSidebarOpen])


  const handleTabSelect = (id) => {
    setTab([id])
  }

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

        {desktopScreen ? (
          <>
            <Box p={2} sx={{
              display: 'flex',
              position: 'relative',
              width: '100%',
              height: '90vh',
            }}>
              {LayoutComponent === undefined ? <CircularProgress/> : <LayoutComponent/>}
            </Box>
          </>
          ) : (
              <>
                <QueryBuilder setBottomNav={setBottomNav} fullWidth={sidebarOpen} />
              </>
          )}
      </>
    )
};

export default MainLayout;