import React from "react";
import { Box, Typography, Button, Popper, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { ChevronDown, Delete, ChevronUp } from "../../../icons";
import vars from "../../../theme/variables";

const { searchBoxBg, whiteColor, queryBorderColor } = vars;

export const QueriesSelectionDropdown = ({option, selectedOption, goBackToInitialState,  setSelectedOption, selectedQueryIndex, setSelectedQueryIndex, deleteQuery}) => {
  const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);

  const popoverHandleClick = (event) => {
    setSelectedQueryIndex(event.target.parentElement.id || event.target.id)
    setPopoverAnchorEl(popoverAnchorEl ? null : event.target.parentElement.parentElement);
  };

  const goBack = (short_form) => {
    goBackToInitialState(short_form);
    setPopoverAnchorEl(null);
  }

  const handleSelect = (option, query) => {
    let count = 0;
    if (query.queries?.Examples && !selectedOption[query.short_form]) {
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
  console.log("option label: ", option.label)

  return (
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
        border: popoverOpen ? "1px solid #0AB7FE" : "none"
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
                {popoverOpen ? <ChevronUp/> : <ChevronDown/>}
              </Button>

              <Popper
                placement='bottom-start'
                id={id}
                open={popoverOpen}
                anchorEl={popoverAnchorEl}
                disablePortal={true}
                sx={{
                  marginTop: "1px !important",
                  '&.MuiPopper-root': {
                    width: 'calc(100% - 3.5rem)'
                  }
                }}
              >
                <List>
                  {!option.queries.Queries.length && <ListItem>
                      <ListItemButton onClick={() => goBack(option.short_form )}>
                      { selectedQueryIndex === option.short_form || selectedQueryIndex === "" ?
                      <ListItemText primary={`Select query for ${option.label}`}/>
                      : null }
                      </ListItemButton>
                    </ListItem>
                  }
                  { option.queries?.Queries?.map((query, index) => (selectedQueryIndex === option.short_form || selectedQueryIndex === "" )&& (<ListItem key={query.short_form+index}>
                    <ListItemButton onClick={() => handleSelect(query, option)}>
                      <ListItemText primary={query.label} />
                    </ListItemButton>
                  </ListItem>) )}
                </List>
              </Popper>
            </Box>
          </Box>
    </Box>
    )
}