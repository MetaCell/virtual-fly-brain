import { Box, Button, Chip, Grid, Typography, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { LinkIcon } from "../../icons";
import vars from "../../theme/variables";
import TerminfoSlider from "./TerminfoSlider";
import FullScreenViewer from "../queryBuilder/FullScreenViewer";
import { getUpdatedTags } from "../../utils/utils";
import { facets_annotations_colors as colors_config } from "../../components/configuration/VFBColors";

const {
  whiteColor,
  secondaryBg,
  carouselBg,
  headerBorderColor,
  tabActiveColor,
  descriptionBg,
  searchBoxBg
} = vars;

const chips_cutoff = 2;

const facets_annotations_colors = getUpdatedTags(colors_config)

const GeneralInformation = ({ data, classes }) => {
  const [toggleReadMore, setToggleReadMore] = useState(false);
  const [fullScreen, setFullScreen] = useState(false)
  const MAX_LENGTH = 80;

  const renderTooltipChips = (data) => {
    return <>
      {
        data?.metadata?.Tags?.slice(chips_cutoff)
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
    <>
      <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={4} md={5} lg={5}>
          <Box
            sx={{
              width: '15rem',
              height: {
                xs: '15.188rem',
                lg: '14.25rem'
              },
              background: {
                xs: carouselBg,
                lg: headerBorderColor
              },
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}
          >
            <TerminfoSlider
              allowFullscreen
              setFullScreen={setFullScreen}
              examples={data?.metadata?.Images ? data?.metadata?.Images : data?.metadata?.Examples}
            />
          </Box>
        </Grid>
        <Grid sx={{
          mt: {
            xs: 2,
            sm: 0,
          }
        }} item xs={12} sm={8} md={7} lg={7}>
          <Box display='flex' flexDirection='column' sx={{ rowGap: { xs: 1.25, sm: 1, lg: 1.25 }, width: '15rem' }}>
            <Box display='flex' justifyContent='space-between' columnGap='0.188rem'>
              <Typography sx={classes.heading}>Name</Typography>
              <Typography sx={{
                ...classes.heading,
                color: whiteColor,
                textAlign: 'right'
              }}>{data?.metadata?.Name}[{data?.metadata?.Id}]</Typography>
            </Box>

            <Box display='flex' justifyContent='space-between' columnGap={1}>
              <Typography sx={classes.heading}>Tags</Typography>
              <Box sx={{ display: 'flex', columnGap: '4px', flexWrap: 'wrap', justifyContent: 'end' }} gap={'0.288rem'}>
                {
                  data?.metadata?.Tags?.slice(0, chips_cutoff).map((tag, i) => (<Chip key={tag} sx={{ backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color, color: facets_annotations_colors[tag]?.textColor || facets_annotations_colors?.default?.textColor }} label={tag} />))
                }
                {
                  data?.metadata?.Tags?.length > 3 && <Tooltip
                    title={renderTooltipChips(data)}
                    placement="bottom-end"
                    arrow
                  >
                    <Chip
                      sx={{
                        lineHeight: '140%',
                        fontSize: '0.625rem',
                        backgroundColor: searchBoxBg
                      }}
                      label={`+${data?.metadata?.Tags?.length - chips_cutoff}`}
                    />
                  </Tooltip>
                }
              </Box>
            </Box>

            <Box display='flex' justifyContent='space-between' columnGap={1}>
              <Typography sx={classes.heading}>Classification</Typography>
              <Typography sx={{
                ...classes.heading,
                color: whiteColor,
                textAlign: 'right'
              }}>{data?.metadata?.Classification}</Typography>
            </Box>

            <Box display='flex' justifyContent='space-between' columnGap={1}>
              <Typography sx={classes.heading}>Description</Typography>
              <Box display='flex' flexDirection='column' alignItems='flex-end'>
                <Typography sx={{
                  ...classes.heading,
                  color: whiteColor,
                  borderRadius: toggleReadMore ? 1 : 0,
                  textAlign: 'right',
                  padding: toggleReadMore ? '0.25rem 0.5rem' : "0.10rem 0.12rem",
                  background: {
                    xs: toggleReadMore ? descriptionBg : 'transparent',
                    xl: toggleReadMore ? secondaryBg : 'transparent',
                  }
                }}
                className='scrollbar'>
                  {toggleReadMore ? data?.metadata?.Meta?.Description : (data?.metadata?.Meta?.Description.length > MAX_LENGTH ? `${data?.metadata?.Meta?.Description?.substr(0, MAX_LENGTH)}...` : data?.metadata?.Meta?.Description)}
                </Typography>
                { data?.metadata?.Meta?.Description.length > 0 && data?.metadata?.Meta?.Description.length > MAX_LENGTH
                ? <Button
                  onClick={() => setToggleReadMore((prev) => !prev)} disableRipple
                  sx={{
                    padding: 0,
                    marginTop: '0.25rem',
                    height: 'auto',
                    color: tabActiveColor,
                    '&:hover': {
                      background: 'transparent'
                    }
                  }}>
                  {toggleReadMore ? 'Show Less' : 'Read More'}
                </Button>
                : <></> }
              </Box>
            </Box>

            <Box display='flex' justifyContent='space-between' columnGap={1}>
              <Typography sx={classes.heading}>Source</Typography>
              <Chip icon={<LinkIcon />} label='JRC2018Unisex' />
            </Box>

            <Box display='flex' justifyContent='space-between' columnGap={1}>
              <Typography sx={classes.heading}>License</Typography>
              <Typography sx={{
                ...classes.heading,
                color: whiteColor,
                textAlign: 'right'
              }}>{data?.metadata?.Licenses?.[0]?.label}</Typography>
            </Box>

            <Box display='flex' justifyContent='space-between' columnGap={1}>
              <Typography sx={classes.heading}>Aligned To</Typography>
              <Chip icon={<LinkIcon />} label='JRC2018Unisex' />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {fullScreen && (
        <FullScreenViewer open={fullScreen} onClose={() => setFullScreen(false)} images={data?.metadata?.Images ? data?.metadata?.Images : data?.metadata?.Examples} />
      )}
    </>
  )
};

export default GeneralInformation;
