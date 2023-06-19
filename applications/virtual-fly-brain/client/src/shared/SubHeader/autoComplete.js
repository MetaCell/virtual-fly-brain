import * as React from 'react';
import PropTypes from 'prop-types';
import useAutocomplete from '@mui/base/useAutocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { Box, Button, Chip, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Popper, Tooltip, Typography } from "@mui/material";
import vars from "../../theme/variables";
import { AddChart, AngleRight, ChevronDown, CleaningServices, Delete, More, OpenInNew, Search, SplitScreen } from "../../icons";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const {
  bottomNavBg,
  outlinedBtnTextColor,
  queryBorderColor,
  primaryBg,
  secondaryBg,
  searchBoxBg,
  whiteColor,
  searchHeadingColor,
  outlinedBtnBorderColor,
  chipPink,
  chipRed,
  chipGreen,
  chipYellow,
  chipOrange,
  chipRedSecondary,
  chipGreenSecondary,
  listHover,
  queryChipBg
} = vars;


const InputWrapper = styled('div')(
  () => `
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  & input {
    background-color: transparent;
    color: ${outlinedBtnTextColor};
    font-size: 0.875rem;
    line-height: 129%;
    height: 2rem;
    box-sizing: border-box;
    padding: 0;
    width: 0;
    min-width: 1.875rem;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &::placeholder {
      color: ${outlinedBtnTextColor};
      font-size: 0.875rem;
      line-height: 129%;
    }
  }
`,
);

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const Listbox = styled('div')(
  ({ theme }) => `
  width: 100%;
  margin: 0.125rem 0 0;
  left: 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${bottomNavBg};
  overflow: auto;
  border-top: 0.0625rem solid ${primaryBg};
  max-height: 17.375rem;
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 1;
  backdrop-filter: blur(0.625rem);

  & > div:last-of-type {
    padding-bottom: 0;
    margin-bottom: -1.75rem;
  }

  &:after {
    content: '';
    position: sticky;
    bottom: 0;
    left: 0;
    z-index: 999;
    display: block;
    height: 2.5rem;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(58, 58, 58, 0) 0%, rgba(58, 58, 58, 0.8) 100%);
    border-radius: 0 0 0.375rem 0.375rem;
  }

  & > div {
    & span {
      flex-grow: 1;
    }
  }

  & li[aria-selected='true'] {
    background-color: transparent;
    font-weight: 600;
  }

  & li.${autocompleteClasses.focused} {
    background-color: transparent;
    cursor: pointer;
  }
`,
);
const chipColors = [chipRed, chipGreen, chipOrange, chipPink, chipYellow];
const searchResults = [
  { title: 'A0 (anlage in statu nascendi)', tags: ["Anatomy", 'Nervous system'] },
  { title: 'A00c_a4', tags: ["Anatomy", 'Nervous system'] },
  { title: 'a00c_a41 (a00c_a4 (L1EM:2511238))', tags: ["Anatomy", 'Nervous system'] },
  { title: 'BCD (anlage in statu nascendi)', tags: ["Anatomy", 'Nervous system'] },
];

export default function CustomizedHook({ setFocused }) {
  const [anchorEls, setAnchorEls] =  React.useState([]);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);

  const popoverHandleClick = (event) => {
    setPopoverAnchorEl(popoverAnchorEl ? null : event.target.parentElement.parentElement);
  };

  const popoverHandleClose = () => {
    setPopoverAnchorEl(null);
  };

  const popoverOpen = Boolean(popoverAnchorEl);
  const id = popoverOpen ? 'simple-popover' : undefined;
  const handleMenuOpen = (index, event) => {
    const updatedAnchorEls = [...anchorEls];
    updatedAnchorEls[index] = event.currentTarget;
    setAnchorEls(updatedAnchorEls);
    setMenuOpen(true)
  };

  const handleMenuClose = (index) => {
    const updatedAnchorEls = [...anchorEls];
    updatedAnchorEls[index] = null;
    setAnchorEls(updatedAnchorEls);
    setMenuOpen(false)
  };

  const recentSearch = [
    {
      title: 'CDF0 (anlage in statu nascendi)',
      tags: [
        { id: 0, label: "Anatomy" },
        { id: 1, label: 'Nervous system' },
        { id: 2, label: 'Neuron' },
        { id: 3, label: 'Nervous projection bundle' },
        { id: 4, label: 'Larva' }
      ]
    },
    {
      title: 'a00c_a41 (a00c_a4 (L1EM:2511238))',
      tags: [
        { id: 0, label: "Anatomy" },
        { id: 1, label: 'Nervous system' },
      ]
    },
  ];
  const [value, setValue] = React.useState([]);
  const addQueryTag = () => { setValue((prevValue) => [{title: 'Queries', tags: []}, ...prevValue]) }

  const handleResultSelection = (option) => {
    const doesOptionExist =  obj => obj.title === option.title
    if(!value.some(doesOptionExist)){
      setValue([...value, option])
    }
  };
  const handleChipDelete = (index) => {
    setValue(value.filter((chip) => chip.title !== index))
  }
  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'customized-hook',
    multiple: true,
    options: searchResults,
    getOptionLabel: (option) => option?.title,
  });

  // React.useEffect(() => {
  //   setFocused(focused)
  // }, [focused])

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    if(!menuOpen) {
      setFocused(false)
    }
  };

  return (
    <Box flexGrow={1}>
      <Box {...getRootProps()}>
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
          {value.length > 0 && (
            <Box
              flexWrap='wrap'
              display='flex'
              paddingRight={1}
              gap={1}
            >
              {value.map((option, index) => (
                <Chip
                  className="secondary"
                  key={`tag-${index}`}
                  sx={{
                    background: option.title === 'Queries' ? queryChipBg : outlinedBtnBorderColor ,
                    alignSelf: 'center',
                    color: outlinedBtnTextColor
                  }}
                  label={option.title}
                  {...getTagProps({ index })}
                  deleteIcon={<CloseIcon />}
                  value={value}
                  onDelete={() => handleChipDelete(option.title)}
                />
              ))}
            </Box>
          )}
          <input placeholder='Find something...' {...getInputProps()} onFocus={handleFocus} onBlur={handleBlur}/>
        </InputWrapper>
      </Box>
      {groupedOptions.length > 0 ? (
        <Listbox sx={{
          top: {
            xs: '2.875rem',
            lg: '2.125rem'
          }
        }} className='scrollbar' {...getListboxProps()}>
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
                      Select query for A00c_a4 (L1EM:2511238) expression pattern
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
                        <ListItem>
                          <ListItemButton onClick={popoverHandleClose}>
                            <ListItemText primary="Select query for A00c_a4 (L1EM:2511238) expression pattern" />
                          </ListItemButton>
                        </ListItem>

                        <ListItem>
                          <ListItemButton onClick={popoverHandleClose}>
                            <ListItemText primary="Anatomy A00c_a4 (L1EM:2511238) expression pattern is expressed in" />
                          </ListItemButton>
                        </ListItem>

                        <ListItem>
                          <ListItemButton onClick={popoverHandleClose}>
                            <ListItemText primary="Images of fragments of A00c_a4 (L1EM:2511238)expression pattern" />
                          </ListItemButton>
                        </ListItem>

                        <ListItem>
                          <ListItemButton onClick={popoverHandleClose}>
                            <ListItemText primary="Parts of A00c_a4 (L1EM:2511238) expression pattern" />
                          </ListItemButton>
                        </ListItem>

                        <ListItem>
                          <ListItemButton onClick={popoverHandleClose}>
                            <ListItemText primary="Subclasses of A00c_a4 (L1EM:2511238) expression pattern" />
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </Popper>
                  </Box>
                </Box>
              </Box>

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
                      Select query for A00c_a4 (L1EM:2511238) expression pattern
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
                        <ListItem>
                          <ListItemButton onClick={popoverHandleClose}>
                            <ListItemText primary="Select query for A00c_a4 (L1EM:2511238) expression pattern" />
                          </ListItemButton>
                        </ListItem>

                        <ListItem>
                          <ListItemButton onClick={popoverHandleClose}>
                            <ListItemText primary="Anatomy A00c_a4 (L1EM:2511238) expression pattern is expressed in" />
                          </ListItemButton>
                        </ListItem>

                        <ListItem>
                          <ListItemButton onClick={popoverHandleClose}>
                            <ListItemText primary="Images of fragments of A00c_a4 (L1EM:2511238)expression pattern" />
                          </ListItemButton>
                        </ListItem>

                        <ListItem>
                          <ListItemButton onClick={popoverHandleClose}>
                            <ListItemText primary="Parts of A00c_a4 (L1EM:2511238) expression pattern" />
                          </ListItemButton>
                        </ListItem>

                        <ListItem>
                          <ListItemButton onClick={popoverHandleClose}>
                            <ListItemText primary="Subclasses of A00c_a4 (L1EM:2511238) expression pattern" />
                          </ListItemButton>
                        </ListItem>
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

          {/* NARROW YOUR SEARCH STARTS HERE */}
          <Box sx={{
            py: '1rem',
            px: '0.75rem',
            borderBottom: `0.0625rem solid ${primaryBg}`,
          }}>
            <Typography variant="body2" sx={{
              fontSize: '0.75rem',
              lineHeight: '133%',
              letterSpacing: '-0.005em',
              fontWeight: 500,
              color: searchHeadingColor
            }}>
              Narrow your search
            </Typography>

            <Box
              mt={1}
              columnGap={1}
              display='flex'
              sx={{
                alignItems: {
                  xs: 'flex-start',
                  lg: 'center'
                }
              }}
            >
              <Box sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                columnGap: 1,
                flexWrap: 'wrap',
                rowGap: 0.5
              }}>
                <Chip
                  className="secondary"
                  sx={{ backgroundColor: chipGreenSecondary }}
                  label="Anatomy"
                  onDelete={() => null}
                  deleteIcon={<CloseIcon />}
                />
                <Chip
                  className="secondary"
                  sx={{ backgroundColor: chipGreenSecondary }}
                  label="Nervous system"
                  onDelete={() => null}
                  deleteIcon={<CloseIcon />}
                />
                <Chip
                  className="secondary"
                  sx={{ backgroundColor: chipRedSecondary }}
                  label="Neuron"
                  onDelete={() => null}
                  deleteIcon={<CloseIcon />}
                />

              </Box>

              <Button
                disableRipple
                variant="text"
                sx={{
                  flexShrink: 0,
                  padding: 0,
                  fontSize: '0.75rem',
                  lineHeight: '133%',
                  height: {
                    xs: '1.5rem',
                    lg: 'auto'
                  },
                  color: outlinedBtnTextColor,

                  '&:hover': {
                    background: 'transparent'
                  }
                }}
              >
                More filters
              </Button>
            </Box>
          </Box>
          {/* NARROW YOUR SEARCH ENDS HERE */}

          {/* I AM LOOKING FOR STARTS HERE */}
          <Box sx={{
            py: '1rem',
            px: '0.75rem',
            borderBottom: `0.0625rem solid ${primaryBg}`,
          }}>
            <Typography variant="body2" sx={{
              fontSize: '0.75rem',
              lineHeight: '133%',
              letterSpacing: '-0.005em',
              fontWeight: 500,
              color: searchHeadingColor
            }}>
              I’m looking for...
            </Typography>

            <Box
              mt={1.5}
              sx={{
                columnGap: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Button sx={{
                px: '0.5rem',
                py: '0.25rem',
                backgroundColor: outlinedBtnBorderColor,
                borderRadius: 1,
                fontSize: '0.75rem',
                height: '1.5rem',

                '&:hover': {
                  backgroundColor: outlinedBtnBorderColor,
                }
              }}>
                <AddChart style={{ marginRight: '0.5rem' }} />
                Load results
                <AngleRight style={{ marginLeft: '0.5rem' }} />
              </Button>

              <Button sx={{
                px: 1,
                py: 0.5,
                fontSize: '0.75rem',
                height: '1.5rem',
                backgroundColor: outlinedBtnBorderColor,
                borderRadius: 1,

                '&:hover': {
                  backgroundColor: outlinedBtnBorderColor,
                }
              }}
                onClick={addQueryTag}
              >
                <SplitScreen style={{ marginRight: '0.5rem' }} />
                Queries
                <AngleRight style={{ marginLeft: '0.5rem' }} />
              </Button>
            </Box>
          </Box>
          {/* I AM LOOKING FOR ENDS HERE */}

          {/* RECENT SEARCHES STARTS HERE */}
          <Box sx={{
            py: '1rem',
            px: '0.75rem',
          }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.75rem',
                lineHeight: '133%',
                letterSpacing: '-0.005em',
                fontWeight: 500,
                color: searchHeadingColor
              }}
            >
              Recent search
            </Typography>

            <Box mt={1.5}>
              { recentSearch.map((search, index) => (
                <Box key={`recentSearch-${index}`} sx={{
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
                      fontSize: '0.625rem', backgroundColor: chipColors[tag.id] }} label={tag.label} />)}
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
                              fontSize: '0.625rem', backgroundColor: chipColors[tag.id] }} label={tag.label} />)}
                          </Box>
                        }
                      >
                        <Chip sx={{
                          lineHeight: '140%',
                          fontSize: '0.625rem',
                          backgroundColor: searchBoxBg
                        }} label={`+${search?.tags?.slice(2).length }`} />
                      </Tooltip> ) : null
                    }
                    <IconButton
                      sx={{
                        width: '1.25rem',
                        height: '1.25rem',
                        padding: 0
                      }}
                      size="small"
                      key={`search_${index}`}
                      ref={anchorEls[index]}
                      onClick={(event) => handleMenuOpen(index, event)}
                    >
                      <More />
                    </IconButton>
                    <Menu
                      open={Boolean(anchorEls[index])}
                      onClose={() => handleMenuClose(index)}
                      anchorEl={anchorEls[index]}
                    >
                      <MenuItem onClick={handleMenuClose}>
                        <AddChart style={{ margin: '0 0.375rem 0 0' }} />
                        Load results
                      </MenuItem>
                      <MenuItem onClick={handleMenuClose}>
                        <OpenInNew style={{ margin: '0 0.375rem 0 0' }} />
                        Go to query
                      </MenuItem>
                      <MenuItem onClick={handleMenuClose}>
                        <Delete style={{ margin: '0 0.375rem 0 0' }} />
                        Remove from history
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
                )

              ) }
            </Box>

          </Box>
          {/* RECENT SEARCHES ENDS HERE */}

          {/* SEARCH RESULT STARTS HERE */}
          <Box sx={{
            py: '1rem',
            px: '0.75rem',
          }}>
            <Typography variant="body2" sx={{
              fontSize: '0.75rem',
              lineHeight: '133%',
              letterSpacing: '-0.005em',
              fontWeight: 500,
              color: searchHeadingColor
            }}>
              Suggested results
            </Typography>
            <Box mt={1.5}>
              {groupedOptions.map((option, index) => (
                <Box key={`groupedOptions-${index}`} {...getOptionProps({ option, index })}>
                  <Box key={option?.title} onClick={() => handleResultSelection(option)} sx={{
                    position: 'relative',
                    p: 0.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',

                    '& > button': {
                      opacity: 1,
                      transition: 'all ease-in-out .3s'
                    },

                    '&:not(:hover)': {
                      '& > button': {
                        opacity: 0
                      }
                    },

                    '&:hover': {
                      backgroundColor: secondaryBg,
                      cursor: 'pointer',
                    }
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: 1,
                      background: searchBoxBg,
                    }}>
                      <Search size={12} />
                    </Box>

                    <Typography variant="body2" sx={{
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: searchHeadingColor,
                      px: 1
                    }}>
                      {option?.title}
                    </Typography>

                    <Box sx={{
                      ml: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 0.5
                    }}>
                      {option?.tags.map((tag, index) => <Chip
                        key={tag + index}
                        sx={{
                          lineHeight: '140%',
                          fontSize: '0.625rem',
                          backgroundColor: chipColors[index] || chipColors[0]
                        }}
                        label={tag}
                      />)}
                    </Box>

                    <Button sx={{
                      color: whiteColor,
                      zIndex: 9,
                      justifyContent: 'flex-end',
                      background: listHover,
                      borderRadius: '0.25rem',
                      width: '5.8125rem',
                      minWidth: '0.0625rem',
                      p: '0 0.75rem 0 0',
                      height: '100%',
                      position: 'absolute',
                      right: 0,
                      top: 0
                    }} variant='text'>
                      <ArrowOutwardIcon sx={{
                        fontSize: '0.75rem',
                        m: 0,
                      }} />
                    </Button>

                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          {/* SEARCH RESULT ENDS HERE */}
        </Listbox>
      ) : null}
    </Box>
  );
}
