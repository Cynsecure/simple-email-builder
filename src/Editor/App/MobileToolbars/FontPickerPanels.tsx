import React from "react";
import { Paper, Box, Collapse, InputLabel, ToggleButton } from "@mui/material";
import { FormatSize } from "@mui/icons-material";
import RadioGroupInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/RadioGroupInput";
import SliderInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/SliderInput";
import { FONT_FAMILIES } from "../../documents/blocks/helpers/fontFamily";

interface FontPickerPanelsProps {
  selectedBlock: any;
  keyboardHeight: number;
  showFontSizePicker: boolean;
  showFontFamilyPicker: boolean;
  updateBlockStyle: (newStyle: any) => void;
}

export function FontSizePickerPanel({
  selectedBlock,
  keyboardHeight,
  showFontSizePicker,
  updateBlockStyle,
}: FontPickerPanelsProps) {
  // Convert fontSize from string (e.g., "16px") or number (e.g., 16) to number
  const getCurrentFontSize = () => {
    const fontSize = (selectedBlock?.data as any)?.style?.fontSize || "16px";

    // Handle both string and number values
    if (typeof fontSize === "number") {
      return fontSize;
    }

    if (typeof fontSize === "string") {
      return parseInt(fontSize.replace("px", ""), 10);
    }

    // Fallback
    return 16;
  };

  return (
    <Collapse
      in={
        showFontSizePicker &&
        ["Text", "Button", "Html"].includes(selectedBlock?.type || "")
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
          <SliderInput
            label="Font Size"
            iconLabel={<FormatSize sx={{ color: "text.secondary" }} />}
            units="px"
            step={1}
            min={8}
            max={72}
            defaultValue={getCurrentFontSize()}
            onChange={(size) => {
              updateBlockStyle({ fontSize: `${size}px` });
            }}
          />
        </Box>
      </Paper>
    </Collapse>
  );
}

export function FontFamilyPickerPanel({
  selectedBlock,
  keyboardHeight,
  showFontFamilyPicker,
  updateBlockStyle,
}: FontPickerPanelsProps) {
  return (
    <Collapse
      in={
        showFontFamilyPicker &&
        ["Text", "Heading", "Button", "Html"].includes(
          selectedBlock?.type || ""
        )
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
          <Box sx={{ mb: 1 }}>
            <InputLabel>Font Family</InputLabel>
          </Box>
          <Box sx={{ mb: 2 }}>
            <RadioGroupInput
              label=""
              defaultValue={
                (selectedBlock?.data as any)?.style?.fontFamily ||
                FONT_FAMILIES[0].value
              }
              onChange={(fontFamily) => {
                updateBlockStyle({ fontFamily });
              }}
            >
              {FONT_FAMILIES.map((font) => (
                <ToggleButton key={font.key} value={font.value}>
                  {font.label}
                </ToggleButton>
              ))}
            </RadioGroupInput>
          </Box>
        </Box>
      </Paper>
    </Collapse>
  );
}
