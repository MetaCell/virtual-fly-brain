import React, { useEffect } from "react";
import * as htmlToImage from "html-to-image";

const VFBSnapshot = ({ open, setBottomNav }) => {
  useEffect(() => {
    if (!open) return;
    // Flash effect
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
      setBottomNav(undefined);
    })();
  }, [open, setBottomNav]);

  return null;
};

export default VFBSnapshot;