import React from "react";
import { Box, ToggleButton } from "@mui/material";
import RadioGroupInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/RadioGroupInput";
import MultiStylePropertyPanel from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/style-inputs/MultiStylePropertyPanel";

interface TextHeadingComponentsProps {
  selectedBlock: any;
  updateBlockStyle: (newStyle: any) => void;
  updateBlockProps: (newProps: any) => void;
}

export function TextColorSettings({
  selectedBlock,
  updateBlockStyle,
}: TextHeadingComponentsProps) {
  if (!selectedBlock || !["Text", "Heading"].includes(selectedBlock.type)) {
    return null;
  }

  return (
    <>
      {/* Heading Color Settings - text and background */}
      {selectedBlock.type === "Heading" && (
        <MultiStylePropertyPanel
          names={["color", "backgroundColor"]}
          value={(selectedBlock.data as any)?.style || {}}
          onChange={updateBlockStyle}
        />
      )}

      {/* Text Color Settings - text and background */}
      {selectedBlock.type === "Text" && (
        <MultiStylePropertyPanel
          names={["color", "backgroundColor"]}
          value={(selectedBlock.data as any)?.style || {}}
          onChange={updateBlockStyle}
        />
      )}
    </>
  );
}

export function TextFontSettings({
  selectedBlock,
  updateBlockStyle,
  updateBlockProps,
}: TextHeadingComponentsProps) {
  if (!selectedBlock || !["Text", "Heading"].includes(selectedBlock.type)) {
    return null;
  }

  return (
    <>
      {/* Heading Font Settings - heading level, font family, font weight */}
      {selectedBlock.type === "Heading" && (
        <>
          <Box sx={{ mb: 2 }}>
            <RadioGroupInput
              label="Heading Level"
              defaultValue={(selectedBlock.data as any)?.props?.level || "h2"}
              onChange={(level) => {
                updateBlockProps({ level });
              }}
            >
              <ToggleButton value="h1">H1</ToggleButton>
              <ToggleButton value="h2">H2</ToggleButton>
              <ToggleButton value="h3">H3</ToggleButton>
            </RadioGroupInput>
          </Box>
          <MultiStylePropertyPanel
            names={["fontFamily", "fontWeight"]}
            value={(selectedBlock.data as any)?.style || {}}
            onChange={updateBlockStyle}
          />
        </>
      )}

      {/* Text Font Settings - font family, font weight, font size */}
      {selectedBlock.type === "Text" && (
        <MultiStylePropertyPanel
          names={["fontFamily", "fontWeight", "fontSize"]}
          value={(selectedBlock.data as any)?.style || {}}
          onChange={updateBlockStyle}
        />
      )}
    </>
  );
}

export function TextAlignmentSettings({
  selectedBlock,
  updateBlockStyle,
}: Omit<TextHeadingComponentsProps, "updateBlockProps">) {
  if (!selectedBlock || !["Text", "Heading"].includes(selectedBlock.type)) {
    return null;
  }

  return (
    <MultiStylePropertyPanel
      names={["textAlign"]}
      value={(selectedBlock.data as any)?.style || {}}
      onChange={updateBlockStyle}
    />
  );
}
