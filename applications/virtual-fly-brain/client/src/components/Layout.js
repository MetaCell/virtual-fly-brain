
import React, { useEffect, useState } from "react";
import MediaQuery from 'react-responsive';
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import ThreeDCanvas from "./ThreeDCanvas"
import StackViewer from './StackViewer';
import vars from "../theme/variables";
import SideBar from "../shared/sidebar";
import QueryBuilder from "./queryBuilder";
const {
  secondaryBg,
  headerBorderColor,
  tabActiveColor,
  blackColor
} = vars;

const tabsArr = [
  { id: 0, name: 'Term Info' },
  { id: 1, name: 'Images' },
  { id: 2, name: 'Circuits' },
  // { id: 3, name: 'Stack Viewer' }
]

const MainLayout = ({ bottomNav, setBottomNav }) => {
  const theme = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const desktopScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const defaultActiveTab = desktopScreen ? [0, 1, 2] : [0];
  const [tab, setTab] = useState([]);

  useEffect(() => {
    setTab(defaultActiveTab)
  }, [desktopScreen])

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
        <ThreeDCanvas />
      )}

      {tab.includes(2) && (
          <StackViewer 
            id="NewStackViewer"
            defHeight={600}
            defWidth={600}
          />
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
            {bottomNav === 2 && <QueryBuilder setBottomNav={setBottomNav} fullWidth={sidebarOpen} />}
          </>
        ) : (
            <>
              <QueryBuilder setBottomNav={setBottomNav} fullWidth={sidebarOpen} />
            </>
        )}
      </Box>
    </>
  )
};

export default MainLayout;