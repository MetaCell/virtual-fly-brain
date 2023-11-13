import { Box, Typography, Button, FormControlLabel, IconButton, FormGroup, Checkbox, Popper } from "@mui/material";
import React from "react";
import MediaQuery from 'react-responsive'
import { CheckBoxDefault, CheckBoxGreen, CheckBoxRed, CleaningServices, Close, Filter, Tick, Undo } from "../../icons";
import vars from "../../theme/variables";

const { primaryBg, outlinedBtnTextColor, bottomNavBg, tabActiveColor, whiteColor } = vars;

export const FilterMenu  = ({ classes, tags, setSelectedFilters }) => {
  const [filterAnchorEl, setFilterAnchorEl] = React.useState(null);
  const [selection, setSelection] = React.useState({})

  const filterhandleClick = (event) => {
    setFilterAnchorEl(filterAnchorEl ? null : event.currentTarget);
    setSelectedFilters(selection)
  };

  const cleanAll = (event) => {
    let updatedSelection = {...selection};
    Object.keys(updatedSelection)?.forEach( id => updatedSelection[id] = false );
    setSelection(updatedSelection)
  };

  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'simple-popper' : undefined;

  const handleChange = (event) => {
    let updatedSelection = {...selection};
    updatedSelection[event.target.id] = event.target.checked;
    setSelection(updatedSelection)
  }

  React.useEffect( () => {
    let updatedSelection = {};
    tags?.forEach( tag => {
      updatedSelection[tag] = true;
    })
    setSelection(updatedSelection)
  }, [tags]);

  return (
    <Box
      flexShrink={0}
      display='flex'
      alignItems='center'
      columnGap='0.25rem'
    >
      <Button
        aria-describedby={filterId}
        onClick={filterhandleClick}
        sx={{
          ...classes.shortcut,
          flexShrink: 0,
          minWidth: '0.065rem',
          padding: '0 0.25rem',
          backgroundColor: 'transparent'
        }}
      >
        <Filter />
      </Button>

      <MediaQuery maxWidth={1199}>
        <Button
          sx={{
            ...classes.shortcut,
            flexShrink: 0,
            minWidth: '0.065rem',
            padding: '0 0.25rem',
            backgroundColor: 'transparent'
          }}
        >
          <Close />
        </Button>
      </MediaQuery>

      <MediaQuery minWidth={1200}>
        <Button
          sx={{
            ...classes.shortcut,
            flexShrink: 0,
            minWidth: '0.0625rem'
          }}
        >
          Esc
        </Button>
      </MediaQuery>


      <Popper
        className="filter-popover"
        placement="bottom-end"
        id={filterId}
        open={filterOpen}
        anchorEl={filterAnchorEl}
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          sx={{
            borderBottom: `0.0625rem solid ${primaryBg}`,
            padding: '0.75rem',
            height: '2.5rem',
          }}
        >
          <Typography
            sx={{
              color: outlinedBtnTextColor,
              fontSize: '0.75rem',
              lineHeight: '133%',
            }}
          >Filters</Typography>
          <IconButton size="small" onClick={filterhandleClick}>
            <Undo />
          </IconButton>
        </Box>
        <Box className='scrollbar' p={1.5} sx={{
          maxHeight: '11.5rem',
          overflow: 'auto'
        }}>
          <FormGroup sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 1.5
          }}>
            {tags?.map( tag => 
              <FormControlLabel key={tag} control={<Checkbox id={tag} checkedIcon={<CheckBoxGreen />} onChange={handleChange} icon={<CheckBoxDefault />} checked={selection[tag]} />} label={tag} />
            )}
          </FormGroup>
        </Box>
        <Box sx={{
          borderRadius: '0 0 0.25rem 0.25rem',
          background: bottomNavBg,
          borderTop: `0.0625rem solid ${primaryBg}`,
          backdropFilter: 'blur(0.25rem)',
          padding: '0.5rem 0.75rem',
          gap: '1rem',
          display: 'flex'
        }}>
          <Button
            onClick={cleanAll}
            variant="text"
            sx={{
              px: 0,
              width: '6.5rem',
              borderRadius: '0.25rem',
              height: '1.875rem',
              fontSize: '0.75rem',
            }}
          >
            <CleaningServices
              style={{
                margin: '0 0.25rem 0 0'
              }}
            />
            Clean all
          </Button>
          <Button
            onClick={filterhandleClick}
            variant="outlined"
            color="primary"
            sx={{
              px: 0,
              width: '6.5rem',
              borderRadius: '0.25rem',
              height: '1.875rem',
              fontSize: '0.75rem',
              borderColor: tabActiveColor,
              color: tabActiveColor,
              '&:hover': {
                borderColor: tabActiveColor,
                backgroundColor: tabActiveColor,
                color: whiteColor
              }
            }}
          >
            <Tick color='currentColor' style={{
              margin: '0 0.25rem 0 0'
            }} />
            Apply filters
          </Button>
        </Box>
      </Popper>
    </Box>
  )
}