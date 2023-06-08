
import React, { useEffect, useState } from "react";
import MediaQuery from 'react-responsive';
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import ThreeDCanvas from "./ThreeDCanvas"
import TermInfo from "./TermInfo"
import Images from "./Images";
import StackViewer from './StackViewer';
import vars from "../theme/variables";
import SideBar from "../shared/Sidebar";
import Circuit from "./Circuit";
import StackViewerComponent from "./StackViewerComponent";
const {
  secondaryBg,
  headerBorderColor,
  tabActiveColor
} = vars;

const tabsArr = [
  { id: 0, name: 'Term Info' },
  { id: 1, name: 'Images' },
  { id: 2, name: 'Circuits' },
  { id: 3, name: 'Stack Viewer' }
]

const MainLayout = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('lg'));
  const defaultActiveTab = matches ? [0, 1, 2, 3] : [0];
  const [tab, setTab] = useState([]);

  useEffect(() => {
    setTab(defaultActiveTab)
  }, [matches])

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

  return (
    <>
      <MediaQuery maxWidth={1199}>
        <Box display='flex' sx={classes.tabs}>
          {tabsArr.map((el) => (
            <Button sx={{px: 0}} className={tab.includes(el.id) ? 'active' : ''} key={el.id} onClick={() => handleTabSelect(el.id)}>
              {el.name}
            </Button>
          ))}
        </Box>
      </MediaQuery>


      <Box
        display='flex'
        flexWrap='wrap'
        alignItems='flex-start'
        gap={1}
        sx={{
          ...classes.tabContent,
          paddingTop: {
            lg: 1
          },
          paddingRight: {
            lg: 1
          },
          pb: {
            xs: 5,
            lg: 0
          },
          overflow: {
            xs: 'auto',
          },
          height: {
            xs: 'calc(100vh - 8.8125rem)',
            lg: 'calc(100vh - 6.375rem)'
          },
        }}
      >
        {tab.includes(0) && (
          <SideBar />
        )}

        {tab.includes(1) && (
          <ThreeDCanvas />
        )}

        {tab.includes(2) && (
          <StackViewerComponent />
        )}
      </Box>
    </>
  )
};

export default MainLayout;