import React, { useEffect } from "react";
import * as htmlToImage from "html-to-image";

const VFBSnapshot = ({ open, setBottomNav }) => {
  useEffect(() => {
    if (!open) return;

    // screenshot flash effect
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.left = 0;
    flash.style.top = 0;
    flash.style.width = "100vw";
    flash.style.height = "100vh";
    flash.style.background = "white";
    flash.style.opacity = "0.7";
    flash.style.zIndex = "2147483647";
    flash.style.pointerEvents = "none";
    flash.style.transition = "opacity 100ms";
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.style.opacity = "0";
      setTimeout(() => { document.body.removeChild(flash); }, 120);
    }, 100);

    // Hide scrollbars and remove container max-height/overflow for all scrollable area
    const selectors = [
      ".MuiBox-root",
      ".MuiPaper-root",
      ".scrollable",
      ".vfb-scrollable",
      ".subheader-content",
      ".VFBMainPanel",
    ];
    const containers = Array.from(document.querySelectorAll(selectors.join(',')));

    // Save previous styles so we can restore exactly
    const previousStyles = containers.map(el => ({
      el,
      overflow: el.style.overflow,
      overflowX: el.style.overflowX,
      overflowY: el.style.overflowY,
      maxHeight: el.style.maxHeight,
      maxWidth: el.style.maxWidth,
    }));

    // Apply snapshot styles (no overflow, no artificial maxHeight/Width)
    containers.forEach(el => {
      el.style.overflow = "visible";
      el.style.overflowX = "visible";
      el.style.overflowY = "visible";
      el.style.maxHeight = "unset";
      el.style.maxWidth = "unset";
    });

    (async () => {
      try {
        const el = document.getElementById('root') || document.body;
        const dataUrl = await htmlToImage.toPng(el, { cacheBust: true });
        const link = document.createElement("a");
        link.download = "vfb-snapshot.png";
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("[VFBSnapshot] Error capturing snapshot:", err);
      }

      // Restore overflow/maxHeight styles
      previousStyles.forEach(({ el, overflow, overflowX, overflowY, maxHeight, maxWidth }) => {
        el.style.overflow = overflow;
        el.style.overflowX = overflowX;
        el.style.overflowY = overflowY;
        el.style.maxHeight = maxHeight;
        el.style.maxWidth = maxWidth;
      });

      setBottomNav(undefined);
    })();

    return () => {
      previousStyles.forEach(({ el, overflow, overflowX, overflowY, maxHeight, maxWidth }) => {
        el.style.overflow = overflow;
        el.style.overflowX = overflowX;
        el.style.overflowY = overflowY;
        el.style.maxHeight = maxHeight;
        el.style.maxWidth = maxWidth;
      });
    };

  }, [open, setBottomNav]);

  return null;
};

export default VFBSnapshot;