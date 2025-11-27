import React from "react";
import { Box, ToggleButton } from "@mui/material";
import RadioGroupInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/RadioGroupInput";
import MultiStylePropertyPanel from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/style-inputs/MultiStylePropertyPanel";
import TextInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/TextInput";

interface ButtonComponentsProps {
  selectedBlock: any;
  updateBlockStyle: (newStyle: any) => void;
  updateBlockProps: (newProps: any) => void;
}

export function ButtonColorSettings({
  selectedBlock,
  updateBlockStyle,
  updateBlockProps,
}: ButtonComponentsProps) {
  if (!selectedBlock || selectedBlock.type !== "Button") {
    return null;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <RadioGroupInput
          label="Variant"
          defaultValue={(selectedBlock.data as any)?.props?.variant || "fill"}
          onChange={(variant) => {
            updateBlockProps({ variant });
          }}
        >
          <ToggleButton value="fill">Primary</ToggleButton>
          <ToggleButton value="bordered">Secondary</ToggleButton>
        </RadioGroupInput>
      </Box>

      {/* Primary variant: text and background */}
      {(selectedBlock.data as any)?.props?.variant !== "bordered" && (
        <MultiStylePropertyPanel
          names={["color", "backgroundColor"]}
          value={(selectedBlock.data as any)?.style || {}}
          onChange={updateBlockStyle}
        />
      )}

      {/* Secondary variant: text and border */}
      {(selectedBlock.data as any)?.props?.variant === "bordered" && (
        <MultiStylePropertyPanel
          names={["color", "borderColor"]}
          value={(selectedBlock.data as any)?.style || {}}
          onChange={updateBlockStyle}
        />
      )}
    </>
  );
}

export function ButtonFontSettings({
  selectedBlock,
  updateBlockStyle,
}: Omit<ButtonComponentsProps, "updateBlockProps">) {
  if (!selectedBlock || selectedBlock.type !== "Button") {
    return null;
  }

  return (
    <MultiStylePropertyPanel
      names={["fontFamily", "fontWeight", "fontSize"]}
      value={(selectedBlock.data as any)?.style || {}}
      onChange={updateBlockStyle}
    />
  );
}

export function ButtonAlignmentSettings({
  selectedBlock,
  updateBlockStyle,
  updateBlockProps,
}: ButtonComponentsProps) {
  if (!selectedBlock || selectedBlock.type !== "Button") {
    return null;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <RadioGroupInput
          label="Size"
          defaultValue={(selectedBlock.data as any)?.props?.size || "medium"}
          onChange={(size) => {
            updateBlockProps({ size });
          }}
        >
          <ToggleButton value="small">Small</ToggleButton>
          <ToggleButton value="medium">Medium</ToggleButton>
          <ToggleButton value="large">Large</ToggleButton>
        </RadioGroupInput>
      </Box>
      <Box sx={{ mb: 2 }}>
        <RadioGroupInput
          label="Width"
          defaultValue={
            (selectedBlock.data as any)?.props?.fullWidth
              ? "FULL_WIDTH"
              : "AUTO"
          }
          onChange={(v) => {
            updateBlockProps({ fullWidth: v === "FULL_WIDTH" });
          }}
        >
          <ToggleButton value="AUTO">Auto</ToggleButton>
          <ToggleButton value="FULL_WIDTH">Full Width</ToggleButton>
        </RadioGroupInput>
      </Box>
      <Box sx={{ mb: 2 }}>
        <RadioGroupInput
          label="Alignment"
          defaultValue={
            (selectedBlock.data as any)?.props?.alignment || "center"
          }
          onChange={(alignment) => {
            updateBlockProps({ alignment });
          }}
        >
          <ToggleButton value="left">Left</ToggleButton>
          <ToggleButton value="center">Center</ToggleButton>
          <ToggleButton value="right">Right</ToggleButton>
        </RadioGroupInput>
      </Box>
    </>
  );
}

export function ButtonLinkSettings({
  selectedBlock,
  updateBlockProps,
}: Omit<ButtonComponentsProps, "updateBlockStyle">) {
  if (!selectedBlock || selectedBlock.type !== "Button") {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <TextInput
        label="URL"
        defaultValue={(selectedBlock.data as any)?.props?.url || ""}
        onChange={(url: string) => {
          updateBlockProps({ url });
        }}
        placeholder="https://example.com"
      />
    </Box>
  );
}
