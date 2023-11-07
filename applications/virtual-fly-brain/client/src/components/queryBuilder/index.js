import React from "react";
import PropTypes from 'prop-types';
import { Add, ClearAll, Cross, Delete, Download, Next, Prev, Remove } from "../../icons"
import { Box, Button, ButtonGroup, IconButton, InputAdornment, Pagination, PaginationItem, Tab, Tabs, TextField } from "@mui/material";
import Query from "./Query";
import History from "./History";
import vars from "../../theme/variables";
import { useSelector } from 'react-redux'


const { secondaryBg, outlinedBtnTextColor, headerBorderColor, blackColor, queryBuilderBg, whiteColor, primaryBg } = vars;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      sx={{height: '100%'}}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          { children }
        </>
      )}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const QueryBuilder = ({ fullWidth, bottomNav, setBottomNav }) => {
  const [value, setValue] = React.useState(0);
  const queries = useSelector(state => state.queries.queries);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const classes = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: {
        xs: '100%',
        lg: 'calc(100% - 0.125rem)'
      },
      position: {
        lg: 'absolute'
      },
      top: {
        xs: '6.0625rem',
        lg: '0.125rem',
      },
      zIndex: 99,
      right: 0,
      width: {
        xs: '100%',
        lg: fullWidth ? 'calc(100% - 34.1325rem)' : 'calc(100% - 2.8825rem)'
      },
      borderRadius: {
        lg: '0.5rem'
      },
      border: {
        lg: `0.0625rem solid ${secondaryBg}`
      },
      background: {
        xs: headerBorderColor,
        lg: queryBuilderBg
      },
      boxShadow: {
        lg: `0px 0px 80px 0px rgba(0, 0, 0, 0.60), 0px 4px 100px 0px rgba(0, 0, 0, 0.50)`
      },
      backdropFilter: 'blur(0.625rem)'
    },
    header: {},
    body: {
      height: 'calc(100vh - (3.5625rem + 3.25rem))',
      overflow: 'auto',
      flex: 1,
    },
    footer: {
      borderTop: `0.0625rem solid ${secondaryBg}`,
      padding: '0.75rem',
      backdropFilter: 'blur(0.375rem)',
      background: queryBuilderBg,
      borderRadius: {
        lg: '0 0 0.5rem 0.5rem'
      },
    },
  }
  return (
    <Box sx={classes.root}>
      <Box sx={classes.header}>
        <Box sx={{
          background: {
            xs: secondaryBg,
            lg: queryBuilderBg
          },
          borderTopLeftRadius: {
            lg: '0.5rem'
          },
          borderTopRightRadius: {
            lg: '0.5rem'
          },
          height: {
            lg: '3.25rem'
          },
          display: 'flex',

        }}>
          <Button
            onClick={() => setBottomNav(undefined)}
            sx={{
              height: 'auto',
              borderRight: `0.0625rem solid ${primaryBg}`,
              minWidth: '0.0625rem',
              padding: {
                xs: '1rem 0.875rem',
                lg: '1rem'
              },
            }}
          >
            <Cross />
          </Button>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab disableRipple label="Query" {...a11yProps(0)} />
            <Tab disableRipple label="History" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </Box>

      <Box sx={classes.body}>
        <TabPanel value={value} index={0}>
          <Query fullWidth={fullWidth} queries={queries} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <History />
        </TabPanel>
      </Box>

      <Box
        display='flex'
        gap='0.5rem'
        sx={classes.footer}
      >
        {!value ? (
          <>
            <TextField
              placeholder="Search here"
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton>
                    <Cross />
                  </IconButton>
                </InputAdornment>
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: primaryBg,
                  borderWidth: '0.0625rem'
                },
                '& .MuiOutlinedInput-root': {
                  paddingRight: '0.5rem',
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: primaryBg,
                      borderWidth: '0.0625rem'
                    }
                  },
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: primaryBg,
                      borderWidth: '0.0625rem'
                    }
                  },
                },
                '& .MuiOutlinedInput-input': {
                  padding: '0 0.5rem',
                  fontSize: '0.75rem',
                  color: whiteColor,
                  height: '2rem',

                  '&::placeholder': {
                    color: outlinedBtnTextColor,
                    opacity: 1
                  }
                }
              }}
              fullWidth
            />

            <ButtonGroup sx={{
              '& .MuiButton-root': {
                height: '100%'
              }
            }} variant="contained">
              <Button color="secondary">
                <Add />
              </Button>
              <Button color="secondary">
                <Delete />
              </Button>
              <Button color="secondary">
                <Download color={outlinedBtnTextColor} />
              </Button>
            </ButtonGroup>

            <Button sx={{
              flexShrink: 0,
              padding: 0,
              width: '5.875rem',
              height: '2rem'
            }} variant="outlined" color="info">New query</Button>
          </>
        ) : (
            <Pagination
              count={10}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: Prev, next: Next }}
                  {...item}
                />
              )}
            />
        )}

      </Box>
    </Box>
  )
};

export default QueryBuilder;