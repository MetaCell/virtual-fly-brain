import React, { useEffect } from "react";
import QueryHeader from "./QueryHeader";
import { Item } from "./HistoryItem";
import { Box } from "@mui/material";
import { useSelector } from 'react-redux'
import { removeAllRecentSearch } from "../../reducers/actions/globals";
import { useDispatch } from "react-redux";

const facets_annotations_colors = require("../configuration/VFBColors").facets_annotations_colors;

const History = ({recentSearches, totalResults}) => {
  const [filteredSearches, setFilteredSearches] = React.useState(recentSearches || []);
  const dispatch = useDispatch();
  const initialFilters = {
    "filters" : {
      "Id" : "short_form",
      "Name" : "label"
    },
    "tags" : "facets_annotation"
  };
  const [filters, setFilters] = React.useState(initialFilters);

  useEffect( () => {
    let tags = {...initialFilters.filters};
    recentSearches?.forEach( (query, index ) => {
      query.facets_annotation?.forEach( tag => {
        if ( tags?.[tag] == undefined ){
          tags[tag] = tag;
        }
      })
    })
    setFilters({...filters, filters : tags});
  }, [recentSearches])

  const updateFilters = (searches) => {
    setFilteredSearches(searches)
  }

  const removeFromHistory = () => {
    dispatch(removeAllRecentSearch())
  };

  const handleSort = (value, crescent) => {
    const identifier = filters.filters[value];
    let updatedSearches = [...filteredSearches.sort( (a,b) => {
      if ( a?.[identifier] && b?.[identifier] ){
        return (crescent)* a?.[identifier]?.localeCompare(b?.[identifier] )
      } else if ( a?.[filters.tags] && b?.[filters.tags] ) {
        if ( a?.[filters.tags]?.includes(identifier) ) {
          return -1;
        } else {
          return 0;
        }
      }
    })];
    setFilteredSearches(updatedSearches)
  }

  const handleCrescentEvent = (sort, crescent) => {
    const identifier = filters.filters[sort];
    let updatedSearches = [...filteredSearches.sort( (a,b) => {
      if ( a?.[identifier] && b?.[identifier] ){
        return (crescent * -1 )* a?.[identifier]?.localeCompare(b?.[identifier] )
      } else if ( a?.[filters.tags] && b?.[filters.tags] ) {
        if ( a?.[filters.tags]?.includes(identifier) ) {
          return -1;
        } else {
          return 0;
        }
      }
    })];
    setFilteredSearches(updatedSearches)
  }

  React.useEffect( () => {
    setFilteredSearches(recentSearches)
  }, [recentSearches])

  return (
    <>
      <QueryHeader
        filters={filters}
        recentSearches={filteredSearches}
        setFilteredSearches={updateFilters}
        title={totalResults + " results in history"}
        clearAll={removeFromHistory}
        handleCrescentEvent={handleCrescentEvent}
        handleSort={handleSort}
      />

      <Box p={1}>
        {filteredSearches?.map((search, index) => (
          <Item
            key={`recentSearch-${index}`}
            search={search}
            chipColors={facets_annotations_colors}
            index={index}
          />
        ))}
      </Box>
    </>
  )
};

export default History;