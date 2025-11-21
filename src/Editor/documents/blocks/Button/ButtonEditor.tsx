import React, { useRef, useEffect, useState } from "react";
import { Box } from "@mui/material";

import { useCurrentBlockId } from "../../editor/EditorBlock";
import {
  setDocument,
  useDocument,
  useSelectedBlockId,
} from "../../editor/EditorContext";

import { ButtonProps, ButtonPropsDefaults } from "./ButtonPropsSchema";

// Helper function to get button styles based on variant and size
const getButtonStyles = (
  variant: string = "fill",
  size: string = "medium",
  backgroundColor: string = "#007bff",
  color: string = "#ffffff",
  borderColor: string = "#007bff",
  customStyle?: any
) => {
  // Size styles
  const sizeStyles = {
    small: {
      padding: "8px 16px",
      fontSize: "14px",
    },
    medium: {
      padding: "12px 24px",
      fontSize: "16px",
    },
    large: {
      padding: "16px 32px",
      fontSize: "18px",
    },
  };

  // Base styles
  const baseStyles = {
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center" as const,
    fontWeight: "500",
    ...sizeStyles[size as keyof typeof sizeStyles],
  };

  // Variant styles
  if (variant === "bordered") {
    return {
      ...baseStyles,
      backgroundColor: "transparent",
      color: color,
      border: `2px solid ${borderColor}`,
      ...customStyle,
    };
  }

  // Default fill variant
  return {
    ...baseStyles,
    backgroundColor,
    color,
    border: "none",
    ...customStyle,
  };
};

export default function ButtonEditor({ style, props }: ButtonProps) {
  const editorDocument = useDocument();
  const currentBlockId = useCurrentBlockId();
  const selectedBlockId = useSelectedBlockId();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const lastContentRef = useRef<string>("");
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const content = props?.text || ButtonPropsDefaults.text;
  const variant = props?.variant || ButtonPropsDefaults.variant;
  const size = props?.size || ButtonPropsDefaults.size;
  const fullWidth = props?.fullWidth || ButtonPropsDefaults.fullWidth;
  const alignment = props?.alignment || ButtonPropsDefaults.alignment;

  // Helper function to get justifyContent based on alignment
  const getJustifyContent = () => {
    if (fullWidth) return "stretch";
    switch (alignment) {
      case "center":
        return "center";
      case "right":
        return "flex-end";
      default:
        return "flex-start";
    }
  };

  useEffect(() => {
    if (editorRef.current && !isEditing && content !== lastContentRef.current) {
      editorRef.current.textContent = content; // Set plain text
      lastContentRef.current = content;
    }
  }, [content, isEditing]);

  const updateContent = () => {
    if (editorRef.current) {
      // Get plain text content only, stripping any HTML formatting
      const textContent =
        editorRef.current.textContent || editorRef.current.innerText || "";
      lastContentRef.current = textContent;

      if (textContent !== props?.text) {
        setDocument({
          [currentBlockId]: {
            type: "Button",
            data: {
              ...editorDocument[currentBlockId].data,
              props: {
                ...props,
                text: textContent, // Store plain text only
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
      // Update content and exit editing mode
      updateContent();
      setIsEditing(false);
    }
  }, [selectedBlockId, currentBlockId, isEditing]);

  const handleFocus = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (editorRef.current) {
        if (content && editorRef.current.textContent !== content) {
          editorRef.current.textContent = content; // Set plain text
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent rich text formatting shortcuts
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b" || e.key === "i" || e.key === "u") {
        e.preventDefault();
      }
    }
  };

  // Get button styles for current configuration
  // Calculate padding (same logic as preview conversion)
  const basePadding =
    size === "small"
      ? "8px 16px"
      : size === "large"
        ? "16px 32px"
        : "12px 24px";
  let buttonPadding = basePadding;
  // Block style padding is converted to container margin above

  // Calculate margin (configurable like padding)
  const baseMargin = ButtonPropsDefaults.margin;
  let buttonMargin = baseMargin;

  // Use container padding from block style as margin if available
  if (style?.padding) {
    const p = style.padding;
    buttonMargin = {
      top: p.top || baseMargin.top,
      bottom: p.bottom || baseMargin.bottom,
      left: p.left || baseMargin.left,
      right: p.right || baseMargin.right,
    };
  }

  // Get the current background and border colors
  const currentBackgroundColor =
    style?.backgroundColor || ButtonPropsDefaults.backgroundColor;
  const currentBorderColor =
    style?.borderColor || ButtonPropsDefaults.borderColor;

  const buttonStyles = getButtonStyles(
    variant,
    size,
    currentBackgroundColor,
    style?.color || ButtonPropsDefaults.color,
    currentBorderColor,
    {
      // Apply custom styles from the style prop
      ...(style?.fontFamily && { fontFamily: style.fontFamily }),
      ...(style?.fontSize && { fontSize: style.fontSize }),
      ...(style?.fontWeight && { fontWeight: style.fontWeight }),
      ...(fullWidth && { width: "100%" }),
      padding: buttonPadding, // Override padding with calculated value
    }
  );

  if (isEditing) {
    return (
      <Box sx={{ position: "relative" }}>
        {/* Button Editor */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: getJustifyContent(),
            backgroundColor: "transparent", // Ensure Box background is transparent
            // Apply margin from buttonMargin (not padding, that goes on the button itself)
            marginTop: `${buttonMargin.top}px`,
            marginBottom: `${buttonMargin.bottom}px`,
            marginLeft: fullWidth ? 0 : `${buttonMargin.left}px`,
            marginRight: fullWidth ? 0 : `${buttonMargin.right}px`,
            paddingLeft: fullWidth ? `${buttonMargin.left}px` : 0,
            paddingRight: fullWidth ? `${buttonMargin.right}px` : 0,
          }}
        >
          <div
            style={{
              ...buttonStyles,
              border:
                variant === "bordered"
                  ? `2px solid ${currentBorderColor}`
                  : "none",
              minHeight: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              key={currentBlockId}
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              style={{
                outline: "none",
                cursor: "text",
                background: "transparent",
                border: "none",
                width: "100%",
                textAlign: "center",
                color: "inherit",
                fontSize: "inherit",
                fontFamily: "inherit",
                fontWeight: "inherit",
              }}
            />
          </div>
        </Box>
      </Box>
    );
  }

  // Display mode - show as actual button with proper padding
  return (
    <Box
      key={currentBlockId}
      onClick={handleFocus}
      sx={{
        display: "flex",
        justifyContent: getJustifyContent(),
        cursor: "pointer",
        // Apply margin from buttonMargin (not padding, that goes on the button itself)
        marginTop: `${buttonMargin.top}px`,
        marginBottom: `${buttonMargin.bottom}px`,
        marginLeft: fullWidth ? 0 : `${buttonMargin.left}px`,
        marginRight: fullWidth ? 0 : `${buttonMargin.right}px`,
        paddingLeft: fullWidth ? `${buttonMargin.left}px` : 0,
        paddingRight: fullWidth ? `${buttonMargin.right}px` : 0,
        border: "1px solid transparent",
        borderRadius: "4px",
        backgroundColor: "transparent !important", // Force transparent background
        "&:hover": {
          border: "1px solid #ddd",
          backgroundColor: "transparent !important",
        },
      }}
    >
      <div
        style={{
          ...buttonStyles,
          minHeight: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
      >
        {content ? (
          <span
            style={{
              textAlign: "center",
              color: "inherit",
            }}
          >
            {content}
          </span>
        ) : (
          <span style={{ color: "inherit", fontStyle: "italic" }}>
            Click to edit button
          </span>
        )}
      </div>
    </Box>
  );
}
