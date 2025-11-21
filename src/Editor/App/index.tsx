import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";

import { Box, Stack, useTheme, useMediaQuery } from "@mui/material";

import {
  resetDocument,
  useDocument,
  useInspectorDrawerOpen,
  useSelectedBlockId,
} from "../documents/editor/EditorContext";

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from "./InspectorDrawer";
import TemplatePanel from "./TemplatePanel";
import BottomBar from "./MobileToolbars/BottomBar";
import { Reader, renderToStaticMarkup } from "@usewaypoint/email-builder";
import { EditorProps } from "../types";
import html2canvas from "html2canvas";
import { TEditorConfiguration } from "../documents/editor/core";

// Helper function to convert editor document to reader-compatible format
function convertDocumentForReader(document: TEditorConfiguration) {
  const convertedDocument = { ...document };

  // Convert blocks to Html blocks for preview
  Object.keys(convertedDocument).forEach((blockId) => {
    const block = convertedDocument[blockId];

    // Convert heading levels h4, h5, h6 to h3 for reader compatibility
    if (block.type === "Heading" && block.data.props?.level) {
      const level = block.data.props.level;
      if (level === "h4" || level === "h5" || level === "h6") {
        convertedDocument[blockId] = {
          ...block,
          data: {
            ...block.data,
            props: {
              ...block.data.props,
              level: "h3" as const,
            },
          },
        };
      }
    }

    // Convert Button blocks to Html blocks for preview
    if (block.type === "Button") {
      const text = block.data.props?.text || "Click me";
      const url = block.data.props?.url || "www.creatorxg.com";
      const variant = block.data.props?.variant || "fill";
      const size = block.data.props?.size || "medium";
      const fullWidth = block.data.props?.fullWidth || false;
      const alignment = block.data.props?.alignment || "left";

      // Get styles
      const backgroundColor = block.data.style?.backgroundColor || "#007bff";
      const color = block.data.style?.color || "#ffffff";
      const fontFamily = block.data.style?.fontFamily || "Arial, sans-serif";
      const fontSize =
        block.data.style?.fontSize ||
        (size === "small" ? "14px" : size === "large" ? "18px" : "16px");
      const fontWeight = block.data.style?.fontWeight || "500";

      // Size-based padding
      const basePadding =
        size === "small"
          ? "8px 16px"
          : size === "large"
            ? "16px 32px"
            : "12px 24px";

      // Use size-based padding for button, not block style padding (that's used for margin)
      let buttonPadding = basePadding;

      // Calculate margin (configurable like padding)
      const baseMargin = { top: 4, bottom: 4, left: 8, right: 8 };
      let buttonMargin = baseMargin;

      // Use container padding from block style as margin if available
      if (block.data.style?.padding) {
        const p = block.data.style.padding;
        buttonMargin = {
          top: p.top || baseMargin.top,
          bottom: p.bottom || baseMargin.bottom,
          left: p.left || baseMargin.left,
          right: p.right || baseMargin.right,
        };
      }

      // Variant styles
      const buttonBackgroundColor =
        variant === "fill" ? backgroundColor : "transparent";
      const buttonColor = color; // Always use the text color
      const borderColor = block.data.style?.borderColor || backgroundColor;

      // Create button HTML optimized for email clients
      const borderStyle =
        variant === "bordered"
          ? `border: 2px solid ${borderColor};`
          : "border: none;";

      const buttonHtml = fullWidth
        ? `<div style="text-align: ${alignment}; width: 100%; margin: ${buttonMargin.top}px 0px ${buttonMargin.bottom}px 0px; padding: 0px ${buttonMargin.right}px;">
            <a href="${url}" style="text-decoration: none; display: block;">
              <div style="background-color: ${buttonBackgroundColor}; color: ${buttonColor}; ${borderStyle} border-radius: 6px; padding: ${buttonPadding}; font-size: ${fontSize}; font-family: ${fontFamily}; font-weight: ${fontWeight}; text-align: center; cursor: pointer; line-height: 1.2; box-sizing: border-box; width: 100%; display: block;">${text}</div>
            </a>
          </div>`
        : `<div style="text-align: ${alignment}; margin: ${buttonMargin.top}px ${buttonMargin.right}px ${buttonMargin.bottom}px ${buttonMargin.left}px;">
            <a href="${url}" style="text-decoration: none; display: inline-block;">
              <div style="background-color: ${buttonBackgroundColor}; color: ${buttonColor}; ${borderStyle} border-radius: 6px; padding: ${buttonPadding}; font-size: ${fontSize}; font-family: ${fontFamily}; font-weight: ${fontWeight}; text-align: center; cursor: pointer; line-height: 1.2; display: inline-block;">${text}</div>
            </a>
          </div>`;

      convertedDocument[blockId] = {
        ...block,
        type: "Html",
        data: {
          props: {
            contents: buttonHtml,
          },
          style: {}, // Remove all styles from container to prevent conflicts
        },
      };
    }
  });

  return convertedDocument as any;
}

function useDrawerTransition(
  cssProperty: "margin-left" | "margin-right",
  open: boolean
) {
  const { transitions } = useTheme();
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open
      ? transitions.duration.leavingScreen
      : transitions.duration.enteringScreen,
  });
}

export default function Editor({
  template,
  onChange,
  onFileUpload,
  onSnapshot,
  ...metadata
}: EditorProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const document = useDocument();
  const selectedBlockId = useSelectedBlockId();

  const marginRightTransition = useDrawerTransition(
    "margin-right",
    inspectorDrawerOpen
  );

  const [takingSnapshot, setTakingSnapshot] = React.useState(false);
  const snapshotRef = React.useRef<HTMLDivElement>(null);
  const [isMobilePopupOpen, setIsMobilePopupOpen] = React.useState(false);
  const mainContentRef = React.useRef<HTMLDivElement | null>(null);

  // Handle mobile popup state changes
  const handleMobilePopupStateChange = (isOpen: boolean) => {
    setIsMobilePopupOpen(isOpen);

    // Clean up document height when popup closes
    if (!isOpen) {
      window.document.body.style.minHeight = "auto";
    }
  };

  // Split view logic: scroll text editors into view when popup is open
  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const handleTextEditorScroll = () => {
      // Only scroll when popup is open
      if (!isMobilePopupOpen) {
        return;
      }

      // Find any active text editor (contentEditable indicating edit mode)
      const activeEditor = window.document.querySelector(
        '[contenteditable="true"]'
      ) as HTMLElement;

      if (activeEditor) {
        // Calculate the popup height (50vh) and toolbar height (60px)
        const popupHeight = window.innerHeight * 0.5;
        const toolbarHeight = 60;
        const totalBottomSpace = popupHeight + toolbarHeight;

        // Get editor position relative to viewport
        const editorRect = activeEditor.getBoundingClientRect();
        const editorBottom = editorRect.bottom;

        // Calculate available space above the popup
        const availableSpace = window.innerHeight - totalBottomSpace;

        // If editor extends into or below the popup area, scroll it up
        if (editorBottom > availableSpace) {
          // Calculate scroll needed for text editor with toolbar space
          const neededScroll = editorBottom - availableSpace + 20; // 20px for toolbar breathing room

          if (neededScroll > 0) {
            // Expand document for scrolling (will be cleaned up when popup closes)
            const newBodyHeight = Math.max(
              window.document.body.scrollHeight,
              window.innerHeight + neededScroll + 250 // Extra buffer for text editor
            );

            window.document.body.style.minHeight = newBodyHeight + "px";

            // Perform the scroll
            window.scrollBy({
              top: neededScroll,
              behavior: "smooth",
            });
          }
        }
      }
    };

    // Immediate check when popup state changes
    if (isMobilePopupOpen) {
      setTimeout(handleTextEditorScroll, 200); // Delay to ensure popup is rendered
    }

    // Listen for text editor focus events
    const observers: MutationObserver[] = [];

    // Check for new contentEditable elements being added/modified
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;

      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "contenteditable"
        ) {
          const target = mutation.target as HTMLElement;
          if (target.contentEditable === "true") {
            shouldCheck = true;
          }
        }

        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              const editableElements = element.querySelectorAll(
                '[contenteditable="true"]'
              );
              if (
                editableElements.length > 0 ||
                element.contentEditable === "true"
              ) {
                shouldCheck = true;
              }
            }
          });
        }
      });

      if (shouldCheck) {
        setTimeout(handleTextEditorScroll, 200);
      }
    });

    observer.observe(window.document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["contenteditable"],
    });

    observers.push(observer);

    // Also handle immediate focus events
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.contentEditable === "true") {
        setTimeout(handleTextEditorScroll, 200);
      }
    };

    // Handle click events on text elements to catch when they enter edit mode
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if clicked element or its parent might be a text block
      if (
        target &&
        (target.textContent || target.closest('[data-block-type="Text"]'))
      ) {
        setTimeout(handleTextEditorScroll, 300); // Longer delay for click->edit transition
      }
    };

    window.document.addEventListener("focusin", handleFocusIn);
    window.document.addEventListener("click", handleClick);

    return () => {
      observers.forEach((obs) => obs.disconnect());
      window.document.removeEventListener("focusin", handleFocusIn);
      window.document.removeEventListener("click", handleClick);
    };
  }, [isMobile, isMobilePopupOpen]);

  // Additional effect to handle block selection on mobile
  useEffect(() => {
    if (!isMobile || !isMobilePopupOpen || !selectedBlockId) {
      return;
    }

    // When a block is selected and popup is open, check if we need to scroll
    const checkScrollForSelectedBlock = () => {
      // Find the selected block using the data attribute
      const selectedBlockElement = window.document.querySelector(
        `[data-block-id="${selectedBlockId}"]`
      ) as HTMLElement;

      if (selectedBlockElement) {
        // Calculate popup dimensions
        const popupHeight = window.innerHeight * 0.5;
        const toolbarHeight = 60;
        const totalBottomSpace = popupHeight + toolbarHeight;

        // Get block position
        const blockRect = selectedBlockElement.getBoundingClientRect();
        const blockBottom = blockRect.bottom;

        // Calculate available space above popup
        const availableSpace = window.innerHeight - totalBottomSpace;

        // If block extends into popup area, scroll it up
        if (blockBottom > availableSpace) {
          // Calculate how much scroll is needed
          const neededScroll = blockBottom - availableSpace + 20; // 20px breathing room

          if (neededScroll > 0) {
            // Add scrollable space to document body (will be cleaned up when popup closes)
            const newBodyHeight = Math.max(
              window.document.body.scrollHeight,
              window.innerHeight + neededScroll + 200 // Extra buffer
            );

            window.document.body.style.minHeight = newBodyHeight + "px";

            // Perform the scroll
            window.scrollBy({
              top: neededScroll,
              behavior: "smooth",
            });
          }
        }
      }
    };

    // Delay to ensure block selection UI is updated
    const timeoutId = setTimeout(checkScrollForSelectedBlock, 300);

    return () => clearTimeout(timeoutId);
  }, [isMobile, isMobilePopupOpen, selectedBlockId]);

  const triggerSnapshot = () => {
    if (!onSnapshot) return;
    if (takingSnapshot) return;
    const snapshotElement = snapshotRef.current;
    if (!snapshotElement) return;

    setTakingSnapshot(true);
    html2canvas(snapshotElement, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: "white",
    })
      .then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `${Date.now()}-${uuid()}.png`, {
              type: "image/png",
            });

            onSnapshot?.(file);
          }

          setTakingSnapshot(false);
        }, "image/png");
      })
      .catch((e) => {
        console.error("Failed to take snapshot", e);
        setTakingSnapshot(false);
      });
  };

  useEffect(() => {
    if (template) {
      resetDocument(template);
    }
  }, [template]);

  useEffect(() => {
    if (onChange) {
      const convertedDocument = convertDocumentForReader(document);
      onChange({
        html: renderToStaticMarkup(convertedDocument, { rootBlockId: "root" }),
        design: document,
      });
    }
    triggerSnapshot();
  }, [document]);

  useEffect(() => {
    let interval: NodeJS.Timeout = null as any;
    if (onSnapshot) {
      interval = setInterval(() => {
        triggerSnapshot();
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [onSnapshot]);

  return (
    <>
      {/* Desktop Inspector Drawer - Hidden on mobile */}
      {!isMobile && (
        <InspectorDrawer metadata={metadata} onFileUpload={onFileUpload} />
      )}

      <Stack
        ref={mainContentRef}
        sx={{
          marginRight:
            !isMobile && inspectorDrawerOpen
              ? `${INSPECTOR_DRAWER_WIDTH}px`
              : 0,
          marginBottom: isMobile ? "100px" : 0, // Updated from 80px to 100px to match new bottom bar height
          padding: isMobile ? "8px" : 0, // Add some padding on mobile
          transition: [marginRightTransition].join(", "),
        }}
      >
        <TemplatePanel />
      </Stack>

      {/* Mobile Bottom Bar - Only on mobile */}
      {isMobile && (
        <BottomBar
          onFileUpload={onFileUpload}
          onPanelStateChange={handleMobilePopupStateChange}
        />
      )}

      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div ref={snapshotRef} style={{ width: "100%", maxWidth: 600 }}>
          <Reader
            document={convertDocumentForReader(document)}
            rootBlockId="root"
          />
        </div>
      </Box>
    </>
  );
}
