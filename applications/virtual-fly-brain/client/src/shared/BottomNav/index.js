import { Typography } from "@material-ui/core";
import { Box, Button } from "@mui/material";
import React from "react";
import { ClearAll, Download, Query, Upload } from "../../icons";
import vars from "../../theme/variables";

const {
  whiteColor,
  bottomNavBg
} = vars;

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
    icon: <ClearAll />,
    name: 'Clear all'
  },
]

const BottomNav = () => {
  const classes = {
    root: {
      padding: '0 0.75rem',
      height: '3.5rem',
      position: 'fixed',
      width: '100%',
      bottom: 0,
      background: bottomNavBg,
      backdropFilter: 'blur(0.3125rem)',

      '& p': {
        fontSize: '0.625rem',
        lineHeight: '0.875rem',
        fontWeight: 400,
        color: whiteColor,
        marginTop: '0.375rem'
      }
    }
  };

  return (
    <Box
      display='flex'
      flexWrap='wrap'
      sx={classes.root}
    >
      {navArr.map((item) => (
        <Button
          sx={{
            height: '100%',
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}

          key={item.id}
        >
          {item.icon}
          <Typography>{item.name}</Typography>
        </Button>
      ))}
    </Box>
  )
}

export default BottomNav