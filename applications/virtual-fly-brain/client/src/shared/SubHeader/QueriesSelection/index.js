import { Box, Typography, Button, Popper, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { AngleRight, ChevronDown, CleaningServices, Delete } from "../../../icons";
import vars from "../../../theme/variables";

const { searchHeadingColor, searchBoxBg, primaryBg, whiteColor, queryBorderColor } = vars;

export const QueriesSelection = () => {
  const listItems = [
    "Select query for A00c_a4 (L1EM:2511238) expression pattern",
    "Anatomy A00c_a4 (L1EM:2511238) expression pattern is expressed in",
    "Parts of A00c_a4 (L1EM:2511238) expression pattern",
    "Subclasses of A00c_a4 (L1EM:2511238) expression pattern"
  ];
  const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);
  const [selectedOption, setSelectedOption] = React.useState(listItems[0]);

  const popoverHandleClick = (event) => {
    setPopoverAnchorEl(popoverAnchorEl ? null : event.target.parentElement.parentElement);
  };

  const handleSelect = (option) => {
    setSelectedOption(option)
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
        <Box
          display='flex'
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
              <Typography sx={{
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
                {selectedOption}
              </Typography>

              <Button
                aria-describedby={id}
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
                  { listItems.map((option, index) => <ListItem key={option+index}>
                    <ListItemButton onClick={() => handleSelect(option)}>
                      <ListItemText primary={option} />
                    </ListItemButton>
                  </ListItem> )}
                </List>
              </Popper>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        display='flex'
        justifyContent='flex-end'
      >
        <Button
          onClick={() => console.log('Clicked')}
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
          Check 15 results
          <AngleRight style={{ marginLeft: '0.5rem' }} />
        </Button>
      </Box>
    </Box>
  )
}