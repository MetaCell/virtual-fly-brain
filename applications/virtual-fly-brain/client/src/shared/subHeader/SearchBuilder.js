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
import { addRecentSearch } from '../../reducers/actions/globals';
import { useSelector, useDispatch } from 'react-redux'
import { getQueries, deleteQuery, updateQueries } from '../../reducers/actions/queries';
import { getUpdatedTags } from '../../utils/utils';

const QUERIES = "Queries";

const {
  bottomNavBg,
  outlinedBtnTextColor,
  primaryBg,
  outlinedBtnBorderColor,
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

const searchResults = [

];

const colors_config = require("../../components/configuration/VFBColors").facets_annotations_colors;
const facets_annotations_colors = getUpdatedTags(colors_config)

export default function SearchBuilder(props) {

  const [value, setValue] = React.useState([]);
  const [retrievingResults, setRetrievingResults] = React.useState(false)
  const [groupedOptions, setGroupedOptions] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [lastSearch, setLastSearch] = React.useState("");
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances);
  const queries = useSelector(state => state.queries.queries);
  const [hasFocus,setHasFocus] = React.useState(false);
  const globalRecentSearches = useSelector( state => state.globalInfo.recentSearches)
  const queriesError = useSelector(state => state.queries.error);
  const queriesErrorMessage = useSelector(state => state.queries.errorMessage);
  const queriesErrorID = useSelector(state => state.queries.errorID);

  const dispatch = useDispatch();

  const addQueryTag = () => { 
    value.forEach( v => {
      if (!queries?.find( q => q.short_form === v.short_form )) { 
        getQueries(v.short_form);
      } 
    })
    if ( !value.find( v => v.label === QUERIES )){
      setValue((prevValue) => [{label: 'Queries', tags: [], id : "Queries"}, ...prevValue])
    }
  };

  const checkResults = () => {
    props.setBottomNav(2)
    setIsOpen(false)
    props.setFocused(false);
    let updatedQueries = [];
    queries.length > 0 ? updatedQueries = [...queries] : []
    updatedQueries.forEach( q => {
      let match = value?.find( v => v.short_form === q.short_form );
      if ( match !== undefined ) {
        Object.keys(q.queries)?.forEach( key => {
          if ( q.queries[key].active ) {
            q.active = true;
            if ( q.queries[key].rows === undefined ) {
              getQueries(q.short_form, key)
            }else { 
              if ( !globalRecentSearches?.find( recent => recent.short_form === option.id ) && option.type){
                dispatch(addRecentSearch(option, true));
              }
            }
          }
        })
      }
    })
    updateQueries(updatedQueries);
    setValue([])
  }

  const loadResults = () => {
    value.forEach( (v, index) => {
      let id = v.id?.split("/");
      id = id?.[id?.length - 1];
      if ( !allLoadedInstances?.find( i => i.id === id) && index <= value.length - 1){
        getInstanceByID(id, true, true, true);
      }
    })
    setIsOpen(false)
    value.forEach( v => deleteQuery(v))
    setValue([])
  }

  const handleResultSelection = async(option) => {
    const doesOptionExist =  obj => obj.label === option.label
    if(!value.some(doesOptionExist)){
      if (!queries?.find( q => q.short_form === option.short_form ) && value.find((chip) => chip.id === QUERIES)) { 
        getQueries(option.short_form);
      } 
      setValue([...value, {...option, id : option.short_form, label : option.label}])
      if ( !globalRecentSearches?.find( recent => recent.short_form === option.short_form ) ){
        dispatch(addRecentSearch(option, false));
      }
    }
  };

  const handleChipDelete = (label) => {
    handleQueryDeletion(label)
    let filtered = value.filter((chip) => chip.id !== label);
    setValue(filtered);
    if ( filtered.length == 0 || ( filtered.length === 1 && value.find( v => v.label === QUERIES ))){
      setGroupedOptions([]);
    }
    if ( filtered.length <=1 && filtered.find( c => c.label == QUERIES )){
      setValue([])
    }
  }

  const handleQueryDeletion = (id) => {
    let option = value.find((chip) => chip.id === id);
    deleteQuery(option?.short_form);
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
    if ( searchWord?.length >= 1 && searchWord != lastSearch ){
      setRetrievingResults(true);
      setIsOpen(true)
      getResultsSOLR(searchWord,
        handleResults,
        searchConfiguration.sorter,
        datasourceConfiguration,
        setGroupedOptions);
      setLastSearch(searchWord)
    }
  }

  const handleFocused = (focused) => {
    setHasFocus(focused)
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

  React.useEffect(() => {
    handleFocused(props.filterOpened);
  }, [props.filterOpened])

  React.useEffect( () => {
    let values = [...value];
    if ( values.find( v => v.id === queriesErrorID ) ) {
      values = values.filter( v => v.id != queriesErrorID );
    }
    setValue(values)
  }, [queriesErrorID])

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
                  onDelete={() => handleChipDelete(option.short_form)}
                />
              ))}
            </Box>
          )}
          <input placeholder='Find something...' {...getInputProps()}/>
        </InputWrapper>
      </Box>
      { hasFocus && isOpen ? (
        <Listbox
          className='scrollbar'
          {...getListboxProps()}
        >
          { value.find( v => v.label === QUERIES ) && value.filter( v => v.label !== QUERIES )?.length >= 1 ? (<QueriesSelection checkResults={checkResults} handleQueryDeletion={handleChipDelete} queriesRequested={value.filter( v => v.label !== QUERIES )}/>) : null }

          {/* { groupedOptions.length >=1 ? <NarrowSearchFilter chipColors={chipColors} groupedOptions={groupedOptions}/> :null } */}

          { (value.length >= 1 && !value.find( v => v.label === QUERIES )) ? (<ResultSelectionOptions
            addQueryTag={addQueryTag}
            loadResults={loadResults}
          />) : null }

          { globalRecentSearches?.length >= 1 ? <RecentSearch
            facets_annotations_colors={facets_annotations_colors}
            recentSearches={globalRecentSearches}
            getOptionProps={getOptionProps}
            selectedFilters={props.applyFilters}
            handleResultSelection={handleResultSelection}
          /> : null }

          { !retrievingResults ? (<SearchResult
            groupedOptions={groupedOptions}
            getOptionProps={getOptionProps}
            selectedFilters={props.applyFilters}
            facets_annotations_colors={facets_annotations_colors}
            handleResultSelection={handleResultSelection}
          />) : <CircularProgress sx={{left: '50%', marginTop : '10%', position : 'relative'}}/> }
        </Listbox>
      ) : null}
    </Box>
  );
}
