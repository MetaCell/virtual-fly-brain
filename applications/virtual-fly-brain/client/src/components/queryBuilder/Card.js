import React from "react";
import { Box, Card, CardContent, CardMedia, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import vars from "../../theme/variables";
import { useState } from "react";
import FullScreenViewer from "./FullScreenViewer";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { getUpdatedTags } from "../../utils/utils";
import ReactMarkdown from 'react-markdown';
import { getInstanceByID } from "../../reducers/actions/instances";

const {
  listHeadingColor,
  whiteColor,
  tabActiveColor,
  primaryBg,
  secondaryBg,
  outlinedBtnBorderColor,
  outlinedBtnTextColor
} = vars;

const colors_config = require("../configuration/VFBColors").facets_annotations_colors;
const facets_annotations_colors = getUpdatedTags(colors_config)

const QueryCard = ({ fullWidth, facets_annotation, query }) => {
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

  const getThumbnail = (thumbnail) => {
    const matches = thumbnail.match(/\bhttps?::\/\/\S+/gi) || thumbnail.match(/\bhttps?:\/\/\S+/gi);

    return matches;
  }

  const handleLinkClick = (href, event) => {
    event.preventDefault();
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      const id = href.split(',').pop().trim();
      getInstanceByID(id, false, true, false);
    }
  };

  return (
    <>
      <Card sx={{
        height: '20rem',
        width: '20rem',
        display: 'flex',
        flexDirection: 'column',
        background: primaryBg,
          '&:hover': { background: secondaryBg },
        borderRadius: '8px', // Rounded corners
        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)', // Subtle shadow
        border: '1px solid',
        borderColor: secondaryBg,
        transition: 'box-shadow 0.2s',
        overflow: 'hidden',
        fontFamily: 'Inter, Arial, sans-serif',
        '&:hover': {
          boxShadow: '0 8px 24px 0 rgba(0,0,0,0.16)',
        }
      }}>
        <CardMedia
          sx={{
            height: '7.5rem',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            borderBottom: '1px solid',
            borderColor: secondaryBg,
            position: 'relative',
          }}
          image={getThumbnail(query.thumbnail)}
        >
          <IconButton onClick={(e) => {
            e.stopPropagation();
            setShowFullScreen(true)
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(255,255,255,0.7)',
            '&:hover': { background: 'rgba(255,255,255,0.9)' },
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)'
          }}>
            <FullscreenIcon sx={{fill: '#333', fontSize: '1.2rem'}} />
          </IconButton>
        </CardMedia>
        <CardContent sx={{overflowY: 'auto', flex: 1, padding: "8px", paddingBottom: "6px !important", paddingTop: "4px !important"}}>
          <Box
            display='flex'
            flexDirection='column'
            rowGap={0.10} // Tighter spacing
          >
            {facets_annotation?.length > 0 && <Box
              display='flex'
              justifyContent='flex-end'
              columnGap={0.5}
              mt={1}
            >
              <Box display='flex' gap={0.125} flexWrap='wrap'>
                {facets_annotation?.slice(0, fullWidth ? 3 : 4)?.map((tag, index) => (
                  <Chip
                  key={tag + index}
                  sx={{
                    lineHeight: '140%',
                    fontSize: '0.7rem',
                    backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color,
                    color: facets_annotations_colors[tag]?.textColor || facets_annotations_colors?.default?.textColor,
                    borderRadius: '8px',
                    fontWeight: 500
                  }}
                  label={tag} />
                ))}
                {facets_annotation.length > (fullWidth ? 3 : 4) && (
                  <Tooltip
                    arrow
                    title={
                      <Box display='flex' py={1} flexWrap='wrap' gap={0.5}>
                        {facets_annotation?.slice(fullWidth ? 3 : 4).map((tag, index) => (
                          <Chip
                            key={tag + index}
                            sx={{
                              lineHeight: '140%',
                              fontSize: '0.7rem',
                              backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color,
                              color: facets_annotations_colors[tag]?.textColor || facets_annotations_colors?.default?.textColor,
                              borderRadius: '8px',
                              fontWeight: 500
                            }}
                            label={tag} />
                        ))}
                      </Box>
                    }
                  >
                    <Chip
                      className="default-chip"
                      sx={{ background: '#F5F5F5', color: '#333', borderRadius: '8px', fontWeight: 500 }}
                      label={`+${facets_annotation?.slice(fullWidth ? 3 : 4).length}`}
                    />
                  </Tooltip>
                )}
              </Box>
            </Box> }
            {Object.entries(query).map(([key, value]) => {
              if (key === 'thumbnail' || key === 'tags' || value === "" || value === undefined || value === null || typeof value === 'object') return null;
              return (
                <Box key={key} display='flex' justifyContent='space-between' alignItems='center' sx={{mb: 0}}>
                  <Typography sx={{fontWeight: 500, fontSize: '0.875rem', color: listHeadingColor, textTransform: 'capitalize', flex: 1, lineHeight: 0, py: 0.25}}>{key}</Typography>
                  <Tooltip placement="right" arrow title={String(value)}>
                    <Box
                      sx={{
                        color: whiteColor,
                        textAlign: 'right',
                        lineHeight: 1.2,
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        pl: 1,
                        wordBreak: 'break-word',
                        py: 0.25,
                        maxWidth: '60%',
                        overflow: 'hidden',
                        '& p': {
                          margin: 0,
                          lineHeight: 1.2,
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        },
                        '& a': {
                          fontSize: '0.875rem',
                          color: 'inherit',
                          textDecoration: 'underline',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }
                      }}>
                      <ReactMarkdown
                        components={{
                          a: ({ href, children, ...props }) => (
                            <span
                              style={{
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: 'inline-block',
                                maxWidth: '100%'
                              }}
                              onClick={e => handleLinkClick(href, e)}
                              {...props}
                            >
                              {children}
                            </span>
                          ),
                          p: ({ children, ...props }) => (
                            <span {...props}>{children}</span>
                          )
                        }}
                      >
                        {String(value)}
                      </ReactMarkdown>
                    </Box>
                  </Tooltip>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
      {showFullScreen && (
        <FullScreenViewer open={ showFullScreen } onClose={ () => setShowFullScreen( false ) } images={ { [query.id] : [{ thumbnail : getThumbnail(query.thumbnail)[0], label : query.label }]} } />
      )}
    </>
  )
}

export default QueryCard;
