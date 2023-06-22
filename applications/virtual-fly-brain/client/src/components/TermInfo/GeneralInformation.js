import { Box, Button, Chip, Grid, Link, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import {useSelector} from 'react-redux'
import { Link as LinkIcon } from "../../icons";
import vars from "../../theme/variables";
import TerminfoSlider from "./TerminfoSlider";

const {
  whiteColor,
  secondaryBg,
  carouselBg,
  headerBorderColor,
  tabActiveColor,
  descriptionBg
} = vars;

function getImages(data) {
  const images = data?.Images
  if(!images) return;
  const firstKey = Object.keys(images)[0];
  return images[firstKey][0];
}

const GeneralInformation = ({data, classes}) => {
  const [toggleReadMore, setToggleReadMore] = useState(false);
  const MAX_LENGTH = 40;
  const license = data?.Licenses[0];
  let images = getImages(data);
  return (
    <Grid container columnSpacing={1.5}>
      <Grid item xs={12} sm={4} md={5} lg={5}>
        <Box
          sx={{
            width: '100%',
            height: '14.25rem',
            background: {
              xs: carouselBg,
              lg: headerBorderColor
            },
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}
        >
          <TerminfoSlider
            examples={data?.Images}
          />
        </Box>
      </Grid>
      <Grid sx={{
        mt: {
          xs: 2,
          sm: 0,
        }
      }} item xs={12} sm={8} md={7} lg={7}>
        <Box display='flex' flexDirection='column' rowGap={1}>
          <Box display='flex' justifyContent='space-between' columnGap={1}>
            <Typography sx={classes.heading}>Name</Typography>
            <Typography sx={{
              ...classes.heading,
              color: whiteColor,
              textAlign: 'right'
            }}>{data?.Name}[{data?.Id}]</Typography>
          </Box>

          <Box display='flex' justifyContent='space-between' columnGap={1}>
            <Typography sx={classes.heading}>Tags</Typography>
              <Box display='flex' gap={0.5}>
                {
                  data?.Tags?.map((tag) => <Chip key={tag} color="primary" label={tag} />)
                }
              { data?.Tags?.length > 2 && <Chip label={`+${data?.Tags?.length - 2}`} /> }
            </Box>
          </Box>

          <Box display='flex' justifyContent='space-between' columnGap={1}>
            <Typography sx={classes.heading}>Classification</Typography>
            <Typography sx={{
              ...classes.heading,
              color: whiteColor,
              textAlign: 'right'
            }}><Link href="#">{data?.Meta?.Types}</Link></Typography>
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
                  {toggleReadMore ? data?.Meta?.Description : `${data?.Meta?.Description?.substr(0, MAX_LENGTH)}...`}
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
            <Chip onClick={() => console.log('Clicked!')} icon={<LinkIcon />} label={license?.source}>{license?.iri}</Chip>
          </Box>

          <Box display='flex' justifyContent='space-between' columnGap={1}>
            <Typography sx={classes.heading}>License</Typography>
            <Typography sx={{
              ...classes.heading,
              color: whiteColor,
              textAlign: 'right'
            }}>
              <Link sx={{
                display: 'flex',
                gap: 1,
              }} href={license?.source_iri}>
                {license?.label}
                <img style={{maxHeight: '1.125rem'}} src={license?.icon} alt={license?.label} />
              </Link>
            </Typography>
          </Box>

          <Box display='flex' justifyContent='space-between' columnGap={1}>
            <Typography sx={classes.heading}>Aligned To</Typography>
            <Chip onClick={() => console.log('Clicked!')} icon={<LinkIcon />} label={data?.Name} />
          </Box>

          <Box display='flex' justifyContent='space-between' columnGap={1}>
            <Typography sx={classes.heading}>Downloads</Typography>
            <Box
              width='65%'
              display='flex'
              flexDirection='column'
              gap={0.5}
            >
              <Chip icon={<LinkIcon />} label={images?.nrrd} />
              <Chip icon={<LinkIcon />} label={images?.obj} />
              <Chip icon={<LinkIcon />} label={images?.wlz} />
            </Box>
          </Box>

        </Box>
      </Grid>
    </Grid>
  )
};

export default GeneralInformation;