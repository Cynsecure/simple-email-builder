import React from "react";

import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import {
  IconButton,
  Paper,
  Stack,
  SxProps,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { TEditorBlock } from "../../../editor/core";
import {
  resetDocument,
  setSelectedBlockId,
  useDocument,
} from "../../../editor/EditorContext";
import { ColumnsContainerProps } from "../../ColumnsContainer/ColumnsContainerPropsSchema";

// Dynamic styles based on screen size
const getSxProps = (isMobile: boolean): SxProps => ({
  position: "absolute",
  bottom: isMobile ? -38 : -12, // Lower positioning on mobile, original on desktop
  right: isMobile ? 0 : undefined, // Right positioning on mobile
  left: isMobile ? undefined : -56, // Left positioning on desktop (original)
  borderRadius: isMobile ? 20 : 64, // More rounded horizontally on mobile, circular on desktop
  paddingX: isMobile ? 1 : 0.5, // More padding horizontally on mobile
  paddingY: isMobile ? 0.5 : 1, // Less padding vertically on mobile, more on desktop
  zIndex: "fab",
  boxShadow: 2,
});

type Props = {
  blockId: string;
};
export default function TuneMenu({ blockId }: Props) {
  const document = useDocument();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Use different tooltip placement and styles based on screen size
  const tooltipPlacement = isMobile ? "top" : "right";
  const sx = getSxProps(isMobile);

  const handleDeleteClick = () => {
    const filterChildrenIds = (childrenIds: string[] | null | undefined) => {
      if (!childrenIds) {
        return childrenIds;
      }
      return childrenIds.filter((f) => f !== blockId);
    };
    const nDocument: typeof document = { ...document };
    for (const [id, b] of Object.entries(nDocument)) {
      const block = b as TEditorBlock;
      if (id === blockId) {
        continue;
      }
      switch (block.type) {
        case "EmailLayout":
          nDocument[id] = {
            ...block,
            data: {
              ...block.data,
              childrenIds: filterChildrenIds(block.data.childrenIds),
            },
          };
          break;
        case "Container":
          nDocument[id] = {
            ...block,
            data: {
              ...block.data,
              props: {
                ...block.data.props,
                childrenIds: filterChildrenIds(block.data.props?.childrenIds),
              },
            },
          };
          break;
        case "ColumnsContainer":
          nDocument[id] = {
            type: "ColumnsContainer",
            data: {
              style: block.data.style,
              props: {
                ...block.data.props,
                columns: block.data.props?.columns?.map((c) => ({
                  childrenIds: filterChildrenIds(c.childrenIds),
                })),
              },
            } as ColumnsContainerProps,
          };
          break;
        default:
          nDocument[id] = block;
      }
    }
    delete nDocument[blockId];
    resetDocument(nDocument);
  };

  const handleMoveClick = (direction: "up" | "down") => {
    const moveChildrenIds = (ids: string[] | null | undefined) => {
      if (!ids) {
        return ids;
      }
      const index = ids.indexOf(blockId);
      if (index < 0) {
        return ids;
      }
      const childrenIds = [...ids];
      if (direction === "up" && index > 0) {
        [childrenIds[index], childrenIds[index - 1]] = [
          childrenIds[index - 1],
          childrenIds[index],
        ];
      } else if (direction === "down" && index < childrenIds.length - 1) {
        [childrenIds[index], childrenIds[index + 1]] = [
          childrenIds[index + 1],
          childrenIds[index],
        ];
      }
      return childrenIds;
    };
    const nDocument: typeof document = { ...document };
    for (const [id, b] of Object.entries(nDocument)) {
      const block = b as TEditorBlock;
      if (id === blockId) {
        continue;
      }
      switch (block.type) {
        case "EmailLayout":
          nDocument[id] = {
            ...block,
            data: {
              ...block.data,
              childrenIds: moveChildrenIds(block.data.childrenIds),
            },
          };
          break;
        case "Container":
          nDocument[id] = {
            ...block,
            data: {
              ...block.data,
              props: {
                ...block.data.props,
                childrenIds: moveChildrenIds(block.data.props?.childrenIds),
              },
            },
          };
          break;
        case "ColumnsContainer":
          nDocument[id] = {
            type: "ColumnsContainer",
            data: {
              style: block.data.style,
              props: {
                ...block.data.props,
                columns: block.data.props?.columns?.map((c) => ({
                  childrenIds: moveChildrenIds(c.childrenIds),
                })),
              },
            } as ColumnsContainerProps,
          };
          break;
        default:
          nDocument[id] = block;
      }
    }

    resetDocument(nDocument);
    setSelectedBlockId(blockId);
  };

  return (
    <Paper sx={sx} onClick={(ev) => ev.stopPropagation()}>
      <Stack direction={isMobile ? "row" : "column"} spacing={0.5}>
        <Tooltip title="Move up" placement={tooltipPlacement}>
          <IconButton
            onClick={() => handleMoveClick("up")}
            sx={{
              color: "text.primary",
              padding: 0.5,
              "&:hover": { backgroundColor: "action.hover" },
            }}
            size="small"
          >
            <ArrowUpwardOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Move down" placement={tooltipPlacement}>
          <IconButton
            onClick={() => handleMoveClick("down")}
            sx={{
              color: "text.primary",
              padding: 0.5,
              "&:hover": { backgroundColor: "action.hover" },
            }}
            size="small"
          >
            <ArrowDownwardOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" placement={tooltipPlacement}>
          <IconButton
            onClick={handleDeleteClick}
            sx={{
              color: "text.primary",
              padding: 0.5,
              "&:hover": { backgroundColor: "action.hover" },
            }}
            size="small"
          >
            <DeleteOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}
