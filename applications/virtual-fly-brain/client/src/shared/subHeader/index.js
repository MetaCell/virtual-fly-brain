import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { ClearAll, Download, History, Layers, Query, Search, Upload } from "../../icons";
import vars from "../../theme/variables";
import MediaQuery from 'react-responsive'

const navArr = [
  {
    id: 0,
    icon: <Upload />,
    name: 'Upload'
  },
  {
    id: 1,
    icon: <Download />,
    name: 'Download'
  },
  {
    id: 2,
    icon: <Query />,
    name: 'Query'
  },
  {
    id: 3,
    icon: <Layers />,
    name: 'Layer'
  },
  {
    id: 3,
    icon: <ClearAll />,
    name: 'Clear all'
  },
  {
    id: 3,
    icon: <History />,
    name: 'Recent'
  },
]

const {
  primaryBg,
  secondaryBg,
  searchBoxBg,
  whiteColor,
  shortcutBg
} = vars;

const SubHeader = () => {
  const classes = {
    root: {
      position: 'relative',
    },

    nav: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)'
    },

    shortcut: {
      backgroundColor: shortcutBg,
      borderRadius: 2,
      width: '4.1875rem',
      height: '1.75rem',
      color: whiteColor,
    }
  };

  return (
    <Box sx={{
      ...classes.root,
      py: {
        xs: 1,
        lg: 0.5
      },
      px: 1.5,
      backgroundColor: {
        xs: primaryBg,
        lg: secondaryBg
      }
    }}>
      <Box
        sx={{
          width: {
            lg: '35rem'
          },
          mx: {
            lg: 'auto'
          },
          borderRadius: {
            lg: 2
          },
          pl: {
            lg: 1.5
          },
          py: {
            lg: 0.25
          },
          pr: {
            lg: 0.5
          },
          backgroundColor: {
            lg: searchBoxBg
          }
        }}
        display='flex'
        alignItems='center'>
        <Search />
        <TextField
          sx={{
            ml: 1
          }}
          fullWidth
          placeholder="Find something..."
          variant="standard"
        />
        <MediaQuery minWidth={1200}>
          <Button
            sx={{
              ...classes.shortcut,
              flexShrink: 0,
            }}
          >
            Ctrl + K
          </Button>
        </MediaQuery>
      </Box>

      <MediaQuery minWidth={1200}>
        <Box
          display='flex'
          flexWrap='wrap'
          sx={classes.nav}
        >
          {navArr.map((item) => (
            <Button
              aria-label={item.name}
              sx={{
                minWidth: '0.0625rem'
              }}
              key={item.id}
            >
              {item.icon}
            </Button>
          ))}
        </Box>
      </MediaQuery>
    </Box>
  )
};

export default SubHeader