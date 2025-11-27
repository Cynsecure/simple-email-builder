import React from "react";
import { Paper, Box, Collapse, InputLabel, ToggleButton } from "@mui/material";
import RadioGroupInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/RadioGroupInput";
import {
  setDocument,
  useSelectedBlockId,
} from "../../documents/editor/EditorContext";

interface ButtonVariantPickerPanelProps {
  selectedBlock: any;
  keyboardHeight: number;
  showButtonVariantPicker: boolean;
}

export function ButtonVariantPickerPanel({
  selectedBlock,
  keyboardHeight,
  showButtonVariantPicker,
}: ButtonVariantPickerPanelProps) {
  const selectedBlockId = useSelectedBlockId();

  if (!selectedBlock || selectedBlock.type !== "Button") {
    return null;
  }

  // Get current variant from block data
  const currentVariant = (selectedBlock.data as any)?.props?.variant || "fill";

  const handleVariantChange = (variant: string) => {
    if (!selectedBlock || !selectedBlockId || variant === currentVariant)
      return;

    const { data, type } = selectedBlock;
    const currentStyle = (data as any)?.style || {};

    // Determine text color based on variant
    let textColor = currentStyle.color;
    if (variant === "bordered") {
      textColor = "#000000"; // Black text for secondary
    } else if (variant === "fill") {
      textColor = "#ffffff"; // White text for primary
    }

    const updatedData = {
      ...data,
      props: {
        ...(data as any)?.props,
        variant,
      },
      style: {
        ...currentStyle,
        color: textColor,
      },
    } as any;

    setDocument({
      [selectedBlockId]: { type, data: updatedData },
    });
  };

  return (
    <Collapse in={showButtonVariantPicker}>
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: keyboardHeight + 120, // Above the toolbar
          left: 8,
          right: 8,
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
          <Box sx={{ mb: 1 }}>
            <InputLabel>Button Style</InputLabel>
          </Box>
          <RadioGroupInput
            label=""
            defaultValue={currentVariant}
            onChange={handleVariantChange}
          >
            <ToggleButton value="fill">Primary</ToggleButton>
            <ToggleButton value="bordered">Secondary</ToggleButton>
          </RadioGroupInput>
        </Box>
      </Paper>
    </Collapse>
  );
}
