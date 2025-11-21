import React from "react";
import { Paper, Box, Collapse, Stack, InputLabel } from "@mui/material";
import { Icon } from "@iconify/react";

interface HeadingPickerPanelsProps {
  selectedBlock: any;
  keyboardHeight: number;
  showHeadingPicker: boolean;
  onHeadingLevelChange: (level: string) => void;
}

export function HeadingPickerPanel({
  selectedBlock,
  keyboardHeight,
  showHeadingPicker,
  onHeadingLevelChange,
}: HeadingPickerPanelsProps) {
  const currentLevel = (selectedBlock?.data as any)?.props?.level || "h2";

  return (
    <Collapse in={showHeadingPicker && selectedBlock?.type === "Heading"}>
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
          <Box sx={{ mb: 2 }}>
            <InputLabel>Heading Level</InputLabel>
          </Box>
          <Stack spacing={2}>
            {/* H1 Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                bgcolor:
                  currentLevel === "h1" ? "action.selected" : "transparent",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => onHeadingLevelChange("h1")}
            >
              <Icon
                icon="lucide:heading-1"
                fontSize={24}
                style={{
                  color:
                    currentLevel === "h1"
                      ? "var(--mui-palette-primary-main)"
                      : "var(--mui-palette-text-secondary)",
                }}
              />
              <Box
                sx={{
                  fontSize: "1rem",
                  fontWeight: currentLevel === "h1" ? "bold" : "normal",
                  color:
                    currentLevel === "h1" ? "primary.main" : "text.primary",
                }}
              >
                Heading 1
              </Box>
            </Box>

            {/* H2 Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                bgcolor:
                  currentLevel === "h2" ? "action.selected" : "transparent",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => onHeadingLevelChange("h2")}
            >
              <Icon
                icon="lucide:heading-2"
                fontSize={24}
                style={{
                  color:
                    currentLevel === "h2"
                      ? "var(--mui-palette-primary-main)"
                      : "var(--mui-palette-text-secondary)",
                }}
              />
              <Box
                sx={{
                  fontSize: "1rem",
                  fontWeight: currentLevel === "h2" ? "bold" : "normal",
                  color:
                    currentLevel === "h2" ? "primary.main" : "text.primary",
                }}
              >
                Heading 2
              </Box>
            </Box>

            {/* H3 Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                bgcolor:
                  currentLevel === "h3" ? "action.selected" : "transparent",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => onHeadingLevelChange("h3")}
            >
              <Icon
                icon="lucide:heading-3"
                fontSize={24}
                style={{
                  color:
                    currentLevel === "h3"
                      ? "var(--mui-palette-primary-main)"
                      : "var(--mui-palette-text-secondary)",
                }}
              />
              <Box
                sx={{
                  fontSize: "1rem",
                  fontWeight: currentLevel === "h3" ? "bold" : "normal",
                  color:
                    currentLevel === "h3" ? "primary.main" : "text.primary",
                }}
              >
                Heading 3
              </Box>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Collapse>
  );
}
