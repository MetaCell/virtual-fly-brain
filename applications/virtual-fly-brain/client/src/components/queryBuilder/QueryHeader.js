import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import { Add, ChevronDown, ImportExport } from "../../icons";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import vars from "../../theme/variables";
import { dividerStyle } from "./Query";


const { searchHeadingColor, whiteColor, secondaryBg, primaryBg } = vars

const QueryHeader = ({ title, filters, recentSearches, clearAll, setFilteredSearches }) => {
  const [sort, setSort] = React.useState('Name');
  const [crescent , setCrescent] = React.useState(1);

  const handleChange = (value) => {
    setSort(value);
    const identifier = filters[value];
    let updatedSearches = [...recentSearches.sort( (a,b) => (crescent * -1 )* a?.[identifier]?.localeCompare(b?.[identifier] ))];
    setFilteredSearches(updatedSearches)
    setCrescent(crescent * -1 );
  };

  const handleCrescentChange = () => {
    const identifier = filters[sort];
    let updatedSearches = [...recentSearches.sort( (a,b) => (crescent * -1 )* a?.[identifier]?.localeCompare(b?.[identifier] ))];
    setFilteredSearches(updatedSearches)
    setCrescent(crescent * -1 );
  };

  return (
    <Box
      position='sticky'
      top={0}
      display='flex'
      alignItems='center'
      zIndex={9999999}
      p={1.5}
      sx={{
        borderBottom: `0.0625rem solid ${secondaryBg}`,
        background: 'rgba(34, 34, 34, 0.20)',
        backdropFilter: 'blur(0.625rem)',
      }}
    >
      <Box flex={1}>
        <Typography sx={{
          color: whiteColor,
          fontSize: '0.875rem',
          fontWeight: 500,
          lineHeight: '1.25rem',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{
        flexShrink: 0,
        gap: '0.5rem',
        display: 'flex',
        alignItems: 'center'
      } }>
        <Button
          disableRipple
          onClick={() => handleCrescentChange()}
          variant="text"
          sx={{
            gap: '0.25rem',
            display: 'flex',
            minWidth: '0.0625rem',
            padding: 0,
            color: searchHeadingColor,
            fontSize: '0.6875rem',
            fontWeight: 500,
            height: '1.25rem',
            lineHeight: '0.9375rem',
            letterSpacing: '-0.00344rem',

            '&:hover': {
              background: 'transparent'
            }
          }}
        >
          Crescent
          <ImportExport />
        </Button>
        <Divider sx={dividerStyle} />
        <Box sx={{
          gap: '0.25rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Typography sx={{
            color: searchHeadingColor,
            fontSize: '0.6875rem',
            fontWeight: 500,
            lineHeight: '0.9375rem',
            letterSpacing: '-0.00344rem',
          }}>Order by:</Typography>
          <FormControl sx={{
            '& .MuiSelect-nativeInput': {
              height: '100%'
            },
            '&.MuiFormControl-root': {
              padding: '0.0625rem 0.25rem',
              borderRadius: '0.125rem',
              width: 'auto',
              background: primaryBg,
            },
            '& .MuiSelect-select': {
              padding: "0 !important",
              color: searchHeadingColor,
              fontSize: '0.6875rem',
              fontWeight: 500,
              lineHeight: '0.9375rem',
              letterSpacing: '-0.00344rem',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              display: 'none'
            }
          }} fullWidth>
            <Select
              IconComponent={ChevronDown}
              labelId="properties-select"
              id="properties-select"
              value={sort}
              onChange={(event) => handleChange(event.target.value)}
            >
              { Object.keys(filters || {}).map( (filter, index) => (<MenuItem key={index} value={filter}>{filter}</MenuItem> ))}
            </Select>
          </FormControl>
        </Box>
        {/* <Button
            disableRipple
            variant="text"
            sx={{
              minWidth: '0.0625rem',
              padding: 0,
              color: searchHeadingColor,
              fontSize: '0.6875rem',
              fontWeight: 500,
              height: '1.25rem',
              lineHeight: '0.9375rem',
              gap: '0.25rem',
              letterSpacing: '-0.00344rem',

              '&:hover': {
                background: 'transparent'
              }
            }}
        >
            <Add size={12} opacity={1} color={searchHeadingColor} />
            Add sorting
          </Button> */}
        <Divider sx={ dividerStyle } />
        <Button
            disableRipple
            variant="text"
            onClick={clearAll}
            sx={{
              minWidth: '0.0625rem',
              padding: 0,
              color: searchHeadingColor,
              fontSize: '0.6875rem',
              fontWeight: 500,
              height: '1.25rem',
              lineHeight: '0.9375rem',
              letterSpacing: '-0.00344rem',

              '&:hover': {
                background: 'transparent'
              }
            }}
          >
            Clear all
          </Button>
      </Box>
    </Box>
  )
}

export default QueryHeader;