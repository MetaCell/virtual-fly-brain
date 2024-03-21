import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import {useSelector} from 'react-redux'
import { Compare, LinkIcon } from "../../icons";
import vars from "../../theme/variables";
import TerminfoSlider from "./TerminfoSlider";
import FullScreenViewer from "../queryBuilder/FullScreenViewer";
import { getUpdatedTags } from "../../utils/utils";

const {
  whiteColor,
  secondaryBg,
  carouselBg,
  headerBorderColor,
  tabActiveColor,
  descriptionBg
} = vars;

const colors_config = require("../../components/configuration/VFBColors").facets_annotations_colors;
const facets_annotations_colors = getUpdatedTags(colors_config)

const GeneralInformation = ({data, classes}) => {
  const [ toggleReadMore, setToggleReadMore ] = useState( false );
  const [fullScreen, setFullScreen] = useState(false)
  const MAX_LENGTH = 120;
  return (
    <>
      <Grid container columnSpacing={1.5}>
        <Grid item xs={12} sm={4} md={5} lg={5}>
          <Box
            sx={{
              width: '100%',
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
          <Box display='flex' flexDirection='column' sx={{rowGap: {xs: 1.25, sm: 1, lg: 1.25}}}>
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
                <Box display='flex' gap={'0.188rem'}>
                  {
                    data?.metadata?.Tags?.map((tag, i) => ( <Chip key={tag} sx={{backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color, color: facets_annotations_colors[tag]?.textColor || facets_annotations_colors?.default?.textColor}} label={tag} /> ) )
                  }
                { data?.metadata?.Tags?.length > 2 && <Chip label={`+${data?.metadata?.Tags?.length - 2}`} /> }
              </Box>
            </Box>

            <Box display='flex' justifyContent='space-between' columnGap={1}>
              <Typography sx={classes.heading}>Classification</Typography>
              <Typography sx={{
                ...classes.heading,
                color: whiteColor,
                textAlign: 'right'
              }}>{ data?.metadata?.Classification }</Typography>
            </Box>

            <Box display='flex' justifyContent='space-between' columnGap={1}>
              <Typography sx={classes.heading}>Description</Typography>
              <Box display='flex' flexDirection='column' alignItems='flex-end'>
                <Typography sx={{
                  ...classes.heading,
                  color: whiteColor,
                  borderRadius: toggleReadMore ? 1 : 0,
                  textAlign: 'right',
                  maxHeight: '3.375rem',
                  overflow: 'auto',
                  padding: toggleReadMore ? '0.25rem 0.5rem' : 0,
                  background: {
                    xs: toggleReadMore ? descriptionBg : 'transparent',
                    xl: toggleReadMore ? secondaryBg : 'transparent',
                  }
                }}>
                    {toggleReadMore ? data?.metadata?.Meta?.Description : `${data?.metadata?.Meta?.Description?.substr(0, MAX_LENGTH)}...`}
                </Typography>
                <Button
                    onClick={() => setToggleReadMore((prev) => !prev)} disableRipple
                  sx={{
                    padding: 0,
                    marginTop: '0.25rem',
                    height: 'auto',
                    color: tabActiveColor
                  }}>
                  {toggleReadMore ? 'Show Less' : 'Read More'}
                </Button>
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
        <FullScreenViewer open={ fullScreen } onClose={ () => setFullScreen( false ) } images={data?.metadata?.Images ? data?.metadata?.Images : data?.metadata?.Examples}>
          <Button sx={ { position: 'absolute', zIndex: 9, gap: '0.25rem', right: '1.75rem', top: '1.75rem' } } variant="contained" color="info">
            <Compare />
            Compare images with current
          </Button>
        </FullScreenViewer>
      )}
    </>
  )
};

export default GeneralInformation;