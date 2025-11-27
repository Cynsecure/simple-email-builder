import React from "react";
import { Paper, Box, Collapse, Stack, InputLabel } from "@mui/material";
import { HexColorInput, HexColorPicker } from "react-colorful";

// Constants
const BLOCK_TYPES = {
  TEXT: "Text",
  HEADING: "Heading",
  BUTTON: "Button",
  IMAGE: "Image",
  CONTAINER: "Container",
  COLUMNS_CONTAINER: "ColumnsContainer",
  SPACER: "Spacer",
  DIVIDER: "Divider",
  HTML: "Html",
} as const;

const COLOR_PICKER_TYPES = {
  TEXT: "TEXT",
  BACKGROUND: "BACKGROUND",
  BORDER: "BORDER",
} as const;

// Supported block types for each color picker
const SUPPORTED_BLOCKS = {
  [COLOR_PICKER_TYPES.TEXT]: [
    BLOCK_TYPES.TEXT,
    BLOCK_TYPES.HEADING,
    BLOCK_TYPES.BUTTON,
    BLOCK_TYPES.DIVIDER,
    BLOCK_TYPES.HTML,
  ],
  [COLOR_PICKER_TYPES.BACKGROUND]: [
    BLOCK_TYPES.TEXT,
    BLOCK_TYPES.HEADING,
    BLOCK_TYPES.BUTTON,
    BLOCK_TYPES.IMAGE,
    BLOCK_TYPES.CONTAINER,
    BLOCK_TYPES.COLUMNS_CONTAINER,
    BLOCK_TYPES.SPACER,
    BLOCK_TYPES.DIVIDER,
    BLOCK_TYPES.HTML,
  ],
  [COLOR_PICKER_TYPES.BORDER]: [BLOCK_TYPES.CONTAINER],
} as const;

interface ColorPickerPanelsProps {
  selectedBlock: any;
  keyboardHeight: number;
  showTextColorPicker: boolean;
  showBgColorPicker: boolean;
  showBorderColorPicker: boolean;
  handleTextColorChange: (color: string) => void;
  handleBackgroundColorChange: (color: string) => void;
  handleBorderColorChange: (color: string) => void;
  updateBlockProps: (newProps: any) => void;
}

// Color configuration for each picker type
interface ColorConfig {
  type: keyof typeof COLOR_PICKER_TYPES;
  label: string;
  getCurrentColor: (selectedBlock: any) => string;
  defaultColor: string;
  isVisible: (selectedBlock: any, showPicker: boolean) => boolean;
}

// Get color configurations
const getColorConfigs = (): Record<string, ColorConfig> => ({
  [COLOR_PICKER_TYPES.TEXT]: {
    type: COLOR_PICKER_TYPES.TEXT,
    label: "Text Color",
    getCurrentColor: (selectedBlock) => {
      if (selectedBlock?.type === BLOCK_TYPES.DIVIDER) {
        return selectedBlock?.data?.props?.lineColor || "#000000";
      }
      return selectedBlock?.data?.style?.color || "#000000";
    },
    defaultColor: "#000000",
    isVisible: (selectedBlock, showPicker) =>
      showPicker &&
      SUPPORTED_BLOCKS[COLOR_PICKER_TYPES.TEXT].includes(selectedBlock?.type),
  },
  [COLOR_PICKER_TYPES.BACKGROUND]: {
    type: COLOR_PICKER_TYPES.BACKGROUND,
    label: "Bg Color",
    getCurrentColor: (selectedBlock) => {
      const isBorderedButton =
        selectedBlock?.type === BLOCK_TYPES.BUTTON &&
        selectedBlock.data?.props?.variant === "bordered";

      if (isBorderedButton) {
        return selectedBlock?.data?.style?.borderColor || "#000000";
      }
      return selectedBlock?.data?.style?.backgroundColor || "#ffffff";
    },
    defaultColor: "#ffffff",
    isVisible: (selectedBlock, showPicker) =>
      showPicker &&
      SUPPORTED_BLOCKS[COLOR_PICKER_TYPES.BACKGROUND].includes(
        selectedBlock?.type
      ),
  },
  [COLOR_PICKER_TYPES.BORDER]: {
    type: COLOR_PICKER_TYPES.BORDER,
    label: "Border Color",
    getCurrentColor: (selectedBlock) =>
      selectedBlock?.data?.style?.borderColor || "#000000",
    defaultColor: "#000000",
    isVisible: (selectedBlock, showPicker) =>
      showPicker && selectedBlock?.type === BLOCK_TYPES.CONTAINER,
  },
});

// Get dynamic label for color picker
const getDynamicLabel = (config: ColorConfig, selectedBlock: any): string => {
  if (
    config.type === COLOR_PICKER_TYPES.TEXT &&
    selectedBlock?.type === BLOCK_TYPES.DIVIDER
  ) {
    return "Line Color";
  }

  if (config.type === COLOR_PICKER_TYPES.BACKGROUND) {
    const isBorderedButton =
      selectedBlock?.type === BLOCK_TYPES.BUTTON &&
      selectedBlock.data?.props?.variant === "bordered";
    return isBorderedButton ? "Border Color" : "Bg Color";
  }

  return config.label;
};

// Common styles for color picker panels
const getCommonStyles = (keyboardHeight: number) => ({
  paper: {
    position: "fixed" as const,
    bottom: 120 + keyboardHeight,
    left: 0,
    right: 0,
    bgcolor: "background.paper",
    borderTop: 1,
    borderColor: "divider",
    zIndex: (theme: any) => theme.zIndex.drawer,
    maxHeight: "40vh",
    height: "auto",
    overflow: "hidden",
    boxShadow: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  stack: {
    p: 1,
    ".react-colorful__pointer ": {
      width: 16,
      height: 16,
    },
    ".react-colorful__saturation": {
      mb: 1,
      borderRadius: "4px",
    },
    ".react-colorful__last-control": {
      borderRadius: "4px",
    },
    ".react-colorful__hue-pointer": {
      width: "4px",
      borderRadius: "4px",
      height: 24,
      cursor: "col-resize",
    },
    ".react-colorful__saturation-pointer": {
      cursor: "all-scroll",
    },
    input: {
      padding: 1,
      border: "1px solid",
      borderColor: "grey.300",
      borderRadius: "4px",
      width: "100%",
    },
  },
});

// Generic Color Picker Panel Component
interface ColorPickerPanelProps {
  config: ColorConfig;
  selectedBlock: any;
  keyboardHeight: number;
  isVisible: boolean;
  onChange: (color: string) => void;
}

function ColorPickerPanel({
  config,
  selectedBlock,
  keyboardHeight,
  isVisible,
  onChange,
}: ColorPickerPanelProps) {
  const styles = getCommonStyles(keyboardHeight);
  const currentColor = config.getCurrentColor(selectedBlock);
  const label = getDynamicLabel(config, selectedBlock);

  return (
    <Collapse in={isVisible}>
      <Paper sx={styles.paper}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 1 }}>
            <InputLabel>{label}</InputLabel>
          </Box>
          <Stack spacing={1} sx={styles.stack}>
            <HexColorPicker color={currentColor} onChange={onChange} />
            <Box pt={1}>
              <HexColorInput
                prefixed
                color={currentColor}
                onChange={onChange}
              />
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Collapse>
  );
}

// Exported Color Picker Panel Components
export function TextColorPickerPanel({
  selectedBlock,
  keyboardHeight,
  showTextColorPicker,
  handleTextColorChange,
}: ColorPickerPanelsProps) {
  const config = getColorConfigs()[COLOR_PICKER_TYPES.TEXT];

  return (
    <ColorPickerPanel
      config={config}
      selectedBlock={selectedBlock}
      keyboardHeight={keyboardHeight}
      isVisible={config.isVisible(selectedBlock, showTextColorPicker)}
      onChange={handleTextColorChange}
    />
  );
}

export function BackgroundColorPickerPanel({
  selectedBlock,
  keyboardHeight,
  showBgColorPicker,
  handleBackgroundColorChange,
}: ColorPickerPanelsProps) {
  const config = getColorConfigs()[COLOR_PICKER_TYPES.BACKGROUND];

  return (
    <ColorPickerPanel
      config={config}
      selectedBlock={selectedBlock}
      keyboardHeight={keyboardHeight}
      isVisible={config.isVisible(selectedBlock, showBgColorPicker)}
      onChange={handleBackgroundColorChange}
    />
  );
}

export function BorderColorPickerPanel({
  selectedBlock,
  keyboardHeight,
  showBorderColorPicker,
  handleBorderColorChange,
}: ColorPickerPanelsProps) {
  const config = getColorConfigs()[COLOR_PICKER_TYPES.BORDER];

  return (
    <ColorPickerPanel
      config={config}
      selectedBlock={selectedBlock}
      keyboardHeight={keyboardHeight}
      isVisible={config.isVisible(selectedBlock, showBorderColorPicker)}
      onChange={handleBorderColorChange}
    />
  );
}
