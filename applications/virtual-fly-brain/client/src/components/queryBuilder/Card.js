import React from "react";
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { FullScreen, Cross, Link as LinkIcon } from "../../icons";
import vars from "../../theme/variables";
import { useState } from "react";
import FullScreenViewer from "./FullScreenViewer";

const {
  listHeadingColor,
  whiteColor,
  tabActiveColor,
  chipGreen,
  chipOrange,
  chipRed,
  chipPink,
  primaryBg,
  chipYellow,
  secondaryBg,
  outlinedBtnBorderColor
} = vars;

const chipColors = [chipRed, chipGreen, chipOrange, chipPink, chipYellow];

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
            <FullScreen />
          </IconButton>
        </CardMedia>
        {/* <CardActionArea sx={{ flexGrow: 1 }}>

        </CardActionArea> */}

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
            <Box
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

            </Box>

            <Box
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
            </Box>

            <Box
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
            </Box>

            <Box
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
                title="JRC2018U"
              >
                <Chip className="default-chip" sx={{ backgroundColor: primaryBg }} onClick={() => console.log('Clicked!')} icon={<LinkIcon />} label={query.template} />
              </Tooltip>
            </Box>




            <Box
              display='flex'
              justifyContent='flex-end'
              columnGap={1}
            >
              <Box display='flex' gap={0.5}>
                {facets_annotation?.map((tag, index) => (
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

                <Tooltip
                  arrow
                  title={
                    <Box display='flex' gap={0.5}>
                      {facets_annotation?.map((tag, index) => (
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
                    label={`+${facets_annotation?.slice(fullWidth ? 2 : 3).length}`}
                  />
                </Tooltip>

              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {showFullScreen && (
        <FullScreenViewer open={showFullScreen} onClose={() => setShowFullScreen(false)} />
      )}
    </>
  )
}

export default QueryCard;