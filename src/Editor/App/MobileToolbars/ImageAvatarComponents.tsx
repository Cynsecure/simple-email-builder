import React from "react";
import { Box, ToggleButton, Stack } from "@mui/material";
import { AspectRatioOutlined } from "@mui/icons-material";
import RadioGroupInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/RadioGroupInput";
import MultiStylePropertyPanel from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/style-inputs/MultiStylePropertyPanel";
import TextInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/TextInput";
import TextDimensionInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/TextDimensionInput";
import SliderInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/SliderInput";
import FileUploader from "../InspectorDrawer/ConfigurationPanel/FileUploader";
import { EditorFileUploadCallback } from "../../types";

interface ImageAvatarComponentsProps {
  selectedBlock: any;
  updateBlockStyle: (newStyle: any) => void;
  updateBlockProps: (newProps: any) => void;
  onFileUpload?: EditorFileUploadCallback;
}

export function ImageColorSettings({
  selectedBlock,
  updateBlockStyle,
}: Omit<ImageAvatarComponentsProps, "updateBlockProps" | "onFileUpload">) {
  if (!selectedBlock || selectedBlock.type !== "Image") {
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

export function ImageAlignmentSettings({
  selectedBlock,
  updateBlockStyle,
  updateBlockProps,
}: Omit<ImageAvatarComponentsProps, "onFileUpload">) {
  if (!selectedBlock || selectedBlock.type !== "Image") {
    return null;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <RadioGroupInput
          label="Content Alignment"
          defaultValue={
            (selectedBlock.data as any)?.props?.contentAlignment || "middle"
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
      <Stack direction="row" spacing={2}>
        <TextDimensionInput
          label="Width"
          defaultValue={(selectedBlock.data as any)?.props?.width}
          onChange={(width) => {
            updateBlockProps({ width });
          }}
        />
        <TextDimensionInput
          label="Height"
          defaultValue={(selectedBlock.data as any)?.props?.height}
          onChange={(height) => {
            updateBlockProps({ height });
          }}
        />
      </Stack>
    </>
  );
}

export function ImageSettings({
  selectedBlock,
  updateBlockProps,
  onFileUpload,
}: Omit<ImageAvatarComponentsProps, "updateBlockStyle">) {
  if (!selectedBlock || selectedBlock.type !== "Image") {
    return null;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ maxWidth: 300, mx: "auto" }}>
          <FileUploader
            onFileUpload={onFileUpload}
            url={(selectedBlock.data as any)?.props?.url}
            onUrlChange={(url) => {
              updateBlockProps({ url });
            }}
          />
        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextInput
          label="Image URL"
          defaultValue={(selectedBlock.data as any)?.props?.url || ""}
          onChange={(url: string) => {
            const trimmedUrl = url.trim().length === 0 ? null : url.trim();
            updateBlockProps({ url: trimmedUrl });
          }}
          placeholder="Enter image URL"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextInput
          label="Alt Text"
          defaultValue={(selectedBlock.data as any)?.props?.alt || ""}
          onChange={(alt: string) => {
            updateBlockProps({ alt });
          }}
          placeholder="Image description"
        />
      </Box>
    </>
  );
}

export function ImageLinkSettings({
  selectedBlock,
  updateBlockProps,
}: Omit<ImageAvatarComponentsProps, "updateBlockStyle" | "onFileUpload">) {
  if (!selectedBlock || selectedBlock.type !== "Image") {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <TextInput
        label="Click URL"
        defaultValue={(selectedBlock.data as any)?.props?.linkHref || ""}
        onChange={(linkHref: string) => {
          updateBlockProps({ linkHref });
        }}
        placeholder="https://example.com (optional)"
      />
    </Box>
  );
}

export function AvatarAlignmentSettings({
  selectedBlock,
  updateBlockStyle,
  updateBlockProps,
}: Omit<ImageAvatarComponentsProps, "onFileUpload">) {
  if (!selectedBlock || selectedBlock.type !== "Avatar") {
    return null;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <SliderInput
          label="Size"
          iconLabel={<AspectRatioOutlined sx={{ color: "text.secondary" }} />}
          units="px"
          step={3}
          min={32}
          max={256}
          defaultValue={(selectedBlock.data as any)?.props?.size || 64}
          onChange={(size) => {
            updateBlockProps({ size });
          }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <RadioGroupInput
          label="Shape"
          defaultValue={(selectedBlock.data as any)?.props?.shape || "circle"}
          onChange={(shape) => {
            updateBlockProps({ shape });
          }}
        >
          <ToggleButton value="circle">Circle</ToggleButton>
          <ToggleButton value="square">Square</ToggleButton>
          <ToggleButton value="rounded">Rounded</ToggleButton>
        </RadioGroupInput>
      </Box>
      <MultiStylePropertyPanel
        names={["textAlign"]}
        value={(selectedBlock.data as any)?.style || {}}
        onChange={updateBlockStyle}
      />
    </>
  );
}

export function AvatarSettings({
  selectedBlock,
  updateBlockProps,
  onFileUpload,
}: Omit<ImageAvatarComponentsProps, "updateBlockStyle">) {
  if (!selectedBlock || selectedBlock.type !== "Avatar") {
    return null;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ maxWidth: 300, mx: "auto" }}>
          <FileUploader
            onFileUpload={onFileUpload}
            url={(selectedBlock.data as any)?.props?.imageUrl}
            onUrlChange={(imageUrl) => {
              updateBlockProps({ imageUrl });
            }}
          />
        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextInput
          label="Image URL"
          defaultValue={(selectedBlock.data as any)?.props?.imageUrl || ""}
          onChange={(imageUrl: string) => {
            updateBlockProps({ imageUrl });
          }}
          placeholder="Enter image URL"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextInput
          label="Alt Text"
          defaultValue={(selectedBlock.data as any)?.props?.alt || ""}
          onChange={(alt: string) => {
            updateBlockProps({ alt });
          }}
          placeholder="Avatar description"
        />
      </Box>
    </>
  );
}
