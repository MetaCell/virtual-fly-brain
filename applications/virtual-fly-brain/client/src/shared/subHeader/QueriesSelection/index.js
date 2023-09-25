import { Box, Typography, Button, Popper, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { AngleRight, ChevronDown, CleaningServices, Delete } from "../../../icons";
import vars from "../../../theme/variables";

const queryBuilderDatasourceConfig = require('../../../components/configuration/VFBSearchBuilder/queryBuilderConfiguration').queryBuilderDatasourceConfig;

const { searchHeadingColor, searchBoxBg, primaryBg, whiteColor, queryBorderColor } = vars;

export const QueriesSelection = ({ checkResults, handleQueryDeletion, recentSearch }) => {
  const [searchQueries, setSearchQueries] = React.useState([]);
  const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);
  const [selectedOption, setSelectedOption] = React.useState({ count : 0});
  const [selectedQueryIndex, setSelectedQueryIndex] = React.useState("");
  React.useEffect(() => {
    setSearchQueries(recentSearch)
  }, [recentSearch])

  const deleteQuery = (event) => {
    let queries = searchQueries.filter( q => event.currentTarget.id !== q.label);
    setSearchQueries(queries);
    handleQueryDeletion(event.currentTarget.id);
    delete selectedOption[event.currentTarget.id];
    let updateSelection = selectedOption;
    setSelectedOption(updateSelection)
  }
  const popoverHandleClick = (event) => {
    setSelectedQueryIndex(event.target.parentElement.id || event.target.id)
    setPopoverAnchorEl(popoverAnchorEl ? null : event.target.parentElement.parentElement);
  };

  const handleSelect = (option, query) => {
    let count = 0;
    let options = Object.keys(selectedOption);
    if ( query.queries?.Examples && !selectedOption[query.short_form]) {
      count = Object.keys(query.queries?.Examples)?.length;
    }
    Object.keys(selectedOption)?.forEach( o => {
      if ( typeof selectedOption[o] === 'object' ) {
        count = count + ( selectedOption[o].count || 0 )
      } 
    })
    let updatedSelectedOption = {...selectedOption, [query.short_form]: option, count : count};
    updatedSelectedOption[query.short_form].count =  Object.keys(query.queries?.Examples)?.length || 0;
    setSelectedOption(updatedSelectedOption)
    setPopoverAnchorEl(null);
  };

  const popoverOpen = Boolean(popoverAnchorEl);
  const id = popoverOpen ? 'simple-popover' : undefined;
  return (
    <Box sx={{
      py: '1rem',
      px: '0.75rem',
      borderBottom: `0.0625rem solid ${primaryBg}`,
    }}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Typography variant="body2" sx={{
          fontSize: '0.75rem',
          lineHeight: '133%',
          letterSpacing: '-0.005em',
          fontWeight: 500,
          color: searchHeadingColor
        }}>
          Add other query IDs
        </Typography>

        <Button
          disableRipple
          sx={{
            height: 'auto',
            letterSpacing: 'normal',
            p: 0,
            fontSize: '0.75rem',
            lineHeight: '133%',

            '&:hover': {
              background: 'transparent'
            }
          }}
          variant="text"
          onClick={() => setSelectedOption({count : 0})}
        >
          <CleaningServices style={{ marginRight: '0.375rem' }} />
          Clear queries
        </Button>
      </Box>

      <Box
        my={1.5}
        display='flex'
        flexDirection='column'
        rowGap={2}
      >
        { searchQueries?.map((option, index) =>
        <Box
          display='flex'
          key={option.label}
          columnGap={1}
        >
          <Button
            sx={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.5rem',
              height: '1.5rem',
              p: 0,
              borderRadius: 1,
              background: searchBoxBg,
              minWidth: '0.0625rem',

              '&:hover': {
                background: searchBoxBg,
              }
            }}
            key={option.short_form}
            id={option.label}
            onClick={deleteQuery}
          >
            <Delete size={12} />
          </Button>

          <Box
            borderRadius={1}
            display='flex'
            sx={{
              width: 'calc(100% - 2rem)',
              background: searchBoxBg,
            }}
          >
            <Box
              width={1}
              flexGrow={1}
              display='flex'
            >
              
              {selectedOption[option.short_form] ? 
              (<Typography sx={{
                width: 'calc(100% - 1.875rem)',
                px: 1,
                alignSelf: 'center',
                flexGrow: 1,
                fontSize: '0.75rem',
                lineHeight: '133%',
                color: whiteColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                { selectedOption[option.short_form].label }
              </Typography>)
              :
              (<Typography sx={{
                width: 'calc(100% - 1.875rem)',
                px: 1,
                alignSelf: 'center',
                flexGrow: 1,
                fontSize: '0.75rem',
                lineHeight: '133%',
                color: whiteColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
               Select query for { option.label }
              </Typography>) }
              <Button
                aria-describedby={id}
                id={option.short_form}
                onClick={popoverHandleClick}
                sx={{
                  borderLeft: `0.0625rem solid ${queryBorderColor}`,
                  minWidth: '0.0625rem',
                  width: '1.875rem',
                  height: '100%',
                  p: 0,

                  '&:hover': {
                    background: 'transparent'
                  }
                }}
              >
                <ChevronDown />
              </Button>

              <Popper
                placement='bottom-start'
                id={id}
                open={popoverOpen}
                anchorEl={popoverAnchorEl}
              >

                <List>
                  { option.queries?.Queries?.map((query, index) => (selectedQueryIndex === option.short_form || selectedQueryIndex === "" )&& (<ListItem sx={{ top : '1.5rem' }} key={query.short_form+index}>
                    <ListItemButton onClick={() => handleSelect(query, option)}>
                      <ListItemText primary={query.label} />
                    </ListItemButton>
                  </ListItem>) )}
                </List>
              </Popper>
            </Box>
          </Box>
        </Box>
        )}
        <Box
        display='flex'
        justifyContent='flex-end'
      >
      <Button
          onClick={checkResults}
          disabled={!(selectedOption?.count > 1)}
          sx={{
            px: '0.5rem',
            py: '0.25rem',
            backgroundColor: primaryBg,
            borderRadius: 1,
            fontSize: '0.75rem',
            height: '1.5rem',

            '&:hover': {
              backgroundColor: primaryBg,
            }
          }}
        >
          Check { selectedOption.count } results
          <AngleRight style={{ marginLeft: '0.5rem' }} />
        </Button>
      </Box>
      </Box>
    </Box>
  )
}