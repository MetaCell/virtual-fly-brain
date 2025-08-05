import { Typography } from "@material-ui/core";
import { Box, Button } from "@mui/material";
import React from "react";
import { ClearAll, Download, Query, Upload, Layers } from "../../icons";
import vars from "../../theme/variables";

const {
  whiteColor,
  bottomNavBg,
  tabActiveColor
} = vars;

const navArr = [
  {
    id: 0,
    icon: Upload,
    name: 'Upload'
  },
  {
    id: 1,
    icon: Download,
    name: 'Download'
  },
  {
    id: 2,
    icon: Query,
    name: 'Query'
  },
  {
    id: 3,
    icon: ClearAll,
    name: 'Clear all'
  },
]

const BottomNav = ({ setBottomNav, bottomNav }) => {
  const classes = {
    root: {
      padding: {
        xs: '0 0.75rem',
        sm: '0 1.5rem'
      },
      height: {
        xs: '3.5rem',
        sm: '4.5rem'
      },
      position: 'fixed',
      width: '100%',
      bottom: 0,
      background: bottomNavBg,
      backdropFilter: 'blur(0.3125rem)',

      '& p': {
        fontSize: {
          xs: '0.625rem',
          sm: '0.875rem'
        },
        lineHeight: '0.875rem',
        fontWeight: 400,
        color: whiteColor,
        marginTop: {
          xs: '0.375rem',
          sm: '0.5rem'
        }
      }
    }
  };

  return (
    <Box
      display='flex'
      flexWrap='wrap'
      sx={classes.root}
    >
      {navArr.map((item, index) => (
        <Button
          sx={{
            height: '100%',
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}

          onClick={() => setBottomNav(index)}
          key={item.id}
        >
          <item.icon color={item?.id === bottomNav ? tabActiveColor : 'white'} />
          <Typography>{item.name}</Typography>
        </Button>
      ))}
    </Box>
  )
}

export default BottomNav
