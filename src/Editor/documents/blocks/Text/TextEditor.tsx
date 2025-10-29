import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatListBulleted,
  FormatListNumbered,
  Link as LinkIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import { useCurrentBlockId } from "../../editor/EditorBlock";
import { setDocument, useDocument } from "../../editor/EditorContext";

import { TextProps } from "./TextPropsSchema";

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

  const content = props?.richText || props?.text || "";

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
      const textContent = editorRef.current.textContent || "";

      // Update the lastContentRef to current editor content to prevent useEffect interference
      lastContentRef.current = richText;

      // Only update if content actually changed
      if (richText !== props?.richText || textContent !== props?.text) {
        setDocument({
          [currentBlockId]: {
            type: "Text",
            data: {
              ...editorDocument[currentBlockId].data,
              props: {
                ...props,
                richText,
                text: textContent,
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
        relatedTarget.closest(".MuiIconButton-root"))
    ) {
      return;
    }

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
    command: string;
    icon: React.ReactNode;
    tooltip: string;
    value?: string;
    onClick?: () => void;
  }) => {
    // Check if the command is currently active
    const isActive = window.document.queryCommandState(command);

    return (
      <Tooltip title={tooltip}>
        <IconButton
          size="small"
          onMouseDown={(e) => {
            e.preventDefault();
            if (onClick) {
              onClick();
            } else {
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

  const handleLinkClick = () => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
      // Force toolbar update for link button
      setTimeout(() => {
        setToolbarKey((prev) => prev + 1);
      }, 10);
    }
  };

  const handleVariableMenuClose = () => {
    setVariableMenuAnchor(null);
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
      <Box sx={{ position: "relative" }}>
        {/* Rich Text Toolbar */}
        <Paper
          key={toolbarKey} // Force re-render to update active states
          elevation={2}
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss when clicking toolbar
          sx={{
            position: "absolute",
            bottom: -50,
            left: 0,
            right: 0,
            p: 1,
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            zIndex: 1000,
            background: "white",
            borderRadius: 1,
          }}
        >
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

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <ToolbarButton
            command="justifyLeft"
            icon={<FormatAlignLeft />}
            tooltip="Align Left"
          />
          <ToolbarButton
            command="justifyCenter"
            icon={<FormatAlignCenter />}
            tooltip="Align Center"
          />
          <ToolbarButton
            command="justifyRight"
            icon={<FormatAlignRight />}
            tooltip="Align Right"
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

        {/* Rich Text Editor */}
        <div
          key={currentBlockId} // Force re-render when switching blocks
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onInput={handleInput}
          style={{
            minHeight: "40px",
            padding: "8px",
            border: "2px solid #1976d2",
            borderRadius: "4px",
            outline: "none",
            cursor: "text",
            ...(style && {
              color: style.color || undefined,
              backgroundColor: style.backgroundColor || undefined,
              fontSize: style.fontSize || undefined,
              fontFamily: style.fontFamily || undefined,
              fontWeight: style.fontWeight || undefined,
              textAlign: style.textAlign || undefined,
            }),
          }}
        />
      </Box>
    );
  }

  // Display mode - show the content with custom styling
  const displayStyle = {
    cursor: "pointer" as const,
    minHeight: "40px",
    padding: "8px",
    border: "1px solid transparent",
    borderRadius: "4px",
    ...(style && {
      color: style.color || undefined,
      backgroundColor: style.backgroundColor || undefined,
      fontSize: style.fontSize || undefined,
      fontFamily: style.fontFamily || undefined,
      fontWeight: style.fontWeight || undefined,
      textAlign: style.textAlign || undefined,
    }),
  };

  return (
    <div
      key={currentBlockId} // Force re-render when switching blocks
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
          style={{ minHeight: "20px" }}
        />
      ) : (
        <div style={{ color: "#999", fontStyle: "italic" }}>
          Click to edit text
        </div>
      )}
    </div>
  );
}
