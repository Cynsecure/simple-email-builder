import React, { useRef, useEffect, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
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
  FontDownload,
  FormatSize,
  KeyboardArrowDown,
  MoreHoriz,
} from "@mui/icons-material";

import { useCurrentBlockId } from "../../editor/EditorBlock";
import {
  setDocument,
  useDocument,
  useSelectedBlockId,
} from "../../editor/EditorContext";
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

// Color palette for the color picker - matching sidebar colors
const DEFAULT_PRESET_COLORS = [
  "#E11D48",
  "#DB2777",
  "#C026D3",
  "#9333EA",
  "#7C3AED",
  "#4F46E5",
  "#2563EB",
  "#0284C7",
  "#0891B2",
  "#0D9488",
  "#059669",
  "#16A34A",
  "#65A30D",
  "#CA8A04",
  "#D97706",
  "#EA580C",
  "#DC2626",
  "#FFFFFF",
  "#FAFAFA",
  "#F5F5F5",
  "#E5E5E5",
  "#D4D4D4",
  "#A3A3A3",
  "#737373",
  "#525252",
  "#404040",
  "#262626",
  "#171717",
  "#0A0A0A",
  "#000000",
];

// Helper function to convert font family key to CSS value
const getFontFamilyValue = (
  fontFamilyKey: string | null | undefined
): string | undefined => {
  if (!fontFamilyKey) return undefined;
  const fontFamily = FONT_FAMILIES.find((f) => f.key === fontFamilyKey);
  return fontFamily ? fontFamily.value : fontFamilyKey;
};

// Color swatch component - matching sidebar implementation
const ColorSwatch = ({
  paletteColors,
  value,
  onChange,
}: {
  paletteColors: string[];
  value: string;
  onChange: (value: string) => void;
}) => {
  const renderButton = (colorValue: string) => {
    return (
      <Button
        key={colorValue}
        onClick={() => onChange(colorValue)}
        sx={{
          width: 24,
          height: 24,
          backgroundColor: colorValue,
          border: "1px solid",
          borderColor: value === colorValue ? "black" : "grey.200",
          minWidth: 24,
          display: "inline-flex",
          "&:hover": {
            backgroundColor: colorValue,
            borderColor: "grey.500",
          },
        }}
      />
    );
  };

  return (
    <Box
      width="100%"
      sx={{
        display: "grid",
        gap: 1,
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
      }}
    >
      {paletteColors.map((c) => renderButton(c))}
    </Box>
  );
};

export default function TextEditor({ style, props }: TextProps) {
  const editorDocument = useDocument();
  const currentBlockId = useCurrentBlockId();
  const selectedBlockId = useSelectedBlockId();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
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
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [previewColor, setPreviewColor] = useState<string>("#000000");
  const colorPickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [fontFamilyMenuAnchor, setFontFamilyMenuAnchor] =
    useState<null | HTMLElement>(null);
  const fontFamilyButtonRef = useRef<HTMLButtonElement>(null);
  const [fontSizeMenuAnchor, setFontSizeMenuAnchor] =
    useState<null | HTMLElement>(null);
  const fontSizeButtonRef = useRef<HTMLButtonElement>(null);
  const colorPickerButtonRef = useRef<HTMLButtonElement>(null);
  const [moreOptionsMenuAnchor, setMoreOptionsMenuAnchor] =
    useState<null | HTMLElement>(null);
  const moreOptionsButtonRef = useRef<HTMLButtonElement>(null);

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

  // Exit editing mode when another block is selected
  useEffect(() => {
    if (isEditing && selectedBlockId && selectedBlockId !== currentBlockId) {
      // Close any open menus
      setFontFamilyMenuAnchor(null);
      setFontSizeMenuAnchor(null);
      setColorPickerAnchor(null);
      setVariableMenuAnchor(null);
      setMoreOptionsMenuAnchor(null);

      // Update content and exit editing mode
      updateContent();
      setIsEditing(false);
    }
  }, [selectedBlockId, currentBlockId, isEditing]);

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
    // Don't blur if any menus are open - let them handle the interaction
    if (
      colorPickerAnchor ||
      fontFamilyMenuAnchor ||
      fontSizeMenuAnchor ||
      variableMenuAnchor ||
      moreOptionsMenuAnchor
    ) {
      return;
    }

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
        relatedTarget.closest("form") ||
        relatedTarget.closest(".MuiButton-root"))
    ) {
      return;
    }

    // Close any open menus when blurring
    setFontFamilyMenuAnchor(null);
    setFontSizeMenuAnchor(null);
    setColorPickerAnchor(null);
    setVariableMenuAnchor(null);
    setMoreOptionsMenuAnchor(null);

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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (colorPickerTimeoutRef.current) {
        clearTimeout(colorPickerTimeoutRef.current);
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
            width: 32,
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
            p: 0,
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

      // Try to get current color from selection
      const parentElement =
        selection.getRangeAt(0).commonAncestorContainer.parentElement;
      if (parentElement) {
        const computedStyle = window.getComputedStyle(parentElement);
        const currentTextColor = computedStyle.color;
        // Convert rgb to hex if needed
        if (currentTextColor && currentTextColor.startsWith("rgb")) {
          const rgbMatch = currentTextColor.match(/\d+/g);
          if (rgbMatch && rgbMatch.length === 3) {
            const hex =
              "#" +
              rgbMatch
                .map((x) => parseInt(x).toString(16).padStart(2, "0"))
                .join("");
            setCurrentColor(hex);
            setPreviewColor(hex);
          }
        } else if (currentTextColor && currentTextColor.startsWith("#")) {
          setCurrentColor(currentTextColor);
          setPreviewColor(currentTextColor);
        }
      }
    } else {
      // If no selection, use current color or default
      setPreviewColor(currentColor);
    }

    setColorPickerAnchor(colorPickerButtonRef.current);
  };

  const handleColorPickerClose = () => {
    // Clear any pending timeouts
    if (colorPickerTimeoutRef.current) {
      clearTimeout(colorPickerTimeoutRef.current);
    }

    setColorPickerAnchor(null);
    setSavedSelection(null);
  };

  const applyTextColor = (color: string, shouldCloseMenu: boolean = false) => {
    if (color && editorRef.current) {
      // Update the current color state
      setCurrentColor(color);

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

      // After applying color, position cursor at the end of the selection
      setTimeout(() => {
        if (savedSelection && editorRef.current) {
          const selection = window.getSelection();
          if (selection) {
            // Create a new range at the end of the previously selected text
            const range = document.createRange();
            range.setStart(
              savedSelection.endContainer,
              savedSelection.endOffset
            );
            range.collapse(true); // Collapse to start (which is the end position)

            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }, 20);

      if (shouldCloseMenu) {
        handleColorPickerClose();
      }

      // Update content to reflect the change
      setTimeout(() => {
        updateContent();
      }, 30);
    }
  };

  const handleColorConfirm = () => {
    // Apply the preview color to the text
    applyTextColor(previewColor, true);

    // Refocus the editor to keep it in editing mode
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 50);
  };

  const handleColorCancel = () => {
    // Reset preview color to current color and close menu
    setPreviewColor(currentColor);
    handleColorPickerClose();
  };

  const handleVariableMenuClose = () => {
    setVariableMenuAnchor(null);
  };

  const handleMoreOptionsMenuClose = () => {
    setMoreOptionsMenuAnchor(null);
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 0 : 1,
          position: "relative",
        }}
      >
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
            maxHeight: "200px",
            maxWidth: "100%",
            overflowY: "auto",
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: style?.padding ? style.padding.left : 8,
            paddingRight: style?.padding ? style.padding.right : 8,
            border: "2px solid #1976d2",
            borderRadius: "4px",
            outline: "none",
            cursor: "text",
            lineHeight: 1.5,
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

        {/* Rich Text Toolbar - Floating on mobile, block on desktop */}
        <Paper
          key={toolbarKey}
          elevation={isMobile ? 4 : 2}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(ev) => ev.stopPropagation()}
          sx={{
            p: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            alignItems: "center",
            background: "white",
            borderRadius: isMobile ? 20 : 1,
            ...(isMobile && {
              position: "absolute",
              bottom: { xs: -60, sm: -50, md: -45 },
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: "fab",
              boxShadow: 2,
              paddingX: 1,
              paddingY: 0.5,
              maxWidth: { xs: "200px", sm: "250px", md: "300px" },
              overflowX: "auto",
            }),
          }}
        >
          {/* Essential tools always visible */}
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <ToolbarButton
              command="bold"
              icon={<FormatBold />}
              tooltip="Bold"
            />
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

            {/* Show more tools on lg+ screens */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <ToolbarButton
                command="strikeThrough"
                icon={<FormatStrikethrough />}
                tooltip="Strikethrough"
              />
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

              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 0.5, height: 24 }}
              />

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

              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 0.5, height: 24 }}
              />

              <Tooltip title="Font Family">
                <IconButton
                  ref={fontFamilyButtonRef}
                  size="small"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent focus loss
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleFontFamilyMenuOpen(event);
                  }}
                  sx={{
                    width: 32,
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
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleFontSizeMenuOpen(event);
                  }}
                  sx={{
                    width: 32,
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

              <Tooltip title="Text Color">
                <IconButton
                  ref={colorPickerButtonRef}
                  size="small"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent focus loss
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleColorPickerOpen(event);
                  }}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: colorPickerAnchor
                      ? "rgba(25, 118, 210, 0.12)"
                      : "transparent",
                    border: colorPickerAnchor
                      ? "1px solid rgba(25, 118, 210, 0.5)"
                      : "1px solid transparent",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <FormatColorText />
                </IconButton>
              </Tooltip>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 0.5, height: 24 }}
              />

              <ToolbarButton
                command="createLink"
                icon={<LinkIcon />}
                tooltip="Insert Link"
                onClick={handleLinkClick}
              />

              <Tooltip title="Insert Variable">
                <Button
                  ref={variableButtonRef}
                  size="small"
                  endIcon={<KeyboardArrowDown />}
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
                    minWidth: "auto",
                    height: 32,
                    fontSize: "11px",
                    textTransform: "none",
                    backgroundColor: variableMenuAnchor
                      ? "rgba(25, 118, 210, 0.12)"
                      : "transparent",
                    color: "rgba(0, 0, 0, 0.7)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                    "& .MuiButton-endIcon": {
                      marginLeft: 0.5,
                    },
                  }}
                >
                  Variable
                </Button>
              </Tooltip>
            </Box>

            {/* More options menu for xs, sm, md screens */}
            <Box
              sx={{ display: { xs: "flex", lg: "none" }, alignItems: "center" }}
            >
              <Tooltip title="More Options">
                <IconButton
                  ref={moreOptionsButtonRef}
                  size="small"
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setMoreOptionsMenuAnchor(moreOptionsButtonRef.current);
                  }}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: moreOptionsMenuAnchor
                      ? "rgba(25, 118, 210, 0.12)"
                      : "transparent",
                    border: moreOptionsMenuAnchor
                      ? "1px solid rgba(25, 118, 210, 0.5)"
                      : "1px solid transparent",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <MoreHoriz />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {/* Color Picker Menu */}
        <Menu
          anchorEl={colorPickerAnchor}
          open={Boolean(colorPickerAnchor)}
          onClose={(event, reason) => {
            // Auto-apply color when clicking outside or pressing escape
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
              handleColorConfirm();
              return;
            }
            handleColorPickerClose();
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
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
                maxHeight: "auto",
                minWidth: 300,
                overflow: "visible",
              },
            },
          }}
        >
          <Stack
            spacing={1}
            sx={{
              p: 1,
              ".react-colorful__pointer ": {
                width: 16,
                height: 16,
              },
              ".react-colorful__saturation": {
                mb: 1,
                borderRadius: "4px",
              },
              ".react-colorful__last-control": {
                borderRadius: "4px",
              },
              ".react-colorful__hue-pointer": {
                width: "4px",
                borderRadius: "4px",
                height: 24,
                cursor: "col-resize",
              },
              ".react-colorful__saturation-pointer": {
                cursor: "all-scroll",
              },
              input: {
                padding: 1,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: "4px",
                width: "100%",
              },
            }}
          >
            <HexColorPicker
              color={previewColor}
              onChange={(color) => {
                setPreviewColor(color);
              }}
            />
            <ColorSwatch
              paletteColors={DEFAULT_PRESET_COLORS}
              value={previewColor}
              onChange={(color) => {
                setPreviewColor(color);
              }}
            />
            <Box pt={1}>
              <HexColorInput
                prefixed
                color={previewColor}
                onChange={(color) => {
                  if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
                    setPreviewColor(color);
                  }
                }}
              />
            </Box>

            {/* Action Buttons */}
            <Box
              pt={1}
              sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
            >
              <Button
                size="small"
                variant="outlined"
                onClick={handleColorCancel}
                sx={{ minWidth: 60 }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleColorConfirm}
                sx={{ minWidth: 60 }}
              >
                OK
              </Button>
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

        {/* More Options Menu - Only shown on xs screens */}
        <Menu
          anchorEl={moreOptionsMenuAnchor}
          open={Boolean(moreOptionsMenuAnchor)}
          onClose={handleMoreOptionsMenuClose}
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
                maxHeight: 400,
                minWidth: 200,
                overflow: "auto",
              },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              executeCommand("strikeThrough");
              handleMoreOptionsMenuClose();
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <FormatStrikethrough sx={{ mr: 1 }} />
            Strikethrough
          </MenuItem>
          <MenuItem
            onClick={() => {
              executeCommand("superscript");
              handleMoreOptionsMenuClose();
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Superscript sx={{ mr: 1 }} />
            Superscript
          </MenuItem>
          <MenuItem
            onClick={() => {
              executeCommand("subscript");
              handleMoreOptionsMenuClose();
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Subscript sx={{ mr: 1 }} />
            Subscript
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              executeCommand("insertUnorderedList");
              handleMoreOptionsMenuClose();
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <FormatListBulleted sx={{ mr: 1 }} />
            Bullet List
          </MenuItem>
          <MenuItem
            onClick={() => {
              executeCommand("insertOrderedList");
              handleMoreOptionsMenuClose();
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <FormatListNumbered sx={{ mr: 1 }} />
            Numbered List
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleMoreOptionsMenuClose();
              setFontFamilyMenuAnchor(moreOptionsButtonRef.current);
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <FontDownload sx={{ mr: 1 }} />
            Font Family
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMoreOptionsMenuClose();
              setFontSizeMenuAnchor(moreOptionsButtonRef.current);
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <FormatSize sx={{ mr: 1 }} />
            Font Size
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMoreOptionsMenuClose();
              setColorPickerAnchor(moreOptionsButtonRef.current);
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <FormatColorText sx={{ mr: 1 }} />
            Text Color
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleMoreOptionsMenuClose();
              handleLinkClick(new MouseEvent("click") as any);
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <LinkIcon sx={{ mr: 1 }} />
            Insert Link
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMoreOptionsMenuClose();
              setVariableMenuAnchor(moreOptionsButtonRef.current);
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <KeyboardArrowDown sx={{ mr: 1 }} />
            Insert Variable
          </MenuItem>
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
