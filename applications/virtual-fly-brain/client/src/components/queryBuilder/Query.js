import React from "react";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import QueryCard from "./Card";
import { Cross, ImportExport } from "../../icons";
import QueryHeader from "./QueryHeader";
import vars from "../../theme/variables";
import Filter from "./Filter";

const { chipOrange, chipGreen, headerBorderColor, searchHeadingColor, secondaryBg } = vars;

const chipsArr = [
  {
    id: 0,
    label: 'Anatomy',
    color: chipGreen
  },
  {
    id: 1,
    label: 'Neuron',
    color: chipOrange
  }
];

const Query = ({ fullWidth, queries }) => {
  const title = queries.length + " Query results";
  return (
    <>
      <QueryHeader title={title} />

      <Box
        position='sticky'
        top={43}
        display='flex'
        alignItems='center'
        zIndex={9}
        px={1.5}
        py={1}
        sx={{
          borderBottom: `0.0625rem solid ${secondaryBg}`,
          background: {
            xs: headerBorderColor,
            lg: 'rgba(34, 34, 34, 0.20)'
          },
          backdropFilter: 'blur(0.625rem)',
        }}
      >
        <Box flex={1}>
          <Box display='flex' gap={0.5}>
            {chipsArr?.map(item => (
              <Chip
                onClick={() => null}
                onDelete={() => null}
                key={item.id}
                deleteIcon={
                  <Cross
                    size={12}
                    style={{ marginRight: 0, marginLeft: '0.25rem' }}
                  />
                }
                sx={{
                  lineHeight: '0.875rem',
                  fontSize: '0.625rem',
                  background: item.color,
                  height: '1.25rem',
                  '&:hover': {
                    background: item.color,
                  }
                }}
                label={item.label} />
            ))}
          </Box>
        </Box>

        <Box display='flex' gap={1.2}>
          <Button
            disableRipple
            variant="text"
            sx={{
              minWidth: '0.0625rem',
              padding: 0,
              color: searchHeadingColor,
              fontSize: '0.6875rem',
              fontWeight: 500,
              height: '1.25rem',
              lineHeight: '0.9375rem',
              letterSpacing: '-0.00344rem',

              '&:hover': {
                background: 'transparent'
              }
            }}
          >
            Clear all
          </Button>

          <Filter />
        </Box>
      </Box>

      <Box overflow='auto' height='calc(100% - 5.375rem)' p={1.5}>
        <Grid container spacing={1.5}>
          {queries?.map( (query, index ) => {
            let examples = {};
            if ( query?.queries?.Examples ){
              examples = query?.queries?.Examples;
            }
            return ( Object.keys(examples)?.map((item, index) => {
              return (
                <Grid
                  key={index}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={fullWidth ? 4 : 3}
                  xl={3}
                >
                  <QueryCard facet_annotations={query.facet_annotations} query={query?.queries?.Examples[item][0]} fullWidth={fullWidth} />
                </Grid>
              )
            }))
          })}
        </Grid>
      </Box>
    </>
  )
};

export default Query;