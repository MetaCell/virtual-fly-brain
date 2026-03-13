import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { buildNeuroglassState, resolveNeuroglassLayout } from '../utils/neuroglassStateConfig';

const NEUROGLASS_URL = import.meta.env.VITE_NEUROGLASS_URL || 'https://www.research.neuroglass.dev.metacell.us';

export default function NeuroglassViewer() {
  const [debouncedSrc, setDebouncedSrc] = useState('');

  const allLoadedInstances = useSelector(state => state.instances?.allLoadedInstances);
  const focusedInstance    = useSelector(state => state.instances?.focusedInstance);
  const neuroglassView     = useSelector(state => state.globalInfo?.neuroglassView);

  const theme    = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('lg'));

  // Rebuilds whenever instances, focused item, layout preference, or viewport size changes.
  const iframeSrc = useMemo(() => {
    const layout = resolveNeuroglassLayout(neuroglassView, isMobile);
    const state  = buildNeuroglassState(
      allLoadedInstances,
      focusedInstance?.metadata?.Id,
      layout,
    );
    if (!state) return '';
    return `${NEUROGLASS_URL}/new#!${encodeURIComponent(JSON.stringify(state))}`;
  }, [allLoadedInstances, focusedInstance, neuroglassView, isMobile]);

  useEffect(() => {
    if (!iframeSrc) return;
    const t = setTimeout(() => setDebouncedSrc(iframeSrc), 300);
    return () => clearTimeout(t);
  }, [iframeSrc]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {debouncedSrc ? (
        <Box sx={{ flex: 1, border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
          <iframe
            src={debouncedSrc}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#000',
            }}
            title="Neuroglass Viewer"
            allow="accelerometer; camera; gyroscope; microphone; web-share"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </Box>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
          <Typography color="textSecondary">Loading Neuroglass viewer...</Typography>
        </Box>
      )}
    </Box>
  );
}
