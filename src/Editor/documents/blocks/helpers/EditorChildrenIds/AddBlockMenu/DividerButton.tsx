import React, { useEffect, useState } from "react";

import { AddOutlined } from "@mui/icons-material";
import { Fade, IconButton, useMediaQuery, useTheme } from "@mui/material";

import { useSelectedBlockId } from "../../../../editor/EditorContext";

type Props = {
  buttonElement: HTMLElement | null;
  onClick: () => void;
  isAfterSelectedBlock?: boolean;
  isBeforeSelectedBlock?: boolean;
  isLastBlock?: boolean;
};
export default function DividerButton({
  buttonElement,
  onClick,
  isAfterSelectedBlock,
  isBeforeSelectedBlock,
  isLastBlock,
}: Props) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  // Detect mobile devices using multiple methods
  const isMobileBreakpoint = useMediaQuery(theme.breakpoints.down("md"));
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const isMobile = isMobileBreakpoint || isTouchDevice;
  const selectedBlockId = useSelectedBlockId();

  useEffect(() => {
    // On mobile, show buttons more frequently for better UX
    if (isMobile) {
      // Show if it's the last block OR if this button is adjacent to the selected block
      const shouldShowOnMobile =
        isLastBlock ||
        (Boolean(selectedBlockId) &&
          (Boolean(isAfterSelectedBlock) || Boolean(isBeforeSelectedBlock)));
      setVisible(shouldShowOnMobile);
      return;
    }

    // Desktop hover behavior
    function listener({ clientX, clientY }: MouseEvent) {
      if (!buttonElement) {
        return;
      }
      const rect = buttonElement.getBoundingClientRect();
      const rectY = rect.y;
      const bottomX = rect.x;
      const topX = bottomX + rect.width;

      if (Math.abs(clientY - rectY) < 20) {
        if (bottomX < clientX && clientX < topX) {
          setVisible(true);
          return;
        }
      }
      setVisible(false);
    }
    window.addEventListener("mousemove", listener);
    return () => {
      window.removeEventListener("mousemove", listener);
    };
  }, [
    buttonElement,
    isMobile,
    isAfterSelectedBlock,
    isBeforeSelectedBlock,
    isLastBlock,
    selectedBlockId,
  ]);

  return (
    <Fade in={visible}>
      <IconButton
        size="small"
        sx={{
          p: 0.12,
          position: "absolute",
          top: "-12px",
          left: "50%",
          transform: "translateX(-10px)",
          bgcolor: "brand.blue",
          color: "primary.contrastText",
          zIndex: "fab",
          "&:hover, &:active, &:focus": {
            bgcolor: "brand.blue",
            color: "primary.contrastText",
          },
        }}
        onClick={(ev) => {
          ev.stopPropagation();
          onClick();
        }}
      >
        <AddOutlined fontSize="small" />
      </IconButton>
    </Fade>
  );
}
