import * as React from 'react';
import PropTypes from 'prop-types';
import useAutocomplete from '@mui/base/useAutocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { Box, Chip } from "@mui/material";
import vars from "../../theme/variables";
import { SearchResult } from './SearchResult';
import { RecentSearch } from './RecentSearch';
import { QueriesSelection } from './QueriesSelection';
import { NarrowSearchFilter } from './NarrowSearchFilter';
import { ResultSelectionOptions } from './ResultSelectionOptions';
import  { getResultsSOLR } from '../../components/configuration/VFBSearchBuilder/SOLRclient'
import { DatasourceTypes } from '@metacell/geppetto-meta-ui/search/datasources/datasources';
import { get_queries } from "../../network/query"
import { getInstanceByID } from './../../reducers/actions/instances';
import { useSelector } from 'react-redux'
import { termInfoById } from '../../reducers/actions/termInfo';


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

];

export default function SearchBuilder(props) {

  const [value, setValue] = React.useState([]);
  const [recentSearch, setRecentSearch] = React.useState([]);
  const [groupedOptions, setGroupedOptions] = React.useState([]);
  const addQueryTag = () => { setValue((prevValue) => [{label: 'Queries', tags: []}, ...prevValue]) }
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances);

  const loadResults = () => {
    console.log("Results ", value);
    value.forEach( (v, index) => {
      let id = v.id?.split("/");
      id = id[id.length - 1];
      if ( !allLoadedInstances?.find( i => i.id === id) && index <= value.length - 1){
        getInstanceByID(id);
        console.log("id loaded ", id);
      }
    })
    termInfoById(value[value.length -1 ].short_form);
  }

  const handleResultSelection = async(option) => {
    const doesOptionExist =  obj => obj.label === option.label
    if(!value.some(doesOptionExist)){
      let response;
      try {
        console.log("option ", option);
        response = await get_queries(option.short_form);
        console.log("response ", response);
        option.queries = response.Queries;
      } catch (error) {
        console.log("error ", error);
      }
      console.log("option ", option);
      setValue([...value, option])
    }
  };

  const handleChipDelete = (index) => {
    setValue(value.filter((chip) => chip.label !== index))
  }

  const getDatasource = {
    [DatasourceTypes.CUSTOM]: props.customDatasourceHandler,
    [DatasourceTypes.SOLRClient]: getResultsSOLR,
  };

  const handleResults = (status, data, v) => {
    console.log("Handle status ", status)
    console.log("Handle data ", data)
    console.log("Handle value ", value)
    switch(status) {

      case "OK":
          if (v !== value) {
            // if (v === "") {
            //   setValue([])
            // } else {
            //   setValue(v)
            // }
            console.log("Set data ")
            setGroupedOptions(data)
          }
          break;
      case "ERROR":
          break;
      default:
          console.log("This is a case not considered");
    }
  }

  const searchConfiguration = require('../../components/configuration/VFBSearchBuilder/searchConfiguration').searchConfiguration;
  const datasourceConfiguration = require('../../components/configuration/VFBSearchBuilder/searchConfiguration').datasourceConfiguration;

  const handleSearch = (searchWord) => {
    console.log("searchWord ",searchWord);
    searchWord?.length > 3 && getResultsSOLR(searchWord,
      handleResults,
      searchConfiguration.sorter,
      datasourceConfiguration,
      setGroupedOptions);
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
    options: searchResults,
    getOptionLabel: (option) => option?.label,
    disableCloseOnSelect: true,
    open: true,
    onInputChange : event => handleSearch(event.target.value)
  });

  React.useEffect(() => {
    props.setFocused(focused ? true : false)
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
                    background: option.label === 'Queries' ? queryChipBg : outlinedBtnBorderColor,
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
      {focused ? (
        <Listbox
          sx={{
            top: {
              xs: '2.875rem',
              lg: '2.125rem'
            }
          }}
          className='scrollbar'
          {...getListboxProps()}
        >
          { value.length >= 1 ? (<QueriesSelection recentSearch={value}/>) : null }

          <NarrowSearchFilter />

          { value.length >= 1 ? (<ResultSelectionOptions
            addQueryTag={addQueryTag}
            loadResults={loadResults}
          />) : null }

          { recentSearch.length >= 1 ? (<RecentSearch
            chipColors={chipColors}
            recentSearch={recentSearch}
          />) : null }

          <SearchResult
            groupedOptions={groupedOptions}
            getOptionProps={getOptionProps}
            chipColors={chipColors}
            handleResultSelection={handleResultSelection}
          />
        </Listbox>
      ) : null}
    </Box>
  );
}
