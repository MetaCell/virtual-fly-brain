import { Box, Typography } from "@mui/material";
import React from "react";
import vars from "../../../theme/variables";
import { Item } from "./listItem";

const { searchHeadingColor } = vars;

export const RecentSearch = ({ recentSearch, chipColors }) => {

  return (
    <Box sx={{
      py: '1rem',
      px: '0.75rem',
    }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.75rem',
          lineHeight: '133%',
          letterSpacing: '-0.005em',
          fontWeight: 500,
          color: searchHeadingColor
        }}
      >
        Recent search
      </Typography>

      <Box mt={1.5}>
        {recentSearch.map((search, index) => (
          <Item
            key={`recentSearch-${index}`}
            search={search}
            chipColors={chipColors}
            index={index}
          />
        ))}
      </Box>
    </Box>
  )
}