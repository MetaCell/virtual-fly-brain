import { Box, Typography, Button, Chip } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import vars from "../../../theme/variables";

const { searchHeadingColor, primaryBg, outlinedBtnTextColor } = vars;

export const NarrowSearchFilter = ({groupedOptions, facets_annotations_colors}) => {
  let tags = [];
  groupedOptions?.forEach((option, index) => (
    option?.facets_annotation?.forEach( fa => { if ( !tags.find(t => t == fa )) tags.push(fa)})
  ));
  
  return (
    <Box sx={{
      py: '1rem',
      px: '0.75rem',
      borderBottom: `0.0625rem solid ${primaryBg}`,
    }}>
      <Typography variant="body2" sx={{
        letterSpacing: '-0.005em',
        fontWeight: 500,
        color: searchHeadingColor
      }}>
        Narrow your search
      </Typography>

      <Box
        mt={1}
        columnGap={1}
        display='flex'
        sx={{
          alignItems: {
            xs: 'flex-start',
            lg: 'center'
          }
        }}
      >
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          columnGap: 1,
          flexWrap: 'wrap',
          rowGap: 0.5
        }}>
          {tags?.map((tag, index) => (
            <Chip
              className="secondary"
              key={tag + index}
              sx={{
                lineHeight: '140%',
                fontSize: '0.625rem',
                backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors['Default'].color
              }}
              label= {tag}
              onDelete={() => null}
              deleteIcon={<CloseIcon />}
            />
          ))
          }

        </Box>

        <Button
          disableRipple
          variant="text"
          sx={{
            flexShrink: 0,
            padding: 0,
            fontSize: '0.75rem',
            lineHeight: '133%',
            height: {
              xs: '1.5rem',
              lg: 'auto'
            },
            color: outlinedBtnTextColor,

            '&:hover': {
              background: 'transparent'
            }
          }}
        >
          More filters
        </Button>
      </Box>
    </Box>
  )
}