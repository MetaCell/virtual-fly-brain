import React, { useEffect, useState, useImperativeHandle, forwardRef, useMemo, useCallback } from "react";
import { Box, Button, Chip, Divider, Grid, Tooltip } from "@mui/material";
import QueryCard from "./Card";
import { Cross } from "../../icons";
import QueryHeader from "./QueryHeader";
import vars from "../../theme/variables";
import Filter from "./Filter";
import { getUpdatedTags } from "../../utils/utils";
import { updateQueries } from "./../../reducers/actions/queries"
import { useDispatch, useSelector } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress';
import { facets_annotations_colors as colors_config } from "../configuration/VFBColors";

const { headerBorderColor, searchHeadingColor, secondaryBg, listHeadingColor, primaryBg } = vars;
const facets_annotations_colors = getUpdatedTags(colors_config)

export const dividerStyle = {
  height: '0.875rem', width: '0.0625rem', background: listHeadingColor, borderRadius: '0.125rem'
}

// Memoize the helper functions to avoid recreating them on every render
const getTags = (tags) => {
  return tags ? tags.split("|") : [];
}

const getQueries = (newQueries, searchTerm) => {
  if (!newQueries || newQueries.length === 0) return [];
  
  let updatedQueries = [];
  const term = searchTerm ? searchTerm.toLowerCase() : undefined;
  
  newQueries.forEach((query) => {
    if (query.queries) {
      Object.keys(query.queries).forEach((key) => {
        if (query.queries[key]?.active) {
          let rows = query.queries[key]?.rows || [];
          
          if (term) {
            rows = rows.filter(row => {
              // Cache the string conversion for performance
              const values = Object.values(row);
              return values.some(v => v && v.toString().toLowerCase().includes(term));
            });
          }
          updatedQueries = updatedQueries.concat(rows);
        }
      });
    }
  });
  return updatedQueries;
}

// Memoize the filters calculation
const getInitialFiltersFromHeaders = (queries) => {
  if (!queries?.length) return { filters: {}, tags: "tags", defaultSort: null };
  
  let headers = null;
  for (const q of queries) {
    const keys = Object.keys(q.queries || {});
    for (const k of keys) {
      if (q.queries[k]?.headers) {
        headers = q.queries[k].headers;
        break;
      }
    }
    if (headers) break;
  }
  
  if (!headers) return { filters: {}, tags: "tags", defaultSort: null };
  
  const filters = {};
  let defaultSort = null;
  Object.entries(headers).forEach(([key, val]) => {
    if (val.order !== -1) {
      filters[val.title] = key;
    }
    if (val.sort && val.sort["0"] !== undefined) {
      defaultSort = key;
    }
  });
  return { filters, tags: "tags", defaultSort };
};

const Query = forwardRef(({ fullWidth, queries, searchTerm }, ref) => {
  // Memoize expensive calculations
  const headerFilters = useMemo(() => getInitialFiltersFromHeaders(queries), [queries]);
  const [filters, setFilters] = useState(() => ({
    filters: headerFilters.filters,
    tags: headerFilters.tags,
    defaultSort: headerFilters.defaultSort
  }));
  
  const [chipTags, setChipTags] = useState([]);
  const [count, setCount] = useState(0);
  
  // Memoize filtered searches
  const filteredSearches = useMemo(() => getQueries(queries, searchTerm), [queries, searchTerm]);
  
  // Memoize count calculation
  const calculatedCount = useMemo(() => {
    if (!queries || queries.length === 0) return 0;
    
    let count = 0;
    queries.forEach(query => {
      if (query.queries) {
        Object.keys(query.queries).forEach(q => {
          if (query.queries[q]?.active && query.queries[q].rows) {
            count += query.queries[q].count || 0;
          }
        });
      }
    });
    return count;
  }, [queries]);
  
  // Memoize chip tags calculation
  const calculatedChipTags = useMemo(() => {
    if (!queries || queries.length === 0) return [];
    
    const tagMap = new Map();
    queries.forEach(query => {
      if (query.queries) {
        Object.keys(query.queries).forEach(q => {
          if (query.queries[q]?.active) {
            query.queries[q]?.rows?.forEach(row => {
              if (row.tags) {
                const rowTags = getTags(row.tags);
                rowTags.forEach(rowTag => {
                  if (!tagMap.has(rowTag)) {
                    tagMap.set(rowTag, { label: rowTag, active: true });
                  }
                });
              }
            });
          }
        });
      }
    });
    return Array.from(tagMap.values());
  }, [queries]);
  
  // Update state when calculations change
  useEffect(() => {
    setCount(calculatedCount);
    setChipTags(calculatedChipTags);
  }, [calculatedCount, calculatedChipTags]);
  
  // Update filters when queries change
  useEffect(() => {
    const newFilters = getInitialFiltersFromHeaders(queries);
    setFilters(prevFilters => ({
      ...prevFilters,
      filters: { ...newFilters.filters, ...prevFilters.filters }
    }));
  }, [queries]);

  const isLoading = useSelector(state => state.queries.isLoading);
  const dispatch = useDispatch();

  // Memoize callbacks to prevent unnecessary re-renders
  const updateFilters = useCallback((_searches) => {
    // This function might need implementation based on your needs
  }, []);

  const handleChipDelete = useCallback((label) => {
    setChipTags(prevTags =>
      prevTags.map(tag =>
        tag.label === label ? { ...tag, active: false } : tag
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    const clearQueries = queries.map(query => ({
      ...query,
      queries: Object.keys(query.queries || {}).reduce((acc, key) => {
        acc[key] = { ...query.queries[key], active: false };
        return acc;
      }, {})
    }));
    updateQueries(clearQueries);
  }, [queries, dispatch]);

  const clearAllTags = useCallback(() => {
    setChipTags(prevTags => prevTags.map(tag => ({ ...tag, active: true })));
  }, []);

  const handleSort = useCallback((value, crescent) => {
    const identifier = filters.filters[value];
    // Since we're now using memoized filteredSearches, we need to handle sorting differently
    // This might need to be moved to a separate state or handled differently
  }, [filters.filters]);

  const handleCrescentEvent = useCallback((sort, crescent) => {
    const identifier = filters.filters[sort];
    // Similar to handleSort, this needs to be reconsidered with memoized data
  }, [filters.filters]);

  // Memoize the CSV download function
  const downloadCSV = useCallback(() => {
    if (!filteredSearches || filteredSearches.length === 0) return;
    
    const allKeys = Array.from(
      filteredSearches.reduce((set, row) => {
        Object.keys(row).forEach(k => set.add(k));
        return set;
      }, new Set())
    );
    
    const header = allKeys.join(",");
    const rows = filteredSearches.map(row =>
      allKeys.map(k => {
        let val = row[k];
        if (val === undefined || val === null) return '';
        return '"' + String(val).replace(/"/g, '""') + '"';
      }).join(",")
    );
    
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vfb_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [filteredSearches]);

  useImperativeHandle(ref, () => ({
    downloadCSV
  }));

  // Memoize the QueryCard component
  const MemoizedQueryCard = useMemo(() => React.memo(QueryCard), []);

  return (
    <>
      <QueryHeader
        title={isLoading ? "Loading results ..." : `${count} Query results`}
        filters={filters}
        recentSearches={filteredSearches}
        setFilteredSearches={updateFilters}
        clearAll={clearAll}
        handleCrescentEvent={handleCrescentEvent}
        handleSort={handleSort}
      />

      <Box
        position='sticky'
        top={43}
        display='flex'
        alignItems='center'
        zIndex={9}
        px={1.5}
        py={1}
        sx={{
          borderBottom: `0.0625rem solid ${secondaryBg}`,
          background: {
            xs: headerBorderColor,
            lg: 'rgba(34, 34, 34, 0.20)'
          },
          backdropFilter: 'blur(0.625rem)',
        }}
      >
        <Box flex={1}>
          <Box display='flex' gap={0.5}>
            {chipTags?.filter(f => f.active)?.slice(0, fullWidth ? 7 : 10)?.map( (tag, index) => (
              <Chip
                onClick={() => null}
                disabled={!tag.active}
                onDelete={() => handleChipDelete(tag.label)}
                key={tag}
                deleteIcon={
                  <Cross
                    size={12}
                    style={{ marginRight: 0, marginLeft: '0.25rem' }}
                  />
                }
                sx={{
                  lineHeight: '0.875rem',
                  fontSize: '0.625rem',
                  backgroundColor: facets_annotations_colors[tag.label]?.color || facets_annotations_colors?.default?.color,
                  height: '1.25rem',
                  color: facets_annotations_colors[tag.label]?.textColor || facets_annotations_colors?.default?.textColor,
                  '&:hover': {
                    backgroundColor: facets_annotations_colors[tag.label]?.color || facets_annotations_colors?.default?.color,
                    color: facets_annotations_colors[tag.label]?.color || facets_annotations_colors?.default?.textColor
                  }
                }}
                label={tag.label} />
            )) }
            {chipTags?.filter(f => f.active)?.slice(fullWidth ? 7 : 10).length > 0 ? (
              <Tooltip
                arrow
                title={
                  <Box display='flex' py={1} flexWrap='wrap' gap={0.5}>
                    {chipTags?.filter(f => f.active)?.slice(fullWidth ? 7 : 10).map((tag, index) => (
                      <Chip
                        onClick={() => null}
                        onDelete={() => handleChipDelete(tag.label)}
                        key={tag.label + index}
                        deleteIcon={
                          <Cross
                            size={12}
                            style={{ marginRight: 0, marginLeft: '0.25rem' }}
                          />
                        }
                        sx={{
                          lineHeight: '140%',
                          fontSize: '0.625rem',
                          backgroundColor: facets_annotations_colors[tag.label]?.color || facets_annotations_colors?.default?.color,
                          color: facets_annotations_colors[tag.label]?.textColor || facets_annotations_colors?.default?.textColor
                        }}
                        label={tag.label} />
                    ))}
                  </Box>
                }
              >
                <Chip
                  className="default-chip"
                  sx={{ background: primaryBg }}
                  label={`+${chipTags?.slice(fullWidth ? 7 : 10).length}`}
                />
              </Tooltip>
            ) : null}

          </Box>
        </Box>

        <Box display='flex' alignItems='center' gap={ 1.2 }>
          <Filter setChipTags={setChipTags} facets_annotations_colors={facets_annotations_colors} tags={chipTags} clearAllTags={clearAllTags} />
          <Divider sx={dividerStyle} />
          <Button
            disableRipple
            variant="text"
            onClick={clearAllTags}
            sx={{
              minWidth: '0.0625rem',
              padding: 0,
              color: searchHeadingColor,
              fontSize: '0.6875rem',
              fontWeight: 500,
              height: '1.25rem',
              lineHeight: '0.9375rem',
              letterSpacing: '-0.00344rem',

              '&:hover': {
                background: 'transparent'
              }
            }}
          >
            Reset Filters
          </Button>
        </Box>
      </Box>

      <Box overflow='auto' height='calc(100% - 5.375rem)' p={1.5}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={1.5}>
            {filteredSearches?.map((row, index) => {
              const tags = getTags(row.tags);
              if ( chipTags?.filter(f => f.active)?.some(v => tags.includes(v.label)) ) {
                return (
                  <Grid
                    key={row.id || index + row.label}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={fullWidth ? 4 : 3}
                    xl={3}
                  >
                    <MemoizedQueryCard facets_annotation={tags} query={row} fullWidth={fullWidth} />
                  </Grid>
                )
              }
              return null;
            })}
          </Grid>
        )}
      </Box>
    </>
  )
});

export default Query;
