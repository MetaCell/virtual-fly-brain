import React, { useState } from "react";
import { CheckBoxDefault, CheckBoxGreen, CheckBoxRed, CleaningServices, FilterIcon, Tick, Undo } from "../../icons";
import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Popper, Typography } from "@mui/material";
import vars from "../../theme/variables";


const { primaryBg, outlinedBtnTextColor, bottomNavBg, tabActiveColor, whiteColor, searchHeadingColor } = vars;

const Filter = () => {
  const [filterAnchorEl, setFilterAnchorEl] = React.useState(null);
  const [filtersApplied, setFiltersApplied] = useState(false)

  const filterhandleClick = (event) => {
    setFilterAnchorEl(filterAnchorEl ? null : event.currentTarget);
  };

  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'simple-popper' : undefined;
  return (
    <>
      <Button
        aria-describedby={filterId}
        onClick={filterhandleClick}
        sx={{
          flexShrink: 0,
          color: filtersApplied ? tabActiveColor : searchHeadingColor,
          height: 'auto',
          minWidth: '0.065rem',
          padding: '0',
          fontSize: '0.6875rem',
          fontWeight: 500,
          backgroundColor: 'transparent',
          lineHeight: '0.9375rem',
          letterSpacing: '-0.00344rem',
          gap: '0.25rem',

          '&:hover': {
            background: 'transparent'
          }
        }}
      >
        Other filters
        <FilterIcon opacity={1} color="currentColor" size={12} />
      </Button>

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
            <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxGreen />} icon={<CheckBoxDefault />} />} label="Adult" />
            <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxRed />} icon={<CheckBoxDefault />} />} label="Larva" />
            <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxGreen />} icon={<CheckBoxDefault />} />} label="Nervous System" />
            <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxRed />} icon={<CheckBoxDefault />} />} label="Anatomy" />
            <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxGreen />} icon={<CheckBoxDefault />} />} label="Neuron" />
            <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxRed />} icon={<CheckBoxDefault />} />} label="Image" />
            <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxGreen />} icon={<CheckBoxDefault />} />} label="Split Expression" />
            <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxRed />} icon={<CheckBoxDefault />} />} label="Expression Pattern" />
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
            onClick={filterhandleClick}
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
    </>
  )
};

export default Filter