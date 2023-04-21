import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import MediaQuery from 'react-responsive';
import { ChevronLeft, ChevronRight } from "../../icons";
import vars from "../../theme/variables";

const {
  whiteColor,
  secondaryBg,
  outlinedBtnTextColor,
  blackColor
} = vars;

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const classes = {
    root: {
      // transition: 'all ease-in-out .3s',
      height: '100%',
      color: whiteColor,
      display: 'flex',
      flexDirection: 'column'
    },

    footer: {
      height: '3.75rem',
      borderTop: `0.0625rem solid ${secondaryBg}`,
      '& p': {
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1,
        color: outlinedBtnTextColor,
      }
    },
  }

  return (
    <Box
      sx={{
        ...classes.root,
        width: {
          lg: open ? 'auto' : '2.75rem'
        },
        flex: {
          lg: open ? 1 : 'none !important'
        },
        p: {
          xs: 2,
          lg: 0
        },
        pt: {
          lg: open ? 0 : 4
        },
        background: {
          lg: blackColor
        },
        borderColor: {
          lg: secondaryBg
        },
        borderStyle: {
          lg: 'solid'
        },
        borderTopRightRadius: {
          lg: 2
        },
        borderWidth: {
          lg: '0.0625rem 0.0625rem 0 0'
        }
      }}
    >
      <Box flexGrow={1}>
        {!open ? (
          <Typography sx={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            transform: 'rotate(90deg)',
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1,
            color: whiteColor
          }}>
            <Typography
              component='span'
              sx={{
                fontWeight: 500,
                lineHeight: 1,
                mr: 1,
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              Term info:
            </Typography>
            JRC2018Unisex [VFB_00101567]
          </Typography>
        ) : (
          'SideBar'
        )}

      </Box>

      <MediaQuery minWidth={1200}>
        <Box
          px={open ? 1 : 0}
          display='flex'
          justifyContent='flex-end'
          alignItems='center'
          sx={classes.footer}
        >
          {open && <Typography>Collapse</Typography>}
          <Button
            onClick={() => setOpen((prev) => !prev)}
            sx={{
              height: 'auto',
              minWidth: '0.0625rem',
              ml: open ? 1 : 0
            }}
          >
            {open ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </Box>
      </MediaQuery>

    </Box>
  )
};

export default SideBar;