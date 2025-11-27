import React, { useState } from "react";

import { ToggleButton } from "@mui/material";
import {
  HeadingProps,
  HeadingPropsDefaults,
  HeadingPropsSchema,
} from "../../../../documents/blocks/Heading/HeadingPropsSchema";

import BaseSidebarPanel from "./helpers/BaseSidebarPanel";
import RadioGroupInput from "./helpers/inputs/RadioGroupInput";
import MultiStylePropertyPanel from "./helpers/style-inputs/MultiStylePropertyPanel";

type HeadingSidebarPanelProps = {
  data: HeadingProps;
  setData: (v: HeadingProps) => void;
};
export default function HeadingSidebarPanel({
  data,
  setData,
}: HeadingSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = HeadingPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Heading block">
      {/* Rich Text Content Display */}
      {/* <Box sx={{ mb: 2 }}>
        <Box
          component="label"
          sx={{
            display: "block",
            mb: 1,
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          Content
        </Box>
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 1.5,
            minHeight: 60,
            backgroundColor: "background.paper",
            fontSize: getHeadingFontSize(currentLevel),
            fontWeight: "bold", // Default bold for headings
            lineHeight: 1.5,
            cursor: "text",
            "&:hover": {
              borderColor: "primary.main",
            },
            // Apply custom styles if available
            ...(currentStyle && {
              color: currentStyle.color || undefined,
              backgroundColor:
                currentStyle.backgroundColor || "background.paper",
              fontFamily: currentStyle.fontFamily || undefined,
              fontWeight: currentStyle.fontWeight || "bold",
              textAlign: currentStyle.textAlign || undefined,
            }),
          }}
          onClick={() => {
            // Focus hint - could add click to focus editor functionality
          }}
        >
          {(data.props?.text ?? HeadingPropsDefaults.text) ? (
            <div
              dangerouslySetInnerHTML={{
                __html: data.props?.text ?? HeadingPropsDefaults.text,
              }}
            />
          ) : (
            <span style={{ color: "#999", fontStyle: "italic" }}>
              Click to edit heading
            </span>
          )}
        </Box>
        <Box
          sx={{
            fontSize: "0.75rem",
            color: "text.secondary",
            mt: 0.5,
          }}
        >
          Edit content directly in the editor to see rich formatting
        </Box>
      </Box> */}

      <RadioGroupInput
        label="Level"
        defaultValue={data.props?.level ?? HeadingPropsDefaults.level}
        onChange={(level) => {
          updateData({ ...data, props: { ...data.props, level } });
        }}
      >
        <ToggleButton value="h1">H1</ToggleButton>
        <ToggleButton value="h2">H2</ToggleButton>
        <ToggleButton value="h3">H3</ToggleButton>
        <ToggleButton value="h4">H4</ToggleButton>
      </RadioGroupInput>
      <MultiStylePropertyPanel
        names={[
          "color",
          "backgroundColor",
          "fontFamily",
          "fontWeight",
          "textAlign",
          "padding",
        ]}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
