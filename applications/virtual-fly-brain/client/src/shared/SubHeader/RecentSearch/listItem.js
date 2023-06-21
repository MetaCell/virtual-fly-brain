import React, { useRef } from "react"
import { Box, Button, Chip, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Popper, Tooltip, Typography } from "@mui/material"
import { AddChart, Delete, More, OpenInNew, Search, SplitScreen } from "../../../icons";
import vars from "../../../theme/variables";

const {
  secondaryBg,
  searchBoxBg,
  searchHeadingColor } = vars;

export const Item = ({
  chipColors,
  search,
  index,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? `simple-popper-${index}` : undefined;
  return (
    <Box sx={{
      p: 0.5,
      borderRadius: 1,
      display: 'flex',
      alignItems: 'center',

      '&:hover': {
        backgroundColor: secondaryBg
      }
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: 1,
        flexShrink: 0,
        background: searchBoxBg,
      }}>
        <SplitScreen size={12} />
      </Box>

      <Typography variant="body2" sx={{
        fontSize: '0.75rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: searchHeadingColor,
        px: 1
      }}>
        {search?.title}
      </Typography>

      <Box sx={{
        ml: 'auto',
        display: 'flex',
        alignItems: 'center',
        columnGap: 0.5
      }}>
        {search?.tags?.slice(0, 2)?.map((tag, index) => <Chip key={`search-tag-${index}`} sx={{
          lineHeight: '140%',
          fontSize: '0.625rem', backgroundColor: chipColors[tag.id]
        }} label={tag.label} />)}
        {search?.tags.length > 2 ? (
          <Tooltip
            placement="bottom-end"
            arrow
            title={
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 0.5
              }}>
                {search?.tags?.slice(2)?.map((tag, index) => <Chip key={`remaining-tag-${index}`} sx={{
                  lineHeight: '140%',
                  fontSize: '0.625rem', backgroundColor: chipColors[tag.id]
                }} label={tag.label} />)}
              </Box>
            }
          >
            <Chip sx={{
              lineHeight: '140%',
              fontSize: '0.625rem',
              backgroundColor: searchBoxBg
            }} label={`+${search?.tags?.slice(2).length}`} />
          </Tooltip>) : null
        }
        <IconButton
          sx={{
            width: '1.25rem',
            height: '1.25rem',
            padding: 0
          }}
          size="small"
          onClick={handleClick}
          aria-describedby={id}
        >
          <More />
        </IconButton>
        <Popper
          className="menu-popover"
          id={id}
          placement="bottom-end"
          open={open}
          anchorEl={anchorEl}
        >
          <List>
            <ListItem>
              <ListItemButton onClick={handleClick}>
                <ListItemIcon sx={{
                  minWidth: '1px',
                  padding: '0 0.375rem 0 0'
                }}>
                  <AddChart />
                </ListItemIcon>
                <ListItemText primary="Load results" />
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton onClick={handleClick}>
                <ListItemIcon sx={{
                  minWidth: '1px',
                  padding: '0 0.375rem 0 0'
                }}>
                  <OpenInNew />
                </ListItemIcon>
                <ListItemText primary="Go to query" />
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton onClick={handleClick}>
                <ListItemIcon sx={{
                  minWidth: '1px',
                  padding: '0 0.375rem 0 0'
                }}>
                  <Delete size={12} />
                </ListItemIcon>
                <ListItemText primary="Remove from history" />
              </ListItemButton>
            </ListItem>
          </List>
        </Popper>
      </Box>
    </Box>
  )
}