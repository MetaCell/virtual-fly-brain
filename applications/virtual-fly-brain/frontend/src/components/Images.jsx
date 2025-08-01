import { Box } from "@mui/material";
import React from "react";
import vars from "../theme/variables";

const {
  secondaryBg,
  whiteColor,
  blackColor
} = vars;

const Images = () => {
  const classes = {
    root: {
      height: 'calc(100% - 0.5rem)',
      color: whiteColor
    }
  }

  return (
    <Box
      sx={{
        ...classes.root,
        background: {
          lg: blackColor
        },
        p: {
          xs: 2,
          lg: 0
        },
        borderColor: {
          lg: secondaryBg
        },
        borderStyle: {
          lg: 'solid'
        },
        borderRadius: {
          lg: 2
        },
        borderWidth: {
          xs: 0,
          lg: '0.0625rem 0.0625rem 0 0'
        }
      }}
    >
      Images
    </Box>
  )
};

export default Images;