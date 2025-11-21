import React from "react";
import { Box } from "@mui/material";
import StylesPanel from "../InspectorDrawer/StylesPanel";
import MultiStylePropertyPanel from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/style-inputs/MultiStylePropertyPanel";
import { TextAlignmentSettings } from "./TextHeadingComponents";
import {
  ButtonAlignmentSettings,
  ButtonLinkSettings,
} from "./ButtonComponents";
import {
  ImageAlignmentSettings,
  ImageSettings,
  ImageLinkSettings,
  AvatarAlignmentSettings,
  AvatarSettings,
} from "./ImageAvatarComponents";
import {
  ContainerAlignmentSettings,
  ColumnsContainerSettings,
  ColumnsContainerAlignmentSettings,
  SpacerAlignmentSettings,
  DividerAlignmentSettings,
} from "./ContainerComponents";
import { HtmlAlignmentSettings, HtmlSettings } from "./HtmlComponents";
import { EditorFileUploadCallback } from "../../types";
import ColorInput, {
  NullableColorInput,
} from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/ColorInput";
import { NullableFontFamily } from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/FontFamily";
import SliderInput from "../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/SliderInput";
import { RoundedCornerOutlined } from "@mui/icons-material";
import { useDocument, setDocument } from "../../documents/editor/EditorContext";

interface PanelContentProps {
  activeTab: string;
  selectedBlock: any;
  hasSelectedBlock: boolean;
  updateBlockStyle: (newStyle: any) => void;
  updateBlockProps: (newProps: any) => void;
  onFileUpload?: EditorFileUploadCallback;
}

// Constants
const GLOBAL_TABS = [
  "backdrop-color",
  "canvas-color",
  "canvas-border-color",
  "canvas-border-radius",
  "global-font-family",
  "global-text-color",
] as const;

const ALIGNMENT_BLOCK_TYPES = [
  "Button",
  "Image",
  "Avatar",
  "Divider",
  "Container",
  "ColumnsContainer",
  "Spacer",
  "Text",
  "Heading",
  "Html",
] as const;

const IMAGE_BLOCK_TYPES = ["Image", "Avatar"] as const;
const LINK_BLOCK_TYPES = ["Button", "Image"] as const;

// Shared components
const PanelHeader: React.FC<{ title: string }> = ({ title }) => (
  <Box sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: "divider" }}>
    <Box component="h3" sx={{ m: 0, fontSize: "1.1rem", fontWeight: 500 }}>
      {title}
    </Box>
  </Box>
);

const NotAvailableMessage: React.FC<{ blockType: string; feature: string }> = ({
  blockType,
  feature,
}) => (
  <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
    {feature} are not available for {blockType} blocks
  </Box>
);

const SelectBlockMessage: React.FC = () => (
  <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
    Select a block to edit its properties
  </Box>
);

const NoContentMessage: React.FC = () => (
  <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
    No content available
  </Box>
);

// Global panel configuration
interface GlobalPanelConfig {
  title: string;
  component: React.ComponentType<any>;
  props: (rootData: any, updateRootData: (data: any) => void) => any;
}

const GLOBAL_PANEL_CONFIGS: Record<string, GlobalPanelConfig> = {
  "backdrop-color": {
    title: "Backdrop Color",
    component: ColorInput,
    props: (rootData, updateRootData) => ({
      label: "Backdrop color",
      defaultValue: rootData.backdropColor ?? "#F5F5F5",
      onChange: (backdropColor: string) => updateRootData({ backdropColor }),
    }),
  },
  "canvas-color": {
    title: "Canvas Color",
    component: ColorInput,
    props: (rootData, updateRootData) => ({
      label: "Canvas color",
      defaultValue: rootData.canvasColor ?? "#FFFFFF",
      onChange: (canvasColor: string) => updateRootData({ canvasColor }),
    }),
  },
  "canvas-border-color": {
    title: "Canvas Border Color",
    component: NullableColorInput,
    props: (rootData, updateRootData) => ({
      label: "Canvas border color",
      defaultValue: rootData.borderColor ?? null,
      onChange: (borderColor: string | null) => updateRootData({ borderColor }),
    }),
  },
  "canvas-border-radius": {
    title: "Canvas Border Radius",
    component: SliderInput,
    props: (rootData, updateRootData) => ({
      iconLabel: <RoundedCornerOutlined />,
      units: "px",
      step: 4,
      marks: true,
      min: 0,
      max: 48,
      label: "Canvas border radius",
      defaultValue: rootData.borderRadius ?? 0,
      onChange: (borderRadius: number) => updateRootData({ borderRadius }),
    }),
  },
  "global-font-family": {
    title: "Global Font Family",
    component: NullableFontFamily,
    props: (rootData, updateRootData) => ({
      label: "Font family",
      defaultValue: rootData.fontFamily ?? "MODERN_SANS",
      onChange: (fontFamily: string) => updateRootData({ fontFamily }),
    }),
  },
  "global-text-color": {
    title: "Global Text Color",
    component: ColorInput,
    props: (rootData, updateRootData) => ({
      label: "Text color",
      defaultValue: rootData.textColor ?? "#262626",
      onChange: (textColor: string) => updateRootData({ textColor }),
    }),
  },
};

// Alignment settings components configuration
interface AlignmentComponent {
  component: React.ComponentType<any>;
  props: (
    selectedBlock: any,
    updateBlockStyle: any,
    updateBlockProps: any
  ) => any;
}

const ALIGNMENT_COMPONENTS: AlignmentComponent[] = [
  {
    component: ButtonAlignmentSettings,
    props: (selectedBlock, updateBlockStyle, updateBlockProps) => ({
      selectedBlock,
      updateBlockStyle,
      updateBlockProps,
    }),
  },
  {
    component: ImageAlignmentSettings,
    props: (selectedBlock, updateBlockStyle, updateBlockProps) => ({
      selectedBlock,
      updateBlockStyle,
      updateBlockProps,
    }),
  },
  {
    component: AvatarAlignmentSettings,
    props: (selectedBlock, updateBlockStyle, updateBlockProps) => ({
      selectedBlock,
      updateBlockStyle,
      updateBlockProps,
    }),
  },
  {
    component: DividerAlignmentSettings,
    props: (selectedBlock, updateBlockStyle, updateBlockProps) => ({
      selectedBlock,
      updateBlockStyle,
      updateBlockProps,
    }),
  },
  {
    component: SpacerAlignmentSettings,
    props: (selectedBlock, updateBlockStyle, updateBlockProps) => ({
      selectedBlock,
      updateBlockProps,
    }),
  },
  {
    component: ContainerAlignmentSettings,
    props: (selectedBlock, updateBlockStyle, updateBlockProps) => ({
      selectedBlock,
      updateBlockStyle,
    }),
  },
  {
    component: ColumnsContainerAlignmentSettings,
    props: (selectedBlock, updateBlockStyle, updateBlockProps) => ({
      selectedBlock,
      updateBlockProps,
      updateBlockStyle,
    }),
  },
  {
    component: TextAlignmentSettings,
    props: (selectedBlock, updateBlockStyle, updateBlockProps) => ({
      selectedBlock,
      updateBlockStyle,
    }),
  },
  {
    component: HtmlAlignmentSettings,
    props: (selectedBlock, updateBlockStyle, updateBlockProps) => ({
      selectedBlock,
      updateBlockStyle,
    }),
  },
];

// Generic global panel component
const GlobalPanel: React.FC<{ config: GlobalPanelConfig }> = ({ config }) => {
  const document = useDocument();
  const rootData = (document.root?.data as any) || {};

  const updateRootData = (newData: any) => {
    setDocument({
      root: {
        type: "EmailLayout",
        data: { ...rootData, ...newData },
      },
    });
  };

  const Component = config.component;
  const props = config.props(rootData, updateRootData);

  return (
    <Box>
      <PanelHeader title={config.title} />
      <Component {...props} />
    </Box>
  );
};

// Main component
export default function PanelContent({
  activeTab,
  selectedBlock,
  hasSelectedBlock,
  updateBlockStyle,
  updateBlockProps,
  onFileUpload,
}: PanelContentProps) {
  // Early return for cases without selected block
  if (
    !hasSelectedBlock &&
    activeTab !== "styles" &&
    !GLOBAL_TABS.includes(activeTab as any)
  ) {
    return <SelectBlockMessage />;
  }

  // Handle global panels
  const globalConfig = GLOBAL_PANEL_CONFIGS[activeTab];
  if (globalConfig) {
    return <GlobalPanel config={globalConfig} />;
  }

  // Handle specific tab cases
  switch (activeTab) {
    case "styles":
      return <StylesPanel />;

    case "alignment":
      return (
        <Box>
          <PanelHeader title="Alignment & Spacing" />

          {/* Render all alignment components */}
          {ALIGNMENT_COMPONENTS.map((item, index) => {
            const Component = item.component;
            const props = item.props(
              selectedBlock,
              updateBlockStyle,
              updateBlockProps
            );
            return <Component key={index} {...props} />;
          })}

          {/* Default alignment settings for other blocks */}
          {!ALIGNMENT_BLOCK_TYPES.includes(selectedBlock.type) && (
            <MultiStylePropertyPanel
              names={["textAlign"]}
              value={(selectedBlock.data as any)?.style || {}}
              onChange={updateBlockStyle}
            />
          )}
        </Box>
      );

    case "image":
      return (
        <Box>
          <PanelHeader title="Image Settings" />

          <ImageSettings
            selectedBlock={selectedBlock}
            updateBlockProps={updateBlockProps}
            onFileUpload={onFileUpload}
          />

          <AvatarSettings
            selectedBlock={selectedBlock}
            updateBlockProps={updateBlockProps}
            onFileUpload={onFileUpload}
          />

          {!IMAGE_BLOCK_TYPES.includes(selectedBlock.type as any) && (
            <NotAvailableMessage
              blockType={selectedBlock.type}
              feature="Image settings"
            />
          )}
        </Box>
      );

    case "html":
      return (
        <Box>
          <PanelHeader title="HTML Settings" />

          <HtmlSettings
            selectedBlock={selectedBlock}
            updateBlockProps={updateBlockProps}
          />

          {selectedBlock.type !== "Html" && (
            <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
              HTML settings are only available for HTML blocks
            </Box>
          )}
        </Box>
      );

    case "columns":
      return (
        <Box>
          <PanelHeader title="Column Settings" />

          <ColumnsContainerSettings
            selectedBlock={selectedBlock}
            updateBlockProps={updateBlockProps}
          />

          {selectedBlock.type !== "ColumnsContainer" && (
            <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
              Column settings are only available for Column blocks
            </Box>
          )}
        </Box>
      );

    case "links":
      return (
        <Box>
          <PanelHeader title="Link Settings" />

          <ButtonLinkSettings
            selectedBlock={selectedBlock}
            updateBlockProps={updateBlockProps}
          />

          <ImageLinkSettings
            selectedBlock={selectedBlock}
            updateBlockProps={updateBlockProps}
          />

          {selectedBlock.type === "Avatar" && (
            <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
              Avatar blocks don't support click URLs. Use the Image tab to set
              the avatar source.
            </Box>
          )}

          {!LINK_BLOCK_TYPES.includes(selectedBlock.type as any) && (
            <NotAvailableMessage
              blockType={selectedBlock.type}
              feature="Link settings"
            />
          )}
        </Box>
      );

    default:
      return <NoContentMessage />;
  }
}
