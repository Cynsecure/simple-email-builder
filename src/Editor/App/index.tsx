import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";

import { Box, Stack, useTheme } from "@mui/material";

import {
  resetDocument,
  useDocument,
  useInspectorDrawerOpen,
} from "../documents/editor/EditorContext";

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from "./InspectorDrawer";
import TemplatePanel from "./TemplatePanel";
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
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const document = useDocument();

  const marginRightTransition = useDrawerTransition(
    "margin-right",
    inspectorDrawerOpen
  );

  const [takingSnapshot, setTakingSnapshot] = React.useState(false);
  const snapshotRef = React.useRef<HTMLDivElement>(null);

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
      <InspectorDrawer metadata={metadata} onFileUpload={onFileUpload} />

      <Stack
        sx={{
          marginRight: inspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
          transition: [marginRightTransition].join(", "),
        }}
      >
        <TemplatePanel />
      </Stack>
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
