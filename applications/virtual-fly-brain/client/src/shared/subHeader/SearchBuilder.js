import * as React from 'react';
import PropTypes from 'prop-types';
import useAutocomplete from '@mui/base/useAutocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { Box, Chip } from "@mui/material";
import vars from "../../theme/variables";
import { SearchResult } from './SearchResult';
import { RecentSearch } from './RecentSearch';
import { QueriesSelection } from './QueriesSelection';
import { ResultSelectionOptions } from './ResultSelectionOptions';
import  { getResultsSOLR } from '../../components/configuration/SOLRclient'
import { DatasourceTypes } from '@metacell/geppetto-meta-ui/search/datasources/datasources';
import { getInstanceByID } from './../../reducers/actions/instances';
import { useSelector } from 'react-redux'
import { termInfoById } from '../../reducers/actions/termInfo';
import { getQueries, deleteQuery } from '../../reducers/actions/queries';

const QUERIES = "Queries";

const {
  bottomNavBg,
  outlinedBtnTextColor,
  primaryBg,
  outlinedBtnBorderColor,
  chipPink,
  chipRed,
  chipGreen,
  chipYellow,
  chipOrange,
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
    height: 1.75rem;
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

];

export default function SearchBuilder(props) {

  const [value, setValue] = React.useState([]);
  const [retrievingResults, setRetrievingResults] = React.useState(false)
  const [recentSearch, setRecentSearch] = React.useState([]);
  const [groupedOptions, setGroupedOptions] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(true);

  const addQueryTag = () => { 
    if ( !value.find( v => v.label === QUERIES )){
      setValue((prevValue) => [{label: 'Queries', tags: []}, ...prevValue])
    }
  };
  const checkResults = () => {
    props.setBottomNav(2)
    setIsOpen(false)
    props.setFocused(false)
  }
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances);
  const queries = useSelector(state => state.queries.queries);

  const loadResults = () => {
    value.forEach( (v, index) => {
      let id = v.id?.split("/");
      id = id?.[id?.length - 1];
      if ( !allLoadedInstances?.find( i => i.id === id) && index <= value.length - 1){
        getInstanceByID(id);
      }
    })
    termInfoById(value[value.length -1 ].short_form);
    setIsOpen(false)
    value.forEach( v => deleteQuery(v))
    setValue([])
  }

  const handleResultSelection = async(option) => {
    const doesOptionExist =  obj => obj.label === option.label
    if(!value.some(doesOptionExist)){
      getQueries(option);
      setValue([...value, option])
    }
  };

  const handleChipDelete = (label) => {
    handleQueryDeletion(label)
    let filtered = value.filter((chip) => chip.label !== label);
    setValue(filtered);
    if ( filtered.length == 0 || ( filtered.length === 1 && value.find( v => v.label === QUERIES ))){
      setGroupedOptions([]);
    }
    if ( filtered.length <=1 && filtered.find( c => c.label == QUERIES )){
      setValue([])
    }
  }

  const handleQueryDeletion = (label) => {
    let option = value.find((chip) => chip.label === label);
    deleteQuery(option);
  }

  const getDatasource = {
    [DatasourceTypes.CUSTOM]: props.customDatasourceHandler,
    [DatasourceTypes.SOLRClient]: getResultsSOLR,
  };

  const handleResults = (status, data, v) => {
    switch(status) {

      case "OK":
          if (v !== value) {
            setGroupedOptions(data)
            props.handleFilters(data);
            setRetrievingResults(false);
          }
          break;
      case "ERROR":
        setRetrievingResults(false);    
      break;
      default:
          console.log("This is a case not considered");
    }

  }

  const searchConfiguration = require('../../components/configuration/VFBSearchBuilder/searchConfiguration').searchConfiguration;
  const datasourceConfiguration = require('../../components/configuration/VFBSearchBuilder/searchConfiguration').datasourceConfiguration;

  const handleSearch = (searchWord) => {
    if ( searchWord?.length >= 1 ){
      setRetrievingResults(true);
      setIsOpen(true)
      getResultsSOLR(searchWord,
        handleResults,
        searchConfiguration.sorter,
        datasourceConfiguration,
        setGroupedOptions);
    }
  }

  const handleFocused = (focused) => {
    props.setFocused(focused);
  }

  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'customized-hook',
    multiple: true,
    open: isOpen,
    options: searchResults,
    getOptionLabel: (option) => option?.label,
    onInputChange : event => handleSearch(event.target.value)
  });

  React.useEffect(() => {
    handleFocused(focused);
  }, [focused])

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
                    background: option.label === QUERIES ? queryChipBg : outlinedBtnBorderColor,
                    alignSelf: 'center',
                    color: outlinedBtnTextColor,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '5.9375rem'
                  }}
                  label={option.label}
                  {...getTagProps({ index })}
                  deleteIcon={<CloseIcon />}
                  value={value}
                  onDelete={() => handleChipDelete(option.label)}
                />
              ))}
            </Box>
          )}
          <input placeholder='Find something...' {...getInputProps()}/>
        </InputWrapper>
      </Box>
      {focused && isOpen ? (
        <Listbox
          className='scrollbar'
          {...getListboxProps()}
        >
          { value.find( v => v.label === QUERIES ) && queries?.length >= 1 ? (<QueriesSelection checkResults={checkResults} handleQueryDeletion={handleChipDelete} recentSearch={queries}/>) : null }

          {/* { groupedOptions.length >=1 ? <NarrowSearchFilter chipColors={chipColors} groupedOptions={groupedOptions}/> :null } */}

          { (value.length >= 1 && !value.find( v => v.label === QUERIES )) ? (<ResultSelectionOptions
            addQueryTag={addQueryTag}
            loadResults={loadResults}
          />) : null }

          { recentSearch.length >= 1 ? (<RecentSearch
            chipColors={chipColors}
            recentSearch={recentSearch}
          />) : null }

          { !retrievingResults ? (<SearchResult
            groupedOptions={groupedOptions}
            getOptionProps={getOptionProps}
            selectedFilters={props.applyFilters}
            chipColors={chipColors}
            handleResultSelection={handleResultSelection}
          />) : <CircularProgress sx={{left: '50%', marginTop : '10%', position : 'relative'}}/> }
        </Listbox>
      ) : null}
    </Box>
  );
}
