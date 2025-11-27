import React from "react";

import { Box, Tab, Tabs } from "@mui/material";

import {
  setSidebarTab,
  useInspectorDrawerOpen,
  useSelectedSidebarTab,
} from "../../documents/editor/EditorContext";

import ConfigurationPanel from "./ConfigurationPanel";
import StylesPanel from "./StylesPanel";
import ArticlesPanel from "./ArticlesPanel";
import { EditorFileUploadCallback, EditorMetadata } from "../../types";

export const INSPECTOR_DRAWER_WIDTH = 320;

export type InspectorDrawerProps = {
  onFileUpload?: EditorFileUploadCallback;
  metadata: EditorMetadata;
};

export default function InspectorDrawer({
  metadata,
  onFileUpload,
}: InspectorDrawerProps) {
  const selectedSidebarTab = useSelectedSidebarTab();
  const inspectorDrawerOpen = useInspectorDrawerOpen();

  const renderCurrentSidebarPanel = () => {
    switch (selectedSidebarTab) {
      case "styles":
        return <StylesPanel />;
      case "articles":
        return <ArticlesPanel metadata={metadata} />;
      default:
        return <ConfigurationPanel onFileUpload={onFileUpload} />;
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        left: "auto",
        width: inspectorDrawerOpen ? INSPECTOR_DRAWER_WIDTH : 0,
      }}
    >
      <Box
        sx={{
          width: INSPECTOR_DRAWER_WIDTH,
          height: 49,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box px={2}>
          <Tabs
            value={selectedSidebarTab}
            onChange={(_, v) => setSidebarTab(v)}
          >
            <Tab value="styles" label="Styles" />
            <Tab value="block-configuration" label="Inspect" />
            {/* <Tab value="articles" label="Articles" /> */}
          </Tabs>
        </Box>
      </Box>
      <Box
        sx={{
          width: INSPECTOR_DRAWER_WIDTH,
          height: "calc(100% - 49px)",
          overflow: "auto",
        }}
      >
        {renderCurrentSidebarPanel()}
      </Box>
    </Box>
  );
}
