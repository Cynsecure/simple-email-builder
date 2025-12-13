import React, { useState } from "react";

import {
  MonitorOutlined,
  PhoneIphoneOutlined,
  DownloadOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  SxProps,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { Reader, renderToStaticMarkup } from "@usewaypoint/email-builder";

import EditorBlock from "../../documents/editor/EditorBlock";
import {
  setSelectedScreenSize,
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
} from "../../documents/editor/EditorContext";
import ToggleInspectorPanelButton from "../InspectorDrawer/ToggleInspectorPanelButton";
import { TEditorConfiguration } from "../../documents/editor/core";

import MainTabsGroup from "./MainTabsGroup";

// Helper function to convert editor document to reader-compatible format
function convertDocumentForReader(document: TEditorConfiguration) {
  const convertedDocument = { ...document };

  // Convert blocks to Html blocks for preview
  Object.keys(convertedDocument).forEach((blockId) => {
    const block = convertedDocument[blockId];

    // Convert Heading blocks to Html blocks for preview
    if (block.type === "Heading") {
      const content = block.data.props?.text || "";
      const level = block.data.props?.level || "h2";
      const wrappedContent = `<${level}>${content}</${level}>`;

      convertedDocument[blockId] = {
        ...block,
        type: "Html",
        data: {
          ...block.data,
          props: {
            contents: wrappedContent,
          },
        },
      };
    }

    // Convert Text blocks to Html blocks for preview
    if (block.type === "Text") {
      const content = block.data.props?.richText || "";
      convertedDocument[blockId] = {
        ...block,
        type: "Html",
        data: {
          ...block.data,
          props: {
            contents: content,
          },
        },
      };
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

export default function TemplatePanel() {
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();
  const [htmlModalOpen, setHtmlModalOpen] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState("");

  const generateHtml = () => {
    const convertedDocument = convertDocumentForReader(document);
    const html = renderToStaticMarkup(convertedDocument, {
      rootBlockId: "root",
    });
    setGeneratedHtml(html);
    setHtmlModalOpen(true);
  };

  let mainBoxSx: SxProps = {
    height: "100%",
  };
  if (selectedScreenSize === "mobile") {
    mainBoxSx = {
      ...mainBoxSx,
      margin: "32px auto",
      width: 370,
      height: 800,
      boxShadow:
        "rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px",
    };
  }

  const handleScreenSizeChange = (_: unknown, value: unknown) => {
    switch (value) {
      case "mobile":
      case "desktop":
        setSelectedScreenSize(value);
        return;
      default:
        setSelectedScreenSize("desktop");
    }
  };

  const renderMainPanel = () => {
    switch (selectedMainTab) {
      case "editor":
        return (
          <Box sx={mainBoxSx}>
            <EditorBlock id="root" />
          </Box>
        );
      case "preview":
        return (
          <Box sx={mainBoxSx}>
            <Reader
              document={convertDocumentForReader(document)}
              rootBlockId="root"
            />
          </Box>
        );
    }
  };

  return (
    <>
      <Stack
        sx={{
          height: { xs: 80, md: 49 }, // 80px on mobile, 49px on desktop
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "white",
          position: { xs: "fixed", md: "sticky" }, // Fixed on mobile, sticky on desktop
          top: 0,
          left: { xs: 0, md: "auto" }, // Full width on mobile
          right: { xs: 0, md: "auto" }, // Full width on mobile
          zIndex: "appBar",
          px: 1,
          py: { xs: 2, md: 0 }, // Padding only on mobile
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack
          px={2}
          direction="row"
          gap={2}
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: { xs: 1, sm: 2 }, // Less padding on mobile
          }}
        >
          <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
            <MainTabsGroup />
          </Stack>
          <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
            <Button
              onClick={generateHtml}
              size="small"
              startIcon={<DownloadOutlined fontSize="small" />}
              variant="outlined"
              sx={{
                minWidth: { xs: "auto", sm: "auto" },
                px: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ display: { xs: "none", sm: "block" } }}>Export</Box>
            </Button>
            <ToggleButtonGroup
              value={selectedScreenSize}
              exclusive
              size="small"
              onChange={handleScreenSizeChange}
            >
              <ToggleButton value="desktop">
                <Tooltip title="Desktop view">
                  <MonitorOutlined fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="mobile">
                <Tooltip title="Mobile view">
                  <PhoneIphoneOutlined fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
        <ToggleInspectorPanelButton />
      </Stack>
      <Box
        sx={{
          height: {
            xs: "100%", // Full height on mobile (fixed header doesn't take space)
            // md: "calc(100vh - 49px)", // Desktop: subtract 49px toolbar height
            md: "100%",
          },
          pt: { xs: "80px", md: 0 }, // Add top padding on mobile for fixed header
          overflow: "auto",
          minWidth: { xs: "100%", sm: 370 }, // Full width on mobile, 370px minimum on larger screens
        }}
      >
        {renderMainPanel()}
        <Box height={{xs: 400, md: 90}} />
      </Box>

      {/* HTML Export Modal */}
      <Dialog
        open={htmlModalOpen}
        onClose={() => setHtmlModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Exported HTML</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={20}
            value={generatedHtml}
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { fontFamily: "monospace", fontSize: "12px" },
            }}
            helperText="Copy the HTML code above to use in your email client"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHtmlModalOpen(false)}>Close</Button>
          <Button
            onClick={() => navigator.clipboard.writeText(generatedHtml)}
            variant="contained"
          >
            Copy to Clipboard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
