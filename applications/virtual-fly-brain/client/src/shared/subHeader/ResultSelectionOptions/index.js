import { Box, Typography, Button } from "@mui/material";
import React from "react";
import { AddChart, AngleRight, SplitScreen } from "../../../icons";
import vars from "../../../theme/variables";

const { searchHeadingColor, outlinedBtnBorderColor, primaryBg } = vars;

export const ResultSelectionOptions = ({ addQueryTag, loadResults, loadQueries }) => {
  return (
    <Box sx={{
      py: '1rem',
      px: '0.75rem',
      borderBottom: `0.0625rem solid ${primaryBg}`,
    }}>
      <Typography variant="body2" sx={{
        fontSize: '0.75rem',
        lineHeight: '133%',
        letterSpacing: '-0.005em',
        fontWeight: 500,
        color: searchHeadingColor
      }}>
        I’m looking for...
      </Typography>

      <Box
        mt={1.5}
        sx={{
          columnGap: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button sx={{
          px: '0.5rem',
          py: '0.25rem',
          backgroundColor: outlinedBtnBorderColor,
          borderRadius: 1,
          fontSize: '0.75rem',
          height: '1.5rem',

          '&:hover': {
            backgroundColor: outlinedBtnBorderColor,
          }
        }}
        onClick={loadResults}
        >
          <AddChart style={{ marginRight: '0.5rem' }} />
          Load results
          <AngleRight style={{ marginLeft: '0.5rem' }} />
        </Button>

        <Button sx={{
          px: 1,
          py: 0.5,
          fontSize: '0.75rem',
          height: '1.5rem',
          backgroundColor: outlinedBtnBorderColor,
          borderRadius: 1,

          '&:hover': {
            backgroundColor: outlinedBtnBorderColor,
          }
        }}
          onClick={addQueryTag}
        >
          <SplitScreen style={{ marginRight: '0.5rem' }} />
          Queries
          <AngleRight style={{ marginLeft: '0.5rem' }} />
        </Button>
      </Box>
    </Box>
  )
}