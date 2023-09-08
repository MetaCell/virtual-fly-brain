import React from "react";
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { FullScreen, Link as LinkIcon } from "../../icons";
import vars from "../../theme/variables";
import { useState } from "react";
import FullScreenViewer from "./FullScreenViewer";
import QUERY from '../../assets/query.png';
import QUERY_LARGE from "../../assets/query-large.png";

const {
  listHeadingColor,
  whiteColor,
  tabActiveColor,
  chipGreen,
  chipOrange,
  primaryBg,
  chipYellow,
  secondaryBg,
  outlinedBtnBorderColor
} = vars;

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
  },
  {
    id: 2,
    label: 'Nervous system',
    color: chipYellow
  },
  {
    id: 3,
    label: 'Anatomy',
    color: chipGreen
  },
  {
    id: 4,
    label: 'Neuron',
    color: chipOrange
  }
];

const QueryCard = ({ fullWidth }) => {
  const [toggleReadMore, setToggleReadMore] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const MAX_LENGTH = 40;
  const DUMMY_STRING = "A doughnut shaped synaptic neuropil domain of the central complex of the adult brain that lies just anterior to the fan-shaped body."
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
          image={QUERY}
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
            arrow title="JRC_R80G01_GAL4_Brain_20100223">
            <Typography sx={{
              ...classes.ellipsis,
              fontSize: '1rem',
              color: whiteColor,
              fontWeight: 400,
              lineHeight: '1.25rem',
            }}>
              JRC_R80G01_GAL4_Brain_20100223
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
                Description
              </Typography>
              <Box display='flex' flexDirection='column' alignItems='flex-end'>
                <Typography sx={{
                  ...classes.heading,
                  color: whiteColor,
                  textAlign: 'right'
                }}>
                  {toggleReadMore ? DUMMY_STRING : `${DUMMY_STRING?.substr(0, MAX_LENGTH)}...`}
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
                  {`P{GMR80G01-GAL4} expression pattern; anatomical entity`}
                </Typography>
              </Tooltip>
            </Box>

            <Box
              display='flex'
              justifyContent='space-between'
              columnGap={1}
            >
              <Typography sx={classes.heading}>
                Imaging_Tecnique
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
                  Confocal
                </Typography>
              </Tooltip>
            </Box>

            <Box
              display='flex'
              justifyContent='space-between'
              columnGap={1}
            >
              <Typography sx={classes.heading}>
                Template_Space
              </Typography>



              <Tooltip
                placement="right"
                arrow
                title="JRC2018U"
              >
                <Chip className="default-chip" sx={{ backgroundColor: primaryBg }} onClick={() => console.log('Clicked!')} icon={<LinkIcon />} label="JRC2018U" />
              </Tooltip>
            </Box>




            <Box
              display='flex'
              justifyContent='flex-end'
              columnGap={1}
            >
              <Box display='flex' gap={0.5}>
                {chipsArr?.slice(0, fullWidth ? 2 : 3).map(item => (
                  <Chip key={item.id} sx={{ background: item.color }} label={item.label} />
                ))}

                <Tooltip
                  arrow
                  title={
                    <Box display='flex' gap={0.5}>
                      {chipsArr?.slice(fullWidth ? 2 : 3).map(item => (
                        <Chip key={item.id} sx={{ background: item.color }} label={item.label} />
                      ))}
                    </Box>
                  }
                >
                  <Chip
                    className="default-chip"
                    sx={{ background: primaryBg }}
                    label={`+${chipsArr?.slice(fullWidth ? 2 : 3).length}`}
                  />
                </Tooltip>

              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {showFullScreen && (
        <FullScreenViewer open={ showFullScreen } onClose={ () => setShowFullScreen( false ) }>
          <img style={{width: '100%', display: 'block'}} src={QUERY_LARGE} alt="" />
        </FullScreenViewer>
      )}
    </>
  )
}

export default QueryCard;