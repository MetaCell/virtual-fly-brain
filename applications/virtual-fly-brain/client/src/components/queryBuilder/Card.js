import React from "react";
import { Box, Button, Card, CardContent, CardMedia, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import vars from "../../theme/variables";
import { useState } from "react";
import FullScreenViewer from "./FullScreenViewer";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Compare } from "../../icons";

const {
  listHeadingColor,
  whiteColor,
  tabActiveColor,
  primaryBg,
  secondaryBg,
  outlinedBtnBorderColor,
  outlinedBtnTextColor
} = vars;

const facets_annotations_colors = require("../configuration/VFBColors").facets_annotations_colors;

const QueryCard = ({ fullWidth, facets_annotation, query }) => {
  const [toggleReadMore, setToggleReadMore] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const MAX_LENGTH = 40;
  const classes = {
    heading: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: '1rem',
      color: listHeadingColor,
    },

    ellipsis: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    },

    slider: {
      '& .images-wrap': {
        '& img': {
          maxHeight: '30.375rem',
          borderRadius: '0.5rem',
          display: 'block',
        }
      },
      '& .react-slideshow-container .nav:first-of-type': {
        transform: 'translateX(-50%)',
        left: '50%',
        bottom: '0.5rem',
        marginLeft: '-1.25rem',
        display: 'flex',
      },
      '& .react-slideshow-container .nav:last-of-type': {
        transform: 'translateX(-50%) rotate(180deg)',
        bottom: '0.5rem',
        left: '50%',
        right: 'auto',
        marginLeft: '1.25rem',
        display: 'flex',
      },
      '& .react-slideshow-container + ul.indicators': {
        margin: 0,
        position: 'absolute',
        bottom: '1.6875rem',
        left: 0,
        width: 'auto',
        right: 0,
        padding: 0,

        '& .each-slideshow-indicator': {
          background: outlinedBtnBorderColor,
          width: '0.375rem',
          height: '0.375rem',
          borderRadius: '50%',
          padding: 0,

          '&.active': {
            background: outlinedBtnTextColor
          },

          '&:before': {
            display: 'none'
          }
        },

        '& li': {
          display: 'flex',
          padding: 0,
          width: 'auto',
          height: 'auto'
        }
      }
    }
  }
  return (
    <>
      <Card sx={{
        height: '19.875rem',
        display: 'flex',
        flexDirection: 'column',
        background: secondaryBg,
        transition: 'all ease-in-out .3s',

        '&:hover': {
          background: primaryBg,

          '& .default-chip': {
            backgroundColor: outlinedBtnBorderColor,
          }
        }
      }}>
        <CardMedia
          sx={{
            height: '100%',
          }}
          image={query.thumbnail}
        >
          <IconButton onClick={(e) => {
            e.stopPropagation();
            setShowFullScreen(true)
          }}>
            <FullscreenIcon sx={{fill: '#fff !important', fontSize: '1.0625rem', m: '0 !important'}} />
          </IconButton>
        </CardMedia>

        <CardContent>
          <Tooltip placement="right"
            arrow title={query.label}>
            <Typography sx={{
              ...classes.ellipsis,
              fontSize: '1rem',
              color: whiteColor,
              fontWeight: 400,
              lineHeight: '1.25rem',
            }}>
              {query.label}
            </Typography>
          </Tooltip>

          <Box
            mt={1.5}
            display='flex'
            flexDirection='column'
            rowGap={1}
          >
            { query?.description && <Box
              display='flex'
              justifyContent='space-between'
              columnGap={1}
            >
              <Typography sx={classes.heading}>
                {query.description}
              </Typography>
              <Box display='flex' flexDirection='column' alignItems='flex-end'>
                <Typography sx={{
                  ...classes.heading,
                  color: whiteColor,
                  textAlign: 'right'
                }}>
                  {toggleReadMore ? "" : `${""?.substr(0, MAX_LENGTH)}...`}
                </Typography>
                <Button
                  onClick={() => setToggleReadMore((prev) => !prev)} disableRipple
                  sx={{
                    fontSize: '0.75rem',
                    padding: 0,
                    marginTop: '0',
                    height: 'auto',
                    color: tabActiveColor,
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}>
                  {toggleReadMore ? 'Show Less' : 'Read More'}
                </Button>
              </Box>

            </Box> }

            { query?.type && <Box
              display='flex'
              justifyContent='space-between'
              columnGap={1}
            >
              <Typography sx={classes.heading}>
                Type
              </Typography>

              <Tooltip
                placement="right"
                arrow
                title={`P{GMR80G01-GAL4} expression pattern; anatomical entity`}
              >
                <Typography sx={{
                  ...classes.ellipsis,
                  ...classes.heading,
                  color: whiteColor,
                  textAlign: 'right'
                }}>
                   {query.type}
                </Typography>
              </Tooltip>
            </Box> }

            { query?.imaging_tecnique && <Box
              display='flex'
              justifyContent='space-between'
              columnGap={1}
            >
              <Typography sx={classes.heading}>
                {query.imaging_tecnique}
              </Typography>

              <Tooltip
                placement="right"
                arrow
                title='Confocal'
              >
                <Typography sx={{
                  ...classes.ellipsis,
                  ...classes.heading,
                  color: whiteColor,
                  textAlign: 'right'
                }}>
                  {query.confocal}
                </Typography>
              </Tooltip>
            </Box> }

            { query?.template_space && <Box
              display='flex'
              justifyContent='space-between'
              columnGap={1}
            >
              <Typography sx={classes.heading}>
               {query.template_space}
              </Typography>

              <Tooltip
                placement="right"
                arrow
                title={query.template}
              >
                <Chip className="default-chip" sx={{ backgroundColor: primaryBg, gap: 0.5 }} onClick={() => console.log('Clicked!')} icon={<LinkIcon sx={{fill: '#fff !important', fontSize: '1.0625rem', m: '0 !important'}} />} label={query.template} />
              </Tooltip>
            </Box> }




            {facets_annotation?.length > 0 && <Box
              display='flex'
              justifyContent='flex-end'
              columnGap={1}
            >
              <Box display='flex' gap={0.5} flexWrap='wrap'>
                {facets_annotation?.slice(0, fullWidth ? 3 : 4)?.map((tag, index) => (
                  <Chip
                  key={tag + index}
                  sx={{
                    lineHeight: '140%',
                    fontSize: '0.625rem',
                    backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color
                  }}
                  label={tag} />
                ))}

                <Tooltip
                  arrow
                  title={
                    <Box display='flex' py={1} flexWrap='wrap' gap={0.5}>
                      {facets_annotation?.slice(fullWidth ? 3 : 4).map((tag, index) => (
                        <Chip
                          key={tag + index}
                          sx={{
                            lineHeight: '140%',
                            fontSize: '0.625rem',
                            backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color
                          }}
                          label={tag} />
                      ))}
                    </Box>
                  }
                >
                  <Chip
                    className="default-chip"
                    sx={{ background: primaryBg }}
                    label={`+${facets_annotation?.slice(fullWidth ? 3 : 4).length}`}
                  />
                </Tooltip>

              </Box>
            </Box> }
          </Box>
        </CardContent>
      </Card>

      {showFullScreen && (
        <FullScreenViewer sx={classes.slider} open={ showFullScreen } onClose={ () => setShowFullScreen( false ) } images={[{ url : query?.thumbnail }]}>
          <Button sx={ { position: 'absolute', zIndex: 9, gap: '0.25rem', right: '1.75rem', top: '1.75rem' } } variant="contained" color="info">
            <Compare />
            Compare images with current
          </Button>
        </FullScreenViewer>
      )}
    </>
  )
}

export default QueryCard;