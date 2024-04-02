import React, { useRef } from "react"
import { Box, Button, Chip, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Popper, Tooltip, Typography } from "@mui/material"
import { AddChart, Delete, More, OpenInNew, Search, SplitScreen } from "../../icons";
import vars from "../../theme/variables";
import { useDispatch, useSelector } from "react-redux";
import { selectInstance, getInstanceByID,focusInstance  } from "../../reducers/actions/instances";
import { getQueries, updateQueries } from "../../reducers/actions/queries"
import { removeRecentSearch, setQueryComponentOpened } from "../../reducers/actions/globals";

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
  const dispatch = useDispatch();
  const queries = useSelector(state => state.queries.queries);
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances);
  
  const handleClick = (event, isQuery, id) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    if(isQuery){
      let updatedQueries = [...queries];
      let matchQuery = updatedQueries?.find( q => q.Id === id );
      updatedQueries?.forEach( q => q.active = false )
      if ( matchQuery ) {
        matchQuery.active = true;
        updateQueries(updatedQueries);
      } else {
        getQueries(id, "get_instances")
      }
      dispatch(setQueryComponentOpened(true));
    } else if ( !isQuery && id ) {
      let matchInstance = allLoadedInstances?.find( q => q.metadata?.Id === id );
      if (matchInstance ) {
        focusInstance(id)
        selectInstance(id)
      } else {
        getInstanceByID(id, true)
      }
    }
  };

  const removeFromHistory = (event, id, isQuery) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    dispatch(removeRecentSearch(id, isQuery))
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
        { search?.is_query ? <SplitScreen size={12} /> : <Search size={12}/> }
      </Box>

      <Typography variant="body2" sx={{
        fontSize: '0.75rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: searchHeadingColor,
        px: 1
      }}>
        {search?.label}
      </Typography>

      <Box sx={{
        ml: 'auto',
        display: 'flex',
        alignItems: 'center',
        columnGap: 0.5
      }}>
        {search?.facets_annotation?.slice(0, 2)?.map((tag, index) => <Chip key={`search-tag-${index}`} sx={{
          lineHeight: '140%',
          fontSize: '0.625rem', 
          backgroundColor: chipColors[tag]?.color,
          color: chipColors[tag]?.textColor,
        }} label={tag} />)}
        {search?.facets_annotation?.length > 2 ? (
          <Tooltip
            placement="bottom-end"
            componentsProps={{ tooltip: { sx: { overflow : "auto" } } }} 
            arrow
            title={
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 0.5
              }}>
                {search?.facets_annotation?.slice(2)?.map((tag, index) => <Chip key={`remaining-tag-${index}`} sx={{
                  lineHeight: '140%',
                  fontSize: '0.625rem', backgroundColor: chipColors[tag]?.color
                }} label={tag} />)}
              </Box>
            }
          >
            <Chip sx={{
              lineHeight: '140%',
              fontSize: '0.625rem',
              backgroundColor: searchBoxBg
            }} label={`+${search?.facets_annotation?.slice(2).length}`} />
          </Tooltip>) : null
        }
        <IconButton
          sx={{
            width: '1.25rem',
            height: '1.25rem',
            padding: 0
          }}
          size="small"
          onClick={(event) => handleClick(event)}
          aria-describedby={id}
        >
          <More />
        </IconButton>
        <Popper
          sx={{
            zIndex: 99999
          }}
          className="menu-popover"
          id={id}
          placement="bottom-end"
          open={open}
          anchorEl={anchorEl}
        >
          <List>
            { !search?.is_query ? 
            <ListItem>
              <ListItemButton onClick={(event) => handleClick(event, false, search?.short_form)}>
                <ListItemIcon sx={{
                  minWidth: '0.0625rem',
                  padding: '0 0.375rem 0 0'
                }}>
                  { search?.is_query ? <AddChart /> : <Search/> }
                </ListItemIcon>
                <ListItemText primary="Load results" />
              </ListItemButton>
            </ListItem>
            :
            null
            }
            { search?.is_query ? 
            <ListItem>
              <ListItemButton onClick={(event) => handleClick(event, true, search?.short_form)}>
                <ListItemIcon sx={{
                  minWidth: '0.0625rem',
                  padding: '0 0.375rem 0 0'
                }}>
                  <OpenInNew />
                </ListItemIcon>
                <ListItemText primary="Go to query" />
              </ListItemButton>
            </ListItem>
            :
            null }
            <ListItem>
              <ListItemButton onClick={(event) => removeFromHistory(event, search?.short_form,  search?.is_query )}>
                <ListItemIcon sx={{
                  minWidth: '0.0625rem',
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