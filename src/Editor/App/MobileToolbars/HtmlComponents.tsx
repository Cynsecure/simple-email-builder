import React from "react";
import { Box } from "@mui/material";
import MultiStylePropertyPanel from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/style-inputs/MultiStylePropertyPanel";
import TextInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/TextInput";

interface HtmlComponentsProps {
  selectedBlock: any;
  updateBlockStyle: (newStyle: any) => void;
  updateBlockProps: (newProps: any) => void;
}

export function HtmlColorSettings({
  selectedBlock,
  updateBlockStyle,
}: Omit<HtmlComponentsProps, "updateBlockProps">) {
  if (!selectedBlock || selectedBlock.type !== "Html") {
    return null;
  }

  return (
    <MultiStylePropertyPanel
      names={["color", "backgroundColor"]}
      value={(selectedBlock.data as any)?.style || {}}
      onChange={updateBlockStyle}
    />
  );
}

export function HtmlFontSettings({
  selectedBlock,
  updateBlockStyle,
}: Omit<HtmlComponentsProps, "updateBlockProps">) {
  if (!selectedBlock || selectedBlock.type !== "Html") {
    return null;
  }

  return (
    <MultiStylePropertyPanel
      names={["fontFamily", "fontSize"]}
      value={(selectedBlock.data as any)?.style || {}}
      onChange={updateBlockStyle}
    />
  );
}

export function HtmlAlignmentSettings({
  selectedBlock,
  updateBlockStyle,
}: Omit<HtmlComponentsProps, "updateBlockProps">) {
  if (!selectedBlock || selectedBlock.type !== "Html") {
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

export function HtmlSettings({
  selectedBlock,
  updateBlockProps,
}: Omit<HtmlComponentsProps, "updateBlockStyle">) {
  if (!selectedBlock || selectedBlock.type !== "Html") {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <TextInput
        label="Content"
        rows={5}
        defaultValue={(selectedBlock.data as any)?.props?.contents ?? ""}
        onChange={(contents: string) => {
          updateBlockProps({ contents });
        }}
        placeholder="Enter HTML content..."
      />
    </Box>
  );
}
