import React, { useEffect, useState } from "react";
import { Box, Button, Chip, Divider, Grid, Tooltip } from "@mui/material";
import QueryCard from "./Card";
import { Cross } from "../../icons";
import QueryHeader from "./QueryHeader";
import vars from "../../theme/variables";
import Filter from "./Filter";
import { getUpdatedTags } from "../../utils/utils";
import { updateQueries } from "./../../reducers/actions/queries"

const { headerBorderColor, searchHeadingColor, secondaryBg, listHeadingColor, primaryBg } = vars;
const colors_config = require("../configuration/VFBColors").facets_annotations_colors;
const facets_annotations_colors = getUpdatedTags(colors_config)

export const dividerStyle = {
  height: '0.875rem', width: '0.0625rem', background: listHeadingColor, borderRadius: '0.125rem'
}

const getQueries = (newQueries) => {
  let examples = {};
  let updatedQueries = []
  newQueries?.filter(q => q.active).forEach( (query, index ) => {
    if ( query?.Examples ){
      examples = query?.Examples;
    } else if ( query?.Images ){
      examples = query?.Images;
    }

    Object.keys(examples).map( key => {
      const example = examples[key][0];
      example.tags = query.Tags

      updatedQueries.push(example)
    });
  })
  
  return updatedQueries;
}

const Query = ({ fullWidth, queries }) => {
  const [chipTags , setChipTags] = useState([]);
  const [count, setCount] = useState(0)
  const [filteredSearches, setFilteredSearches] = React.useState(getQueries(queries));
  const initialFilters = {
    "filters" : {
      "Id" : "id",
      "Name" : "label"
    },
    "tags" : "tags"
  };
  const [filters, setFilters] = React.useState(initialFilters);

  const updateFilters = (searches) => {
    setFilteredSearches(searches)
  }

  useEffect( () => {
    let tags = {...initialFilters.filters};
    queries?.filter( q => q.active ).forEach( (query, index ) => {
      query.Tags?.forEach( tag => {
        if ( tags?.[tag] == undefined ){
          tags[tag] = tag;
        }
      })
    })
    setFilters({...filters, filters : tags});
  }, [queries])

  const getCount = () => {
    let count = 0;
    filteredSearches?.forEach( q => {
        if (chipTags?.filter(f => f.active)?.some(v => q.tags.includes(v.label)) ) {
          count = count + 1;
        }
    })

    return count;
  }

  useEffect( () => {
    setCount(getCount());
    let tags = [];
    queries?.filter(q => q.active).forEach( (query, index ) => {
      query.Tags?.forEach( tag => {
        if ( tags?.find(t => t.label === tag) == undefined ){
          tags.push({ label : tag, active : true});
        }
      })
    })
    setFilteredSearches(getQueries(queries))
    setChipTags(tags);
  }, [queries])
  
  const handleChipDelete = (label) => {
    let filtered = [...chipTags];
    filtered.find((tag) => tag?.label === label).active = false;
    setCount(getCount())
    setChipTags(filtered);
  }

  const clearAll = () => {
    updateQueries([]);
  }

  const clearAllTags = () => {
    let tags = [...chipTags]
    tags.forEach( c => c.active = false )
    setCount(getCount())
    setChipTags(tags);
  }

  return (
    <>
      <QueryHeader title={ getCount() + " Query results"} filters={filters} recentSearches={filteredSearches} setFilteredSearches={updateFilters} clearAll={clearAll}/>

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
            {chipTags?.filter(f => f.active)?.slice(0, fullWidth ? 7 : 10)?.map( (tag, index) => (
              <Chip
                onClick={() => null}
                disabled={!tag.active}
                onDelete={() => handleChipDelete(tag.label)}
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
                  backgroundColor: facets_annotations_colors[tag.label]?.color || facets_annotations_colors?.default?.color,
                  height: '1.25rem',
                  color: facets_annotations_colors[tag.label]?.textColor || facets_annotations_colors?.default?.textColor,
                  '&:hover': {
                    backgroundColor: facets_annotations_colors[tag.label]?.color || facets_annotations_colors?.default?.color,
                    color: facets_annotations_colors[tag.label]?.color || facets_annotations_colors?.default?.textColor
                  }
                }}
                label={tag.label} />
            )) }
            {chipTags?.filter(f => f.active)?.slice(fullWidth ? 7 : 10).length > 0 ? (
              <Tooltip
                arrow
                title={
                  <Box display='flex' py={1} flexWrap='wrap' gap={0.5}>
                    {chipTags?.filter(f => f.active)?.slice(fullWidth ? 7 : 10).map((tag, index) => (
                      <Chip
                        onClick={() => null}
                        onDelete={() => handleChipDelete(tag.label)}
                        key={tag.label + index}
                        deleteIcon={
                          <Cross
                            size={12}
                            style={{ marginRight: 0, marginLeft: '0.25rem' }}
                          />
                        }
                        sx={{
                          lineHeight: '140%',
                          fontSize: '0.625rem',
                          backgroundColor: facets_annotations_colors[tag.label]?.color || facets_annotations_colors?.default?.color,
                          color: facets_annotations_colors[tag.label]?.textColor || facets_annotations_colors?.default?.textColor
                        }}
                        label={tag.label} />
                    ))}
                  </Box>
                }
              >
                <Chip
                  className="default-chip"
                  sx={{ background: primaryBg }}
                  label={`+${chipTags?.slice(fullWidth ? 7 : 10).length}`}
                />
              </Tooltip>
            ) : null}

          </Box>
        </Box>

        <Box display='flex' alignItems='center' gap={ 1.2 }>
          <Filter setChipTags={setChipTags} facets_annotations_colors={facets_annotations_colors} tags={chipTags} clearAllTags={clearAllTags} />
          <Divider sx={dividerStyle} />
          <Button
            disableRipple
            variant="text"
            onClick={clearAllTags}
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
          {filteredSearches?.map( (query, index ) => {
            if ( chipTags?.filter(f => f.active)?.some(v => query.tags.includes(v.label)) ) {
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
                    <QueryCard facets_annotation={query.tags} query={query} fullWidth={fullWidth} />
                  </Grid>
                )
            }
          })}
        </Grid>
      </Box>
    </>
  )
};

export default Query;