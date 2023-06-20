import React from "react"
import { Box, Button, Chip, Typography } from "@mui/material"
import { Search } from "../../icons";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import vars from "../../theme/variables";

const {
  secondaryBg,
  searchBoxBg,
  whiteColor,
  searchHeadingColor,
  listHover } = vars;

export const Item = ({ onClick, option, chipColors }) => {
  return (
    <Box onClick={onClick} sx={{
      position: 'relative',
      p: 0.5,
      borderRadius: 1,
      display: 'flex',
      alignItems: 'center',

      '& > button': {
        opacity: 1,
        transition: 'all ease-in-out .3s'
      },

      '&:not(:hover)': {
        '& > button': {
          opacity: 0
        }
      },

      '&:hover': {
        backgroundColor: secondaryBg,
        cursor: 'pointer',
      }
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: 1,
        background: searchBoxBg,
      }}>
        <Search size={12} />
      </Box>

      <Typography variant="body2" sx={{
        fontSize: '0.75rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: searchHeadingColor,
        px: 1
      }}>
        {option?.title}
      </Typography>

      <Box sx={{
        ml: 'auto',
        display: 'flex',
        alignItems: 'center',
        columnGap: 0.5
      }}>
        {option?.tags.map((tag, index) => <Chip
          key={tag + index}
          sx={{
            lineHeight: '140%',
            fontSize: '0.625rem',
            backgroundColor: chipColors[index] || chipColors[0]
          }}
          label={tag}
        />)}
      </Box>

      <Button sx={{
        color: whiteColor,
        zIndex: 9,
        justifyContent: 'flex-end',
        background: listHover,
        borderRadius: '0.25rem',
        width: '5.8125rem',
        minWidth: '0.0625rem',
        p: '0 0.75rem 0 0',
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0
      }} variant='text'>
        <ArrowOutwardIcon sx={{
          fontSize: '0.75rem',
          m: 0,
        }} />
      </Button>

    </Box>
  )
}