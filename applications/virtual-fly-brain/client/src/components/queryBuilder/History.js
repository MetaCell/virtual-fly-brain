import React from "react";
import QueryHeader from "./QueryHeader";
import { Item } from "./HistoryItem";
import vars from "../../theme/variables";
import { Box } from "@mui/material";
import { useSelector } from 'react-redux'

const facets_annotations_colors = require("../configuration/VFBColors").facets_annotations_colors;

const History = ({recentSearches}) => {

  return (
    <>
      <QueryHeader title={recentSearches?.length + " results in history"} />

      <Box p={1}>
        {recentSearches?.map((search, index) => (
          <Item
            key={`recentSearch-${index}`}
            search={search}
            chipColors={facets_annotations_colors}
            index={index}
          />
        )).reverse()}
      </Box>
    </>
  )
};

export default History;