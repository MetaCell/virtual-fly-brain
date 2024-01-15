import React from "react";
import { Box, Button, Chip, Divider, Grid, Tooltip } from "@mui/material";
import QueryCard from "./Card";
import { Cross } from "../../icons";
import QueryHeader from "./QueryHeader";
import vars from "../../theme/variables";
import Filter from "./Filter";

const { chipOrange, chipGreen, chipRed, chipPink, chipYellow, headerBorderColor, searchHeadingColor, secondaryBg, listHeadingColor, primaryBg } = vars;
const chipColors = [chipRed, chipGreen, chipOrange, chipPink, chipYellow];

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

export const dividerStyle = {
  height: '0.875rem', width: '0.0625rem', background: listHeadingColor, borderRadius: '0.125rem'
}

const Query = ({ fullWidth, queries }) => {
  let count = 0;
  queries.forEach( query => {
    if ( query.queries?.Examples) {
      count = count + Object.keys(query.queries?.Examples)?.length;
    } else if ( query.queries?.Images) {
      count = count + Object.keys(query.queries?.Images)?.length;
    }
  });
  const title = count + " Query results";
  const tags = [];
  queries?.forEach( (query, index ) => {
    query.facets_annotation?.forEach( tag => {
      if ( !tags.includes(tag) ){
        tags.push(tag);
      }
    })
  })
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
            {tags?.slice(0, fullWidth ? 7 : 10)?.map( (tag, index) => (
              <Chip
                onClick={() => null}
                onDelete={() => null}
                key={tag}
                deleteIcon={
                  <Cross
                    size={12}
                    style={{ marginRight: 0, marginLeft: '0.25rem' }}
                  />
                }
                sx={{
                  lineHeight: '0.875rem',
                  fontSize: '0.625rem',
                  backgroundColor: chipColors[index%(chipColors.length-1)] || chipColors[0],
                  height: '1.25rem',
                  '&:hover': {
                    backgroundColor: chipColors[index%(chipColors.length-1)] || chipColors[0]
                  }
                }}
                label={tag} />
            ))}
            {tags?.slice(fullWidth ? 7 : 10).length > 0 ? (
              <Tooltip
                arrow
                title={
                  <Box display='flex' py={1} flexWrap='wrap' gap={0.5}>
                    {tags?.slice(fullWidth ? 7 : 10).map((tag, index) => (
                      <Chip
                        onClick={() => null}
                        onDelete={() => null}
                        key={tag + index}
                        deleteIcon={
                          <Cross
                            size={12}
                            style={{ marginRight: 0, marginLeft: '0.25rem' }}
                          />
                        }
                        sx={{
                          lineHeight: '140%',
                          fontSize: '0.625rem',
                          backgroundColor: chipColors[index%(chipColors.length-1)] || chipColors[0]
                        }}
                        label={tag} />
                    ))}
                  </Box>
                }
              >
                <Chip
                  className="default-chip"
                  sx={{ background: primaryBg }}
                  label={`+${tags?.slice(fullWidth ? 7 : 10).length}`}
                />
              </Tooltip>
            ) : null}

          </Box>
        </Box>

        <Box display='flex' alignItems='center' gap={ 1.2 }>
          <Filter />
          <Divider sx={dividerStyle} />
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
        </Box>
      </Box>

      <Box overflow='auto' height='calc(100% - 5.375rem)' p={1.5}>
        <Grid container spacing={1.5}>
          {queries?.map( (query, index ) => {
            let examples = {};
            if ( query?.queries?.Examples ){
              examples = query?.queries?.Examples;
            } else if ( query?.queries?.Images ){
              examples = query?.queries?.Images;
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
                  <QueryCard facets_annotation={query.facets_annotation} query={query?.queries?.Examples?.[item][0] || query?.queries?.Images?.[item][0]} fullWidth={fullWidth} />
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