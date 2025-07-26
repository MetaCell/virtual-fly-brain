import { Box, Typography, Chip, Tooltip } from "@mui/material";
import React from "react";
import vars from "../../../theme/variables";
import { Search } from "../../../icons";
import { getUpdatedTags } from "../../../utils/utils";
import { facets_annotations_colors as colors_config } from "../../../components/configuration/VFBColors";

const facets_annotations_colors = getUpdatedTags(colors_config)

const { secondaryBg, searchBoxBg, whiteColor, searchHeadingColor, listHover } = vars;
const chips_cutoff = 3;
export const SearchResult = ({ getOptionProps, selectedFilters, groupedOptions, handleResultSelection }) => {
  const hasTag = (facets_annotations) => {
    let hasTag = true;
    facets_annotations?.forEach( annotation => {
      if ( selectedFilters[annotation] === false) {
        hasTag = false;
      }
    })

    return hasTag;
  }

  const renderTooltipChips = (option) => {
    return <>
      {
        option?.facets_annotation
        .slice(chips_cutoff)
        .map((tag, index) => (
          <Chip
            key={tag + index}
            sx={{
              lineHeight: '140%',
              fontSize: '0.625rem',
              backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color,
              color: facets_annotations_colors[tag]?.textColor || facets_annotations_colors?.default?.textColor,
              marginRight: '0.25rem',
              marginBottom: '0.25rem'
            }}
            label={tag}
          />
        ))
      }
    </>
  };

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
        {groupedOptions?.map((option, index) => ( hasTag(option.facets_annotation) === true ?
          <Box key={`groupedOptions-${index}`} {...getOptionProps({ option, index })}>
            <Box onClick={() => handleResultSelection(option)} sx={{
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
                borderRadius: '0.5rem'
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
                {option?.label}
              </Typography>

              <Box sx={{
                ml: 'auto',
                display: 'flex',
                alignItems: 'center',
                width: '30%',
                columnGap: 0.5,
                justifyContent: 'end'
              }}>
                {option?.facets_annotation.slice(0,chips_cutoff).map((tag, index) => {
                    return <Chip
                      key={tag + index}
                      sx={{
                        lineHeight: '140%',
                        fontSize: '0.625rem',
                        backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color,
                        color: facets_annotations_colors[tag]?.textColor || facets_annotations_colors?.default?.textColor
                      }}
                      label={tag}
                    />
                }
                )}
                {
                  option?.facets_annotation?.length > 3 && <Tooltip
                    title={renderTooltipChips(option)} 
                    placement="bottom-end" 
                    arrow
                  >
                    <Chip 
                      sx={{
                        lineHeight: '140%',
                        fontSize: '0.625rem',
                        backgroundColor: searchBoxBg
                      }} 
                      label={`+${option?.facets_annotation?.length - chips_cutoff}`}
                    />
                  </Tooltip>
                }
              </Box>
            </Box>
          </Box> : null
        ))}
      </Box>
    </Box>
  )
}