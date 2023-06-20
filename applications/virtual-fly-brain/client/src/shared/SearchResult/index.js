import { Box, Typography } from "@mui/material";
import React from "react";
import vars from "../../theme/variables";
import { Item } from "./listItem";


const {
  searchHeadingColor} = vars;

export const SearchResult = ({ getOptionProps, resultArr, chipColors }) => {
  return (
    <Box sx={{
      py: '1rem',
      px: '0.75rem',
    }}>
      <Typography variant="body2" sx={{
        fontSize: '0.75rem',
        lineHeight: '133%',
        letterSpacing: '-0.005em',
        fontWeight: 500,
        color: searchHeadingColor
      }}>
        Suggested results
      </Typography>
      <Box mt={1.5}>
        {resultArr?.map((option, index) => (
          <Box key={`groupedOptions-${index}`} {...getOptionProps({ option, index })}>
            <Item
              chipColors={chipColors}
              key={option?.title}
              option={option}
              onClick={() => handleResultSelection(option)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}