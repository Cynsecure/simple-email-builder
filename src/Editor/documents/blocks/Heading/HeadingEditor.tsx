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
  Person as PersonIcon,
} from "@mui/icons-material";

import { useCurrentBlockId } from "../../editor/EditorBlock";
import { setDocument, useDocument } from "../../editor/EditorContext";

import { HeadingProps, HeadingPropsDefaults } from "./HeadingPropsSchema";

// Helper function to get appropriate font size for heading level
const getHeadingFontSize = (level: string) => {
  switch (level) {
    case "h1":
      return "2em";
    case "h2":
      return "1.5em";
    case "h3":
      return "1.17em";
    case "h4":
      return "1em";
    case "h5":
      return "0.83em";
    case "h6":
      return "0.67em";
    default:
      return "1.5em";
  }
};

export default function HeadingEditor({ style, props }: HeadingProps) {
  const editorDocument = useDocument();
  const currentBlockId = useCurrentBlockId();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toolbarKey, setToolbarKey] = useState(0);
  const lastContentRef = useRef<string>("");
  const [variableMenuAnchor, setVariableMenuAnchor] =
    useState<null | HTMLElement>(null);
  const variableButtonRef = useRef<HTMLButtonElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const content = props?.text || HeadingPropsDefaults.text;
  const level = props?.level || HeadingPropsDefaults.level;

  useEffect(() => {
    if (editorRef.current && !isEditing && content !== lastContentRef.current) {
      editorRef.current.innerHTML = content;
      lastContentRef.current = content;
    }
  }, [content, isEditing]);

  const executeCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      window.document.execCommand(command, false, value);
      setTimeout(() => {
        setToolbarKey((prev) => prev + 1);
      }, 10);
    }
  };

  const updateContent = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      lastContentRef.current = htmlContent;

      if (htmlContent !== props?.text) {
        setDocument({
          [currentBlockId]: {
            type: "Heading",
            data: {
              ...editorDocument[currentBlockId].data,
              props: {
                ...props,
                text: htmlContent, // Store HTML content to preserve formatting
              },
            },
          },
        });
      }
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (editorRef.current) {
        if (content && editorRef.current.innerHTML !== content) {
          editorRef.current.innerHTML = content;
          lastContentRef.current = content;
        }
        editorRef.current.focus();

        if (content) {
          const range = window.document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    }, 10);
  };

  const handleBlur = (e: React.FocusEvent) => {
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
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(updateContent, 300);
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

    handleVariableMenuClose();
    editorRef.current.focus();

    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(variableText);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editorRef.current.appendChild(document.createTextNode(variableText));
      }
      setTimeout(() => {
        updateContent();
      }, 10);
    } catch (error) {
      editorRef.current.appendChild(document.createTextNode(variableText));
      updateContent();
    }
  };

  const ToolbarButton = ({
    command,
    icon,
    tooltip,
    onClick,
  }: {
    command?: string;
    icon: React.ReactNode;
    tooltip: string;
    onClick?: () => void;
  }) => {
    const isActive = command
      ? window.document.queryCommandState(command)
      : false;

    return (
      <Tooltip title={tooltip}>
        <IconButton
          size="small"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (onClick) {
              onClick();
            } else if (command) {
              executeCommand(command);
            }
          }}
          sx={{
            minWidth: 32,
            height: 32,
            backgroundColor: isActive
              ? "rgba(25, 118, 210, 0.12)"
              : "transparent",
            border: isActive
              ? "1px solid rgba(25, 118, 210, 0.5)"
              : "1px solid transparent",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  };

  if (isEditing) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Heading Editor */}
        <div
          key={currentBlockId}
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
            margin: 0,
            // Apply heading-specific styles
            fontSize: getHeadingFontSize(level),
            fontWeight: "bold", // Default bold for headings
            ...(style && {
              color: style.color || undefined,
              backgroundColor: style.backgroundColor || undefined,
              fontFamily: style.fontFamily || undefined,
              fontWeight: style.fontWeight || "bold", // Override with style or keep bold default
              textAlign: style.textAlign || undefined,
            }),
          }}
        />

        {/* Simplified Toolbar for Headings */}
        <Paper
          key={toolbarKey}
          elevation={2}
          onMouseDown={(e) => e.preventDefault()}
          sx={{
            p: 1,
            display: "flex",
            gap: 0.5,
            alignItems: "center",
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Insert Variable">
              <IconButton
                ref={variableButtonRef}
                size="small"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
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

        {/* Variable Menu */}
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
          sx={{ zIndex: 2000 }}
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
      </Box>
    );
  }

  // Display mode - apply the same padding as would be used in preview mode
  const displayStyle = {
    cursor: "pointer" as const,
    minHeight: "40px",
    border: "1px solid transparent",
    borderRadius: "4px",
    margin: 0,
    fontSize: getHeadingFontSize(level),
    fontWeight: "bold", // Default bold for headings
    // Apply padding from style, or default to small padding for editor
    padding: style?.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : "8px",
    ...(style && {
      color: style.color || undefined,
      backgroundColor: style.backgroundColor || undefined,
      fontFamily: style.fontFamily || undefined,
      fontWeight: style.fontWeight || "bold", // Override with style or keep bold default
      textAlign: style.textAlign || undefined,
    }),
  };

  return (
    <div
      key={currentBlockId}
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
        <span style={{ color: "#999", fontStyle: "italic" }}>
          Click to edit heading
        </span>
      )}
    </div>
  );
}
