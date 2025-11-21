import React, { useRef } from "react";
import { Paper, Box, Collapse } from "@mui/material";
import PanelContent from "./PanelContent";
import { EditorFileUploadCallback } from "../../types";

interface CollapsiblePanelProps {
  showPanel: boolean;
  keyboardHeight: number;
  activeTab: string;
  selectedBlock: any;
  hasSelectedBlock: boolean;
  updateBlockStyle: (newStyle: any) => void;
  updateBlockProps: (newProps: any) => void;
  onFileUpload?: EditorFileUploadCallback;
}

export default function CollapsiblePanel({
  showPanel,
  keyboardHeight,
  activeTab,
  selectedBlock,
  hasSelectedBlock,
  updateBlockStyle,
  updateBlockProps,
  onFileUpload,
}: CollapsiblePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <Collapse in={showPanel}>
      <Paper
        ref={panelRef}
        data-testid="collapsible-panel"
        sx={{
          position: "fixed",
          bottom: 120 + keyboardHeight,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
          zIndex: (theme) => theme.zIndex.drawer,
          maxHeight: "50vh",
          minHeight: "200px",
          height: "auto",
          overflow: "hidden",
          boxShadow: 3,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        {/* Drag Handle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 1,
            pb: 0.5,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              backgroundColor: "divider",
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Panel Content */}
        <Box
          sx={{
            p: 2,
            maxHeight: "calc(50vh - 24px)",
            minHeight: "176px",
            overflow: "auto",
          }}
        >
          <PanelContent
            activeTab={activeTab}
            selectedBlock={selectedBlock}
            hasSelectedBlock={hasSelectedBlock}
            updateBlockStyle={updateBlockStyle}
            updateBlockProps={updateBlockProps}
            onFileUpload={onFileUpload}
          />
        </Box>
      </Paper>
    </Collapse>
  );
}
