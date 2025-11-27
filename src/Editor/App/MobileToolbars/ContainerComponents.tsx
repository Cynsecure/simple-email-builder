import React from "react";
import { Box, ToggleButton } from "@mui/material";
import { SpaceBarOutlined, Height } from "@mui/icons-material";
import RadioGroupInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/RadioGroupInput";
import MultiStylePropertyPanel from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/style-inputs/MultiStylePropertyPanel";
import SliderInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/SliderInput";
import ColumnWidthsInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/ColumnWidthsInput";
import ColorInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/ColorInput";

interface ContainerComponentsProps {
  selectedBlock: any;
  updateBlockStyle: (newStyle: any) => void;
  updateBlockProps: (newProps: any) => void;
}

export function ContainerColorSettings({
  selectedBlock,
  updateBlockStyle,
}: Omit<ContainerComponentsProps, "updateBlockProps">) {
  if (!selectedBlock || selectedBlock.type !== "Container") {
    return null;
  }

  return (
    <MultiStylePropertyPanel
      names={["backgroundColor", "borderColor"]}
      value={(selectedBlock.data as any)?.style || {}}
      onChange={updateBlockStyle}
    />
  );
}

export function ContainerAlignmentSettings({
  selectedBlock,
  updateBlockStyle,
}: Omit<ContainerComponentsProps, "updateBlockProps">) {
  if (!selectedBlock || selectedBlock.type !== "Container") {
    return null;
  }

  return (
    <MultiStylePropertyPanel
      names={["borderRadius"]}
      value={(selectedBlock.data as any)?.style || {}}
      onChange={updateBlockStyle}
    />
  );
}

export function ColumnsContainerColorSettings({
  selectedBlock,
  updateBlockStyle,
}: Omit<ContainerComponentsProps, "updateBlockProps">) {
  if (!selectedBlock || selectedBlock.type !== "ColumnsContainer") {
    return null;
  }

  return (
    <MultiStylePropertyPanel
      names={["backgroundColor"]}
      value={(selectedBlock.data as any)?.style || {}}
      onChange={updateBlockStyle}
    />
  );
}

export function ColumnsContainerSettings({
  selectedBlock,
  updateBlockProps,
}: Omit<ContainerComponentsProps, "updateBlockStyle">) {
  if (!selectedBlock || selectedBlock.type !== "ColumnsContainer") {
    return null;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <RadioGroupInput
          label="Number of columns"
          defaultValue={
            (selectedBlock.data as any)?.props?.columnsCount === 2 ? "2" : "3"
          }
          onChange={(value) => {
            updateBlockProps({
              columnsCount: value === "2" ? 2 : 3,
            });
          }}
        >
          <ToggleButton value="2">2</ToggleButton>
          <ToggleButton value="3">3</ToggleButton>
        </RadioGroupInput>
      </Box>
      <Box sx={{ mb: 2 }}>
        <ColumnWidthsInput
          defaultValue={(selectedBlock.data as any)?.props?.fixedWidths}
          onChange={(fixedWidths) => {
            updateBlockProps({ fixedWidths });
          }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <SliderInput
          label="Columns gap"
          iconLabel={<SpaceBarOutlined sx={{ color: "text.secondary" }} />}
          units="px"
          step={4}
          marks
          min={0}
          max={80}
          defaultValue={(selectedBlock.data as any)?.props?.columnsGap ?? 0}
          onChange={(columnsGap: number) => {
            updateBlockProps({ columnsGap });
          }}
        />
      </Box>
    </>
  );
}

export function ColumnsContainerAlignmentSettings({
  selectedBlock,
  updateBlockProps,
  updateBlockStyle,
}: ContainerComponentsProps) {
  if (!selectedBlock || selectedBlock.type !== "ColumnsContainer") {
    return null;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <RadioGroupInput
          label="Vertical Alignment"
          defaultValue={
            (selectedBlock.data as any)?.props?.contentAlignment ?? "middle"
          }
          onChange={(contentAlignment) => {
            updateBlockProps({ contentAlignment });
          }}
        >
          <ToggleButton value="top">Top</ToggleButton>
          <ToggleButton value="middle">Middle</ToggleButton>
          <ToggleButton value="bottom">Bottom</ToggleButton>
        </RadioGroupInput>
      </Box>
    </>
  );
}

export function SpacerColorSettings({
  selectedBlock,
  updateBlockStyle,
}: Omit<ContainerComponentsProps, "updateBlockProps">) {
  if (!selectedBlock || selectedBlock.type !== "Spacer") {
    return null;
  }

  return (
    <MultiStylePropertyPanel
      names={["backgroundColor"]}
      value={(selectedBlock.data as any)?.style || {}}
      onChange={updateBlockStyle}
    />
  );
}

export function SpacerAlignmentSettings({
  selectedBlock,
  updateBlockProps,
}: Omit<ContainerComponentsProps, "updateBlockStyle">) {
  if (!selectedBlock || selectedBlock.type !== "Spacer") {
    return null;
  }

  // Convert height from string (e.g., "20px") to number
  const getCurrentHeight = () => {
    const height = (selectedBlock.data as any)?.props?.height || "20px";
    return parseInt(height.toString().replace("px", ""), 10);
  };

  return (
    <SliderInput
      label="Height"
      iconLabel={<SpaceBarOutlined sx={{ color: "text.secondary" }} />}
      units="px"
      step={1}
      min={1}
      max={200}
      defaultValue={getCurrentHeight()}
      onChange={(height) => {
        updateBlockProps({ height: `${height}px` });
      }}
    />
  );
}

export function DividerColorSettings({
  selectedBlock,
  updateBlockStyle,
  updateBlockProps,
}: ContainerComponentsProps) {
  if (!selectedBlock || selectedBlock.type !== "Divider") {
    return null;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <ColorInput
          label="Line Color"
          defaultValue={(selectedBlock.data as any)?.props?.lineColor || ""}
          onChange={(lineColor: string) => {
            updateBlockProps({ lineColor });
          }}
        />
      </Box>
      <MultiStylePropertyPanel
        names={["backgroundColor"]}
        value={(selectedBlock.data as any)?.style || {}}
        onChange={updateBlockStyle}
      />
    </>
  );
}

export function DividerAlignmentSettings({
  selectedBlock,
  updateBlockStyle,
  updateBlockProps,
}: ContainerComponentsProps) {
  if (!selectedBlock || selectedBlock.type !== "Divider") {
    return null;
  }

  // Convert lineHeight from number to number (dividers use lineHeight property, not height)
  const getCurrentLineHeight = () => {
    const lineHeight = (selectedBlock.data as any)?.props?.lineHeight || 1;
    return typeof lineHeight === "number"
      ? lineHeight
      : parseInt(lineHeight.toString().replace("px", ""), 10);
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <SliderInput
          label="Height"
          iconLabel={<Height sx={{ color: "text.secondary" }} />}
          units="px"
          step={1}
          min={1}
          max={24}
          defaultValue={getCurrentLineHeight()}
          onChange={(lineHeight) => {
            updateBlockProps({ lineHeight });
          }}
        />
      </Box>
    </>
  );
}
