import React from "react";
import QueryHeader from "./QueryHeader";
import { Item } from "./HistoryItem";
import vars from "../../theme/variables";
import { Box } from "@mui/material";
import { getUpdatedTags } from "../../utils/utils";

const facets_annotations_colors = require("../configuration/VFBColors").facets_annotations_colors;

const History = ({recentSearches, totalResults}) => {

  return (
    <>
      <QueryHeader title={totalResults + " results in history"} />

      <Box p={1}>
        {recentSearches?.map((search, index) => (
          <Item
            key={`recentSearch-${index}`}
            search={search}
            chipColors={getUpdatedTags(facets_annotations_colors)}
            index={index}
          />
        )).reverse()}
      </Box>
    </>
  )
};

export default History;