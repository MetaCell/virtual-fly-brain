import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { getNeuroglasserState, hasNeuroglasserState } from '../utils/neuroglassStateConfig';

const NEUROGLASS_URL = import.meta.env.VITE_NEUROGLASS_URL || 'https://www.research.neuroglass.dev.metacell.us';

export default function NeuroglassViewer() {
  const [iframeSrc, setIframeSrc] = useState('');
  
  const focusedInstance = useSelector(state => state.instances?.focusedInstance);

  const iframeSrcUrl = useMemo(() => {
    if (!focusedInstance?.metadata?.Id) return '';

    // Priority 1: Predefined state for focused instance (if available)
    let stateToUse = null;
    if (hasNeuroglasserState(focusedInstance.metadata.Id)) {
      stateToUse = getNeuroglasserState(focusedInstance.metadata.Id);
    }
    // Priority 2: Default to template
    else {
      stateToUse = getNeuroglasserState('VFB_00101567');
    }

    if (!stateToUse) return '';

    const stateStr = JSON.stringify(stateToUse);
    return `${NEUROGLASS_URL}/new#!${stateStr}`;
  }, [focusedInstance?.metadata?.Id]);

  useEffect(() => {
    if (iframeSrcUrl) {
      setIframeSrc(iframeSrcUrl);
    }
  }, [iframeSrcUrl]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {iframeSrc ? (
        <Box sx={{ flex: 1, border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
          <iframe
            src={iframeSrc}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#000',
            }}
            title="Neuroglass Viewer"
            sandbox="allow-scripts allow-popups allow-forms"
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
