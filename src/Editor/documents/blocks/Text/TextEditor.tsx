import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  Superscript,
  Subscript,
  FormatColorText,
  FormatListBulleted,
  FormatListNumbered,
  Link as LinkIcon,
  Person as PersonIcon,
  FontDownload,
  FormatSize,
} from "@mui/icons-material";

import { useCurrentBlockId } from "../../editor/EditorBlock";
import { setDocument, useDocument } from "../../editor/EditorContext";
import { FONT_FAMILIES } from "../helpers/fontFamily";

import { TextProps } from "./TextPropsSchema";

// Font size options - using actual pixel values for consistency with sidebar
const FONT_SIZES = [
  { label: "8px", value: "8px" },
  { label: "10px", value: "10px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "24px", value: "24px" },
  { label: "32px", value: "32px" },
  { label: "36px", value: "36px" },
  { label: "40px", value: "40px" },
  { label: "44px", value: "44px" },
  { label: "48px", value: "48px" },
];

// Helper function to convert font family key to CSS value
const getFontFamilyValue = (
  fontFamilyKey: string | null | undefined
): string | undefined => {
  if (!fontFamilyKey) return undefined;
  const fontFamily = FONT_FAMILIES.find((f) => f.key === fontFamilyKey);
  return fontFamily ? fontFamily.value : fontFamilyKey;
};

export default function TextEditor({ style, props }: TextProps) {
  const editorDocument = useDocument();
  const currentBlockId = useCurrentBlockId();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toolbarKey, setToolbarKey] = useState(0); // Force toolbar re-render for active states
  const lastContentRef = useRef<string>(""); // Track last content to detect changes
  const [variableMenuAnchor, setVariableMenuAnchor] =
    useState<null | HTMLElement>(null);
  const variableButtonRef = useRef<HTMLButtonElement>(null);
  const [colorPickerAnchor, setColorPickerAnchor] =
    useState<null | HTMLElement>(null);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const [fontFamilyMenuAnchor, setFontFamilyMenuAnchor] =
    useState<null | HTMLElement>(null);
  const fontFamilyButtonRef = useRef<HTMLButtonElement>(null);
  const [fontSizeMenuAnchor, setFontSizeMenuAnchor] =
    useState<null | HTMLElement>(null);
  const fontSizeButtonRef = useRef<HTMLButtonElement>(null);

  const content = props?.richText || "";

  useEffect(() => {
    // Only set innerHTML when not editing and content has actually changed from external source
    if (editorRef.current && !isEditing && content !== lastContentRef.current) {
      editorRef.current.innerHTML = content;
      lastContentRef.current = content;
    }
  }, [content, isEditing]);

  const executeCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      window.document.execCommand(command, false, value);
      // Immediately update toolbar to reflect the command execution
      setTimeout(() => {
        setToolbarKey((prev) => prev + 1);
      }, 10);
      // Don't call updateContent immediately, let onInput handle it
    }
  };

  const updateContent = () => {
    if (editorRef.current) {
      const richText = editorRef.current.innerHTML;

      // Update the lastContentRef to current editor content to prevent useEffect interference
      lastContentRef.current = richText;

      // Only update if content actually changed
      if (richText !== props?.richText) {
        setDocument({
          [currentBlockId]: {
            type: "Text",
            data: {
              ...editorDocument[currentBlockId].data,
              props: {
                ...props,
                richText,
              },
            },
          },
        });
      }
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
    // Focus the editor after a short delay to ensure it's rendered
    setTimeout(() => {
      if (editorRef.current) {
        // Ensure content is set before focusing
        if (content && editorRef.current.innerHTML !== content) {
          editorRef.current.innerHTML = content;
          lastContentRef.current = content; // Update the ref to current content
        }
        editorRef.current.focus();

        // Move cursor to the end if there's content
        if (content) {
          const range = window.document.createRange();
          const selection = window.getSelection();

          // Move cursor to the end of the content
          range.selectNodeContents(editorRef.current);
          range.collapse(false); // false means collapse to end

          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    }, 10);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't blur if clicking on a toolbar button or menu
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (
      relatedTarget &&
      (relatedTarget.closest('[role="button"]') ||
        relatedTarget.closest('[role="menuitem"]') ||
        relatedTarget.closest(".MuiPaper-root") ||
        relatedTarget.closest(".MuiMenu-root") ||
        relatedTarget.closest(".MuiIconButton-root") ||
        relatedTarget.closest('input[type="color"]') ||
        relatedTarget.closest('input[type="text"]') ||
        relatedTarget.closest("form"))
    ) {
      return;
    }

    // Close any open menus when blurring
    setFontFamilyMenuAnchor(null);
    setFontSizeMenuAnchor(null);
    setColorPickerAnchor(null);
    setVariableMenuAnchor(null);

    setIsEditing(false);
    updateContent();
  };

  const handleInput = () => {
    // Debounce updates to avoid excessive re-renders
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(updateContent, 300);
  };

  const handleSelectionChange = () => {
    // Update toolbar to reflect current formatting state
    setToolbarKey((prev) => prev + 1);
  };

  // Listen for selection changes to update toolbar state
  useEffect(() => {
    if (isEditing) {
      const handleSelection = () => handleSelectionChange();
      window.document.addEventListener("selectionchange", handleSelection);
      return () =>
        window.document.removeEventListener("selectionchange", handleSelection);
    }
    return () => {}; // Return empty cleanup function when not editing
  }, [isEditing]);

  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const ToolbarButton = ({
    command,
    icon,
    tooltip,
    value,
    onClick,
  }: {
    command?: string;
    icon: React.ReactNode;
    tooltip: string;
    value?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  }) => {
    // Check if the command is currently active
    const isActive = command
      ? window.document.queryCommandState(command)
      : false;

    return (
      <Tooltip title={tooltip}>
        <IconButton
          size="small"
          onMouseDown={(e) => {
            e.preventDefault();
            if (onClick) {
              onClick(e);
            } else if (command) {
              executeCommand(command, value);
            }
            // Force immediate update after click
            setTimeout(() => {
              setToolbarKey((prev) => prev + 1);
            }, 10);
          }}
          sx={{
            minWidth: 32,
            height: 32,
            backgroundColor: isActive
              ? "rgba(25, 118, 210, 0.12)"
              : "transparent",
            boxShadow: isActive
              ? "0px 2px 4px rgba(25, 118, 210, 0.3)"
              : "none",
            border: isActive
              ? "1px solid rgba(25, 118, 210, 0.5)"
              : "1px solid transparent",
            "&:hover": {
              backgroundColor: isActive
                ? "rgba(25, 118, 210, 0.2)"
                : "rgba(0, 0, 0, 0.04)",
              boxShadow: isActive
                ? "0px 3px 6px rgba(25, 118, 210, 0.4)"
                : "0px 1px 3px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  };

  const handleLinkClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
      // Force toolbar update for link button
      setTimeout(() => {
        setToolbarKey((prev) => prev + 1);
      }, 10);
    }
  };

  const handleColorPickerOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Save the current selection before opening the color picker
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0).cloneRange());
    }

    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
    setSavedSelection(null);
  };

  const applyTextColor = (color: string) => {
    if (color && editorRef.current) {
      // Restore the saved selection before applying color
      if (savedSelection) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedSelection);
        }
      }

      // Focus the editor and apply the color
      editorRef.current.focus();
      executeCommand("foreColor", color);
      handleColorPickerClose();

      // Update content to reflect the change
      setTimeout(() => {
        updateContent();
      }, 10);
    }
  };

  const handleCustomColorSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const color = formData.get("customColor") as string;
    if (color) {
      applyTextColor(color);
    }
  };

  const handleVariableMenuClose = () => {
    setVariableMenuAnchor(null);
  };

  const handleFontFamilyMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Save the current selection before opening the font family menu
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0).cloneRange());
    }

    setFontFamilyMenuAnchor(fontFamilyButtonRef.current);
  };

  const handleFontFamilyMenuClose = () => {
    setFontFamilyMenuAnchor(null);
    setSavedSelection(null);
  };

  const applyFontFamily = (fontFamilyKey: string) => {
    if (fontFamilyKey && editorRef.current) {
      // Restore the saved selection before applying font family
      if (savedSelection) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedSelection);
        }
      }

      // Focus the editor and apply the font family
      editorRef.current.focus();

      // Get the CSS font family value
      const fontFamily = FONT_FAMILIES.find((f) => f.key === fontFamilyKey);
      if (fontFamily) {
        executeCommand("fontName", fontFamily.value);
      }

      handleFontFamilyMenuClose();

      // Update content to reflect the change
      setTimeout(() => {
        updateContent();
      }, 10);
    }
  };

  const handleFontSizeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Save the current selection before opening the font size menu
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0).cloneRange());
    }

    setFontSizeMenuAnchor(fontSizeButtonRef.current);
  };

  const handleFontSizeMenuClose = () => {
    setFontSizeMenuAnchor(null);
    setSavedSelection(null);
  };

  const applyFontSize = (fontSize: string) => {
    if (fontSize && editorRef.current) {
      // Restore the saved selection before applying font size
      if (savedSelection) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedSelection);
        }
      }

      // Focus the editor and apply the font size
      editorRef.current.focus();

      // Always use pixel values for consistency with sidebar
      // Wrap the selected text in a span with inline style
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText) {
          // Create a span element with the font size
          const span = document.createElement("span");
          span.style.fontSize = fontSize;
          span.textContent = selectedText;

          // Replace the selected text with the styled span
          range.deleteContents();
          range.insertNode(span);

          // Clear selection
          selection.removeAllRanges();
        }
      }

      handleFontSizeMenuClose();

      // Update content to reflect the change
      setTimeout(() => {
        updateContent();
      }, 10);
    }
  };

  const insertVariable = (variableType: string) => {
    if (!editorRef.current) {
      handleVariableMenuClose();
      return;
    }

    let variableText = "";
    switch (variableType) {
      case "firstName":
        variableText = "{{firstName}}";
        break;
      case "lastName":
        variableText = "{{lastName}}";
        break;
      case "fullName":
        variableText = "{{fullName}}";
        break;
      default:
        handleVariableMenuClose();
        return;
    }

    // Close menu first to avoid interference
    handleVariableMenuClose();

    // Focus the editor
    editorRef.current.focus();

    // Use a more reliable method to insert text
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        // Create a text node with the variable
        const textNode = document.createTextNode(variableText);
        range.insertNode(textNode);

        // Move cursor after the inserted text
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Fallback: insert at the end
        editorRef.current.appendChild(document.createTextNode(variableText));
      }

      // Update content with a slight delay to ensure DOM is updated
      setTimeout(() => {
        updateContent();
      }, 10);
    } catch (error) {
      // Fallback: append to the end
      editorRef.current.appendChild(document.createTextNode(variableText));
      updateContent();
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Rich Text Editor */}
        <div
          key={`${currentBlockId}-edit-${style?.padding ? `${style.padding.top}-${style.padding.bottom}-${style.padding.left}-${style.padding.right}` : "default"}`} // Force re-render when switching blocks or padding changes
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onInput={handleInput}
          style={{
            minHeight: "40px",
            // Apply padding from style configuration, or default to 8px
            padding: style?.padding
              ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
              : "8px",
            border: "2px solid #1976d2",
            borderRadius: "4px",
            outline: "none",
            cursor: "text",
            ...(style && {
              color: style.color || undefined,
              backgroundColor: style.backgroundColor || undefined,
              fontSize: style.fontSize || undefined,
              fontFamily: getFontFamilyValue(style.fontFamily) || undefined,
              fontWeight: style.fontWeight || undefined,
              textAlign: style.textAlign || undefined,
            }),
          }}
        />

        {/* Rich Text Toolbar */}
        <Paper
          key={toolbarKey} // Force re-render to update active states
          elevation={2}
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss when clicking toolbar
          sx={{
            p: 1,
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            background: "white",
            borderRadius: 1,
          }}
        >
          <Tooltip title="Font Family">
            <IconButton
              ref={fontFamilyButtonRef}
              size="small"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent focus loss
              }}
              onClick={handleFontFamilyMenuOpen}
              sx={{
                minWidth: 32,
                height: 32,
                backgroundColor: fontFamilyMenuAnchor
                  ? "rgba(25, 118, 210, 0.12)"
                  : "transparent",
                border: fontFamilyMenuAnchor
                  ? "1px solid rgba(25, 118, 210, 0.5)"
                  : "1px solid transparent",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <FontDownload />
            </IconButton>
          </Tooltip>
          <Tooltip title="Font Size">
            <IconButton
              ref={fontSizeButtonRef}
              size="small"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent focus loss
              }}
              onClick={handleFontSizeMenuOpen}
              sx={{
                minWidth: 32,
                height: 32,
                backgroundColor: fontSizeMenuAnchor
                  ? "rgba(25, 118, 210, 0.12)"
                  : "transparent",
                border: fontSizeMenuAnchor
                  ? "1px solid rgba(25, 118, 210, 0.5)"
                  : "1px solid transparent",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <FormatSize />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <ToolbarButton command="bold" icon={<FormatBold />} tooltip="Bold" />
          <ToolbarButton
            command="italic"
            icon={<FormatItalic />}
            tooltip="Italic"
          />
          <ToolbarButton
            command="underline"
            icon={<FormatUnderlined />}
            tooltip="Underline"
          />
          <ToolbarButton
            command="strikeThrough"
            icon={<FormatStrikethrough />}
            tooltip="Strikethrough"
          />

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <ToolbarButton
            command="superscript"
            icon={<Superscript />}
            tooltip="Superscript"
          />
          <ToolbarButton
            command="subscript"
            icon={<Subscript />}
            tooltip="Subscript"
          />

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <ToolbarButton
            icon={<FormatColorText />}
            tooltip="Text Color"
            onClick={handleColorPickerOpen}
          />

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <ToolbarButton
            command="insertUnorderedList"
            icon={<FormatListBulleted />}
            tooltip="Bullet List"
          />
          <ToolbarButton
            command="insertOrderedList"
            icon={<FormatListNumbered />}
            tooltip="Numbered List"
          />

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <ToolbarButton
            command="createLink"
            icon={<LinkIcon />}
            tooltip="Insert Link"
            onClick={handleLinkClick}
          />

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Insert Variable">
              <IconButton
                ref={variableButtonRef}
                size="small"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent focus loss
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  // Always use the ref to ensure consistent positioning
                  setVariableMenuAnchor(variableButtonRef.current);
                }}
                sx={{
                  minWidth: 32,
                  height: 32,
                  backgroundColor: variableMenuAnchor
                    ? "rgba(25, 118, 210, 0.12)"
                    : "transparent",
                  border: "1px solid rgba(25, 118, 210, 0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>
            <Box
              component="span"
              sx={{
                fontSize: "12px",
                color: "rgba(0, 0, 0, 0.6)",
                fontWeight: 500,
                userSelect: "none",
              }}
            >
              Variable
            </Box>
          </Box>
        </Paper>

        {/* Color Picker Menu */}
        <Menu
          anchorEl={colorPickerAnchor}
          open={Boolean(colorPickerAnchor)}
          onClose={handleColorPickerClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{
            zIndex: 2000,
            "& .MuiPopover-paper": {
              marginTop: "42px !important",
            },
          }}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          slotProps={{
            paper: {
              style: {
                padding: 8,
                minWidth: 160,
              },
            },
          }}
        >
          <Stack spacing={1.5}>
            {/* Color Picker Input */}
            <Box>
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  marginBottom: 8,
                  display: "block",
                }}
              >
                Pick a Color
              </label>
              <input
                type="color"
                onChange={(e) => applyTextColor(e.target.value)}
                style={{
                  width: "100%",
                  height: 40,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              />
            </Box>

            {/* Common Colors */}
            <Box>
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  marginBottom: 8,
                  display: "block",
                }}
              >
                Common Colors
              </label>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(8, 1fr)",
                  gap: 1,
                }}
              >
                {[
                  "#000000",
                  "#333333",
                  "#666666",
                  "#999999",
                  "#FF0000",
                  "#00FF00",
                  "#0000FF",
                  "#FFFF00",
                  "#FF00FF",
                  "#00FFFF",
                  "#FFA500",
                  "#800080",
                  "#008000",
                  "#FFC0CB",
                  "#A52A2A",
                  "#808080",
                ].map((color) => (
                  <Box
                    key={color}
                    onClick={() => applyTextColor(color)}
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: color,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Custom Color Input */}
            <Box component="form" onSubmit={handleCustomColorSubmit}>
              <TextField
                name="customColor"
                label="Custom Color"
                placeholder="Enter hex, rgb, or color name"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
              />
              <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                Examples: #FF0000, rgb(255,0,0), red
              </Box>
            </Box>
          </Stack>
        </Menu>

        {/* Variable Menu - Rendered outside Paper to avoid z-index issues */}
        <Menu
          anchorEl={variableMenuAnchor}
          open={Boolean(variableMenuAnchor)}
          onClose={handleVariableMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{
            zIndex: 2000,
          }}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          slotProps={{
            paper: {
              style: {
                maxHeight: 200,
                minWidth: 120,
              },
            },
          }}
        >
          <MenuItem
            onClick={() => insertVariable("firstName")}
            onMouseDown={(e) => e.preventDefault()}
          >
            First Name
          </MenuItem>
          <MenuItem
            onClick={() => insertVariable("lastName")}
            onMouseDown={(e) => e.preventDefault()}
          >
            Last Name
          </MenuItem>
          <MenuItem
            onClick={() => insertVariable("fullName")}
            onMouseDown={(e) => e.preventDefault()}
          >
            Full Name
          </MenuItem>
        </Menu>

        {/* Font Family Menu */}
        <Menu
          anchorEl={fontFamilyMenuAnchor}
          open={Boolean(fontFamilyMenuAnchor)}
          onClose={handleFontFamilyMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{
            zIndex: 2000,
          }}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          slotProps={{
            paper: {
              style: {
                maxHeight: 300,
                minWidth: 200,
                overflow: "auto",
              },
            },
          }}
        >
          {FONT_FAMILIES.map((font) => (
            <MenuItem
              key={font.key}
              onClick={() => applyFontFamily(font.key)}
              onMouseDown={(e) => e.preventDefault()}
              sx={{
                fontFamily: font.value,
                fontSize: "14px",
                padding: "8px 16px",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                },
              }}
            >
              {font.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Font Size Menu */}
        <Menu
          anchorEl={fontSizeMenuAnchor}
          open={Boolean(fontSizeMenuAnchor)}
          onClose={handleFontSizeMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{
            zIndex: 2000,
          }}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          slotProps={{
            paper: {
              style: {
                maxHeight: 250,
                minWidth: 120,
                overflow: "auto",
              },
            },
          }}
        >
          {FONT_SIZES.map((size) => (
            <MenuItem
              key={size.value}
              onClick={() => applyFontSize(size.value)}
              onMouseDown={(e) => e.preventDefault()}
              sx={{
                fontSize: size.label,
                padding: "8px 16px",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                },
              }}
            >
              {size.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // Display mode - show the content with custom styling
  const displayStyle = {
    cursor: "pointer" as const,
    minHeight: "40px",
    // Apply padding from style configuration, or default to 8px
    padding: style?.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : "8px",
    border: "1px solid transparent",
    borderRadius: "4px",
    ...(style && {
      color: style.color || undefined,
      backgroundColor: style.backgroundColor || undefined,
      fontSize: style.fontSize || undefined,
      fontFamily: getFontFamilyValue(style.fontFamily) || undefined,
      fontWeight: style.fontWeight || undefined,
      textAlign: style.textAlign || undefined,
    }),
  };

  return (
    <div
      key={`${currentBlockId}-display-${style?.padding ? `${style.padding.top}-${style.padding.bottom}-${style.padding.left}-${style.padding.right}` : "default"}`} // Force re-render when switching blocks or padding changes
      onClick={handleFocus}
      style={displayStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.border = "1px solid #ddd";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.border = "1px solid transparent";
      }}
    >
      {content ? (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          style={{
            minHeight: "20px",
            // Ensure the content inherits the same font styles as the editor
            ...(style && {
              color: style.color || undefined,
              backgroundColor: style.backgroundColor || undefined,
              fontSize: style.fontSize || undefined,
              fontFamily: getFontFamilyValue(style.fontFamily) || undefined,
              fontWeight: style.fontWeight || undefined,
              textAlign: style.textAlign || undefined,
            }),
          }}
        />
      ) : (
        <div style={{ color: "#999", fontStyle: "italic" }}>
          Click to edit text
        </div>
      )}
    </div>
  );
}
