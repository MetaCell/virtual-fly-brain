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
  queryChipBg,
  whiteColor
} = vars;


const InputWrapper = styled('div')(
  () => `
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  & input {
    background-color: transparent;
    color: ${whiteColor};
    font-size: 0.875rem;
    line-height: 129%;
    height: 2rem;
    box-sizing: border-box;
    padding: 0;
    width: 0;
    min-width: 1.875rem;
    flex-grow: 1;
    border: 0;
    cursor: pointer;
    margin: 0;
    outline: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &::placeholder {
      color: ${whiteColor};
      opacity: 0.8;
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

export default function SearchBuilder({ setFocused }) {

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
    disableCloseOnSelect: true,
    open: true
  });

  React.useEffect(() => {
    setFocused(focused ? true : false)
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
                    background: option.title === 'Queries' ? queryChipBg : outlinedBtnBorderColor,
                    alignSelf: 'center',
                    color: outlinedBtnTextColor,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '5.9375rem'
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
          <QueriesSelection />

          <NarrowSearchFilter />

          <ResultSelectionOptions
            addQueryTag={addQueryTag}
          />

          <RecentSearch
            chipColors={chipColors}
            recentSearch={recentSearch}
          />

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
