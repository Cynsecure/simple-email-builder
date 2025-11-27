import React from "react";
import { Paper, Box, Collapse } from "@mui/material";
import PaddingInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/PaddingInput";

interface PaddingPickerPanelsProps {
  selectedBlock: any;
  keyboardHeight: number;
  showPaddingPicker: boolean;
  updateBlockStyle: (newStyle: any) => void;
}

export function PaddingPickerPanel({
  selectedBlock,
  keyboardHeight,
  showPaddingPicker,
  updateBlockStyle,
}: PaddingPickerPanelsProps) {
  // Get current padding values
  const currentStyle = (selectedBlock?.data as any)?.style || {};
  const currentPadding = currentStyle.padding || null;

  const handlePaddingChange = (newPadding: any) => {
    updateBlockStyle({ padding: newPadding });
  };

  return (
    <Collapse
      in={
        showPaddingPicker &&
        [
          "Text",
          "Heading",
          "Button",
          "Container",
          "ColumnsContainer",
          "Html",
          "Image",
          "Avatar",
          "Divider",
        ].includes(selectedBlock?.type || "")
      }
    >
      <Paper
        sx={{
          position: "fixed",
          bottom: 120 + keyboardHeight,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
          zIndex: (theme) => theme.zIndex.drawer,
          maxHeight: "40vh",
          height: "auto",
          overflow: "hidden",
          boxShadow: 3,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Box sx={{ p: 2 }}>
          <PaddingInput
            label="Padding"
            defaultValue={currentPadding}
            onChange={handlePaddingChange}
          />
        </Box>
      </Paper>
    </Collapse>
  );
}
