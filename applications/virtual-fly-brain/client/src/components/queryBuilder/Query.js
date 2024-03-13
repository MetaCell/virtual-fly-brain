import React from "react";
import { Box, Button, Chip, Divider, Grid, Tooltip } from "@mui/material";
import QueryCard from "./Card";
import { Cross } from "../../icons";
import QueryHeader from "./QueryHeader";
import vars from "../../theme/variables";
import Filter from "./Filter";
import { getUpdatedTags } from "../../utils/utils";

const { headerBorderColor, searchHeadingColor, secondaryBg, listHeadingColor, primaryBg } = vars;
const colors_config = require("../configuration/VFBColors").facets_annotations_colors;
const facets_annotations_colors = getUpdatedTags(colors_config)

export const dividerStyle = {
  height: '0.875rem', width: '0.0625rem', background: listHeadingColor, borderRadius: '0.125rem'
}

const Query = ({ fullWidth, queries }) => {
  let count = 0;
  queries?.filter(q => q.active).forEach( query => {
    if ( query.Examples) {
      count = count + Object.keys(query.Examples)?.length;
    } else if ( query.Images) {
      count = count + Object.keys(query.Images)?.length;
    }
  });
  const title = count + " Query results";
  const tags = [];
  queries?.filter(q => q.active).forEach( (query, index ) => {
    query.Tags?.forEach( tag => {
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
                  backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color,
                  height: '1.25rem',
                  color: facets_annotations_colors[tag]?.textColor || facets_annotations_colors?.default?.textColor,
                  '&:hover': {
                    backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color,
                    color: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.textColor
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
                          backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color,
                          color: facets_annotations_colors[tag]?.textColor || facets_annotations_colors?.default?.textColor
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
          <Filter facets_annotations_colors={facets_annotations_colors} />
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
          {queries?.filter(q => q.active).map( (query, index ) => {
            let examples = {};
            if ( query?.Examples ){
              examples = query?.Examples;
            } else if ( query?.Images ){
              examples = query?.Images;
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
                  <QueryCard facets_annotation={query.Tags} query={query?.Examples?.[item][0] || query?.Images?.[item][0]} fullWidth={fullWidth} />
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