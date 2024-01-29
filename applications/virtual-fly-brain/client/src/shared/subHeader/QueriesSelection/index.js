import React from "react";
import { Box, Typography, Button, LinearProgress, Stack } from "@mui/material";
import { AngleRight, CleaningServices } from "../../../icons";
import { QueriesSelectionDropdown } from "./QueriesSelectionDropdown";
import vars from "../../../theme/variables";

const queryBuilderDatasourceConfig = require('../../../components/configuration/VFBSearchBuilder/queryBuilderConfiguration').queryBuilderDatasourceConfig;

const { searchHeadingColor, primaryBg, btnDisabledColor } = vars;

export const QueriesSelection = ({ checkResults, handleQueryDeletion, recentSearch , queriesRequested}) => {
  const [searchQueries, setSearchQueries] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState({ count : 0});
  const [selectedQueryIndex, setSelectedQueryIndex] = React.useState("");
  React.useEffect(() => {
    let matchQuery = recentSearch.filter( query => queriesRequested?.find( q => query.label === q.label ) );
    setSearchQueries(matchQuery)
  }, [recentSearch])

  const deleteQuery = (event) => {
    let matchQuery = searchQueries.find( q => event.currentTarget.id === q.label);
    let queries = searchQueries.filter( q => event.currentTarget.id !== q.label);
    setSearchQueries(queries);
    handleQueryDeletion(event.currentTarget.id);
    delete selectedOption[matchQuery.short_form];
    let updateSelection = selectedOption;
    let count = 0;
    Object.keys(selectedOption)?.forEach( o => {
        if ( typeof selectedOption[o] === 'object' ) {
          count = count + ( selectedOption[o].count || 0 )
        } 
    })
    updateSelection.count = count;
    setSelectedOption(updateSelection)
  }

  const goBackToInitialState = (short_form) => {
    setSelectedQueryIndex("")
    let updatedSelectedOption = {...selectedOption, [short_form]: true, count : selectedOption.count - selectedOption[short_form].count};
    setSelectedOption(updatedSelectedOption)
  }

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
        { queriesRequested.length <= searchQueries.length ?
          <>
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
          </>
        :
          <Typography variant="body2" sx={{
            fontSize: '0.75rem',
            lineHeight: '133%',
            letterSpacing: '-0.005em',
            fontWeight: 500,
            color: searchHeadingColor
          }}>
            Loading query IDs
          </Typography>
      }
      </Box>

      <Box
        my={1.5}
        display='flex'
        flexDirection='column'
        rowGap={2}
      >
        { queriesRequested.length > searchQueries.length ?
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box
              borderRadius={1}
              display='flex'
              sx={{
                width: 'calc(100% - 2rem)',
                border: "1px solid #0AB7FE"
              }}
            >
                <Box
                  width={1}
                  flexGrow={1}
                  display='flex'
                >
                  <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                    <LinearProgress color="inherit" />
                  </Stack>
                </Box>
            </Box>
          </Box>
        :
         <>{searchQueries?.map((option, index) => 
          <QueriesSelectionDropdown
            key={index}
            option={option}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            selectedQueryIndex={selectedQueryIndex}
            setSelectedQueryIndex={setSelectedQueryIndex}
            deleteQuery={deleteQuery}
            goBackToInitialState={goBackToInitialState}
          />
          )}
            <Box
            display='flex'
            justifyContent='flex-end'
          >
            <Button
                onClick={checkResults}
                disabled={!(selectedOption?.count >= 1)}
                sx={{
                  px: '0.5rem',
                  py: '0.25rem',
                  backgroundColor: primaryBg,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  height: '1.5rem',
                  '& svg path': {
                    fill: !(selectedOption?.count >= 1) && btnDisabledColor
                  },
                  '&.Mui-disabled': {
                    color: btnDisabledColor
                  },
                  '&:hover': {
                    backgroundColor: primaryBg,
                  }
                }}
              >
                Check { selectedOption.count } results
                <AngleRight style={{ marginLeft: '0.5rem' }} />
            </Button>
          </Box>
          </> 
        }
      </Box>
    </Box>
  )
}