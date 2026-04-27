import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { buildNeuroglassState, resolveNeuroglassLayout } from '../utils/neuroglassStateConfig';

const NEUROGLASS_URL = import.meta.env.NEUROGLASS_URL ?? '';

export default function NeuroglassViewer() {
  const [debouncedSrc, setDebouncedSrc] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');

  const allLoadedInstances = useSelector(state => state.instances?.allLoadedInstances);
  const focusedInstance    = useSelector(state => state.instances?.focusedInstance);
  const neuroglassView     = useSelector(state => state.globalInfo?.neuroglassView);

  const theme    = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    let cancelled = false;

    async function buildSrc() {
      const layout = resolveNeuroglassLayout(neuroglassView, isMobile);

      const state = await buildNeuroglassState(
        allLoadedInstances,
        focusedInstance?.metadata?.Id,
        layout,
      );

      if (cancelled) return;

      if (!state || !NEUROGLASS_URL) {
        setIframeSrc('');
        return;
      }

      setIframeSrc(
        `${NEUROGLASS_URL}/embed#!${encodeURIComponent(JSON.stringify(state))}`
      );
    }

    buildSrc();

    return () => {
      cancelled = true;
    };
  }, [allLoadedInstances, focusedInstance?.metadata?.Id, neuroglassView, isMobile]);

  useEffect(() => {
    if (!iframeSrc) {
      setDebouncedSrc('');
      return;
    } 
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
          <Typography color="textSecondary">
             {!allLoadedInstances || allLoadedInstances.length === 0
                 ? 'No layers selected to display in the Neuroglass viewer.'
                 : 'Loading Neuroglass viewer...'}
           </Typography>
        </Box>
      )}
    </Box>
  );
}
