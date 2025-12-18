import React, { useState, useRef, useEffect } from "react";
import { Paper, Box, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";

// Constants
const BLOCK_TYPES = {
  TEXT: "Text",
  HEADING: "Heading",
  BUTTON: "Button",
  IMAGE: "Image",
  CONTAINER: "Container",
  COLUMNS_CONTAINER: "ColumnsContainer",
  SPACER: "Spacer",
  DIVIDER: "Divider",
  HTML: "Html",
  AVATAR: "Avatar",
} as const;

// Block type groups for different features
const BLOCK_GROUPS = {
  TEXT_COLOR_SUPPORTED: [
    BLOCK_TYPES.TEXT,
    BLOCK_TYPES.HEADING,
    BLOCK_TYPES.BUTTON,
    BLOCK_TYPES.HTML,
    BLOCK_TYPES.DIVIDER,
  ],
  BACKGROUND_COLOR_SUPPORTED: [
    BLOCK_TYPES.TEXT,
    BLOCK_TYPES.HEADING,
    BLOCK_TYPES.BUTTON,
    BLOCK_TYPES.IMAGE,
    BLOCK_TYPES.CONTAINER,
    BLOCK_TYPES.COLUMNS_CONTAINER,
    BLOCK_TYPES.SPACER,
    BLOCK_TYPES.DIVIDER,
    BLOCK_TYPES.HTML,
  ],
  FONT_SIZE_SUPPORTED: [BLOCK_TYPES.TEXT, BLOCK_TYPES.BUTTON, BLOCK_TYPES.HTML],
  FONT_FAMILY_SUPPORTED: [
    BLOCK_TYPES.TEXT,
    BLOCK_TYPES.HEADING,
    BLOCK_TYPES.BUTTON,
    BLOCK_TYPES.HTML,
  ],
  FONT_WEIGHT_SUPPORTED: [BLOCK_TYPES.BUTTON, BLOCK_TYPES.HTML],
  PADDING_SUPPORTED: [
    BLOCK_TYPES.TEXT,
    BLOCK_TYPES.HEADING,
    BLOCK_TYPES.BUTTON,
    BLOCK_TYPES.HTML,
    BLOCK_TYPES.CONTAINER,
    BLOCK_TYPES.COLUMNS_CONTAINER,
    BLOCK_TYPES.IMAGE,
    BLOCK_TYPES.AVATAR,
    BLOCK_TYPES.DIVIDER,
  ],
  IMAGE_SETTINGS_SUPPORTED: [BLOCK_TYPES.IMAGE, BLOCK_TYPES.AVATAR],
  LINK_SETTINGS_SUPPORTED: [BLOCK_TYPES.BUTTON, BLOCK_TYPES.IMAGE],
  RESPONSIVE_LAYOUT: [
    BLOCK_TYPES.IMAGE,
    BLOCK_TYPES.AVATAR,
    BLOCK_TYPES.TEXT,
    BLOCK_TYPES.HEADING,
  ],
} as const;

type TabType =
  | "styles"
  | "colors"
  | "fonts"
  | "alignment"
  | "links"
  | "image"
  | "html"
  | "columns"
  | "backdrop-color"
  | "canvas-color"
  | "canvas-border-color"
  | "canvas-border-radius"
  | "global-font-family"
  | "global-text-color";

interface BottomToolbarProps {
  selectedBlock: any;
  hasSelectedBlock: boolean;
  keyboardHeight: number;
  showPanel: boolean;
  activeTab: string;
  showTextColorPicker: boolean;
  showBgColorPicker: boolean;
  showBorderColorPicker: boolean;
  showFontSizePicker: boolean;
  showFontFamilyPicker: boolean;
  showPaddingPicker: boolean;
  showHeadingPicker: boolean;
  showButtonVariantPicker: boolean;
  onTabClick: (tab: TabType) => void;
  onTextColorPickerToggle: () => void;
  onBgColorPickerToggle: () => void;
  onBorderColorPickerToggle: () => void;
  onFontSizePickerToggle: () => void;
  onFontFamilyPickerToggle: () => void;
  onHeadingLevelChange: (level: string) => void;
  onFontWeightToggle: () => void;
  onPaddingPickerToggle: () => void;
  onHeadingPickerToggle: () => void;
  onButtonVariantPickerToggle: () => void;
}

// Toolbar button configuration
interface ToolbarButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  condition: boolean;
}

export default function BottomToolbar(props: BottomToolbarProps) {
  const {
    selectedBlock,
    hasSelectedBlock,
    keyboardHeight,
    showPanel,
    activeTab,
    onTabClick,
  } = props;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Helper function to check if block supports feature
  const blockSupports = (feature: keyof typeof BLOCK_GROUPS): boolean => {
    if (!selectedBlock?.type) return false;
    return (BLOCK_GROUPS[feature] as readonly string[]).includes(
      selectedBlock.type
    );
  };

  // Check if block should use responsive layout
  const useResponsiveLayout = blockSupports("RESPONSIVE_LAYOUT");

  // Scroll management
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const canScroll = scrollWidth > clientWidth;

      if (!canScroll) {
        setShowRightArrow(false);
        return;
      }

      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hasSelectedBlock, selectedBlock]);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        left: scrollWidth - clientWidth,
        behavior: "smooth",
      });
    }
  };

  // Generate toolbar buttons configuration
  const getToolbarButtons = (): ToolbarButton[] => {
    if (!selectedBlock) return [];

    const buttons: ToolbarButton[] = [];

    // Button Variant Picker
    if (selectedBlock.type === BLOCK_TYPES.BUTTON) {
      buttons.push({
        id: "variant",
        icon: <Icon icon="material-symbols:toggle-off" fontSize={24} />,
        label: "Variant",
        isActive: props.showButtonVariantPicker,
        onClick: props.onButtonVariantPickerToggle,
        condition: true,
      });
    }

    // Text Color Button
    if (blockSupports("TEXT_COLOR_SUPPORTED")) {
      buttons.push({
        id: "textColor",
        icon:
          selectedBlock.type === BLOCK_TYPES.DIVIDER ? (
            <Icon icon="radix-icons:border-solid" fontSize={24} />
          ) : (
            <Icon
              icon="material-symbols:format-color-text"
              style={{ fontSize: 24 }}
            />
          ),
        label:
          selectedBlock.type === BLOCK_TYPES.DIVIDER
            ? "Line Color"
            : "Text Color",
        isActive: props.showTextColorPicker,
        onClick: props.onTextColorPickerToggle,
        condition: true,
      });
    }

    // Background Color Button
    if (blockSupports("BACKGROUND_COLOR_SUPPORTED")) {
      buttons.push({
        id: "bgColor",
        icon: (
          <Icon
            icon="material-symbols:format-color-fill"
            style={{ fontSize: 24 }}
          />
        ),
        label:
          selectedBlock.type === BLOCK_TYPES.BUTTON &&
          (selectedBlock.data as any)?.props?.variant === "bordered"
            ? "Border Color"
            : "Bg Color",
        isActive: props.showBgColorPicker,
        onClick: props.onBgColorPickerToggle,
        condition: true,
      });
    }

    // Border Color Button (Container only)
    if (selectedBlock.type === BLOCK_TYPES.CONTAINER) {
      buttons.push({
        id: "borderColor",
        icon: <Icon icon="radix-icons:border-solid" fontSize={24} />,
        label: "Border Color",
        isActive: props.showBorderColorPicker,
        onClick: props.onBorderColorPickerToggle,
        condition: true,
      });
    }

    // Font Size Button
    if (blockSupports("FONT_SIZE_SUPPORTED")) {
      buttons.push({
        id: "fontSize",
        icon: (
          <Icon
            icon="material-symbols:text-increase"
            style={{ fontSize: 24 }}
          />
        ),
        label: "Size",
        isActive: props.showFontSizePicker,
        onClick: props.onFontSizePickerToggle,
        condition: true,
      });
    }

    // Font Family Button
    if (blockSupports("FONT_FAMILY_SUPPORTED")) {
      buttons.push({
        id: "fontFamily",
        icon: (
          <Icon
            icon="material-symbols:font-download"
            style={{ fontSize: 24 }}
          />
        ),
        label: "Family",
        isActive: props.showFontFamilyPicker,
        onClick: props.onFontFamilyPickerToggle,
        condition: true,
      });
    }

    // Heading Picker Button
    if (selectedBlock.type === BLOCK_TYPES.HEADING) {
      buttons.push({
        id: "heading",
        icon: <Icon icon="lucide:heading" fontSize={24} />,
        label: "Heading",
        isActive: props.showHeadingPicker,
        onClick: props.onHeadingPickerToggle,
        condition: true,
      });
    }

    // Font Weight Button
    if (blockSupports("FONT_WEIGHT_SUPPORTED")) {
      const isBold = (selectedBlock?.data as any)?.style?.fontWeight === "bold";
      buttons.push({
        id: "fontWeight",
        icon: (
          <Icon icon="material-symbols:format-bold" style={{ fontSize: 24 }} />
        ),
        label: isBold ? "Bold" : "Regular",
        isActive: isBold,
        onClick: props.onFontWeightToggle,
        condition: true,
      });
    }

    // Padding Button
    if (blockSupports("PADDING_SUPPORTED")) {
      buttons.push({
        id: "padding",
        icon: (
          <Icon icon="material-symbols:space-bar" style={{ fontSize: 24 }} />
        ),
        label: "Padding",
        isActive: props.showPaddingPicker,
        onClick: props.onPaddingPickerToggle,
        condition: true,
      });
    }

    // Alignment Button
    buttons.push({
      id: "alignment",
      icon: (
        <Icon
          icon="material-symbols:format-align-center"
          style={{ fontSize: 24 }}
        />
      ),
      label: "Align",
      isActive: showPanel && activeTab === "alignment",
      onClick: () => onTabClick("alignment"),
      condition: true,
    });

    // Image Settings Button
    if (blockSupports("IMAGE_SETTINGS_SUPPORTED")) {
      buttons.push({
        id: "image",
        icon: (
          <Icon
            icon="material-symbols:photo-library"
            style={{ fontSize: 24 }}
          />
        ),
        label: "Image",
        isActive: showPanel && activeTab === "image",
        onClick: () => onTabClick("image"),
        condition: true,
      });
    }

    // HTML Settings Button
    if (selectedBlock.type === BLOCK_TYPES.HTML) {
      buttons.push({
        id: "html",
        icon: <Icon icon="material-symbols:code" style={{ fontSize: 24 }} />,
        label: "HTML",
        isActive: showPanel && activeTab === "html",
        onClick: () => onTabClick("html"),
        condition: true,
      });
    }

    // Columns Settings Button
    if (selectedBlock.type === BLOCK_TYPES.COLUMNS_CONTAINER) {
      buttons.push({
        id: "columns",
        icon: (
          <Icon icon="material-symbols:view-column" style={{ fontSize: 24 }} />
        ),
        label: "Columns",
        isActive: showPanel && activeTab === "columns",
        onClick: () => onTabClick("columns"),
        condition: true,
      });
    }

    // Link Settings Button
    if (blockSupports("LINK_SETTINGS_SUPPORTED")) {
      buttons.push({
        id: "links",
        icon: <Icon icon="material-symbols:link" style={{ fontSize: 24 }} />,
        label: "Links",
        isActive: showPanel && activeTab === "links",
        onClick: () => onTabClick("links"),
        condition: true,
      });
    }

    return buttons.filter((button) => button.condition);
  };

  // Common styles
  const buttonContainerStyles = {
    cursor: "pointer",
    flex: {
      xs: useResponsiveLayout ? "1 1 0" : "0 0 auto",
      sm: "1 1 0",
    },
    minWidth: { xs: "60px", sm: "70px" },
    maxWidth: {
      xs: useResponsiveLayout ? "none" : "auto",
      sm: useResponsiveLayout ? "200px" : "120px",
    },
    scrollSnapAlign: "center",
    minHeight: "64px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const iconButtonStyles = (isActive: boolean) => ({
    color: isActive ? "primary.main" : "text.secondary",
    "&:hover": { bgcolor: "action.hover" },
    mb: 0.5,
  });

  const labelStyles = (isActive: boolean) => ({
    fontSize: "0.7rem",
    color: isActive ? "primary.main" : "text.secondary",
    textAlign: "center",
    lineHeight: 1,
  });

  return (
    <Paper
      data-bottom-toolbar
      sx={{
        position: "fixed",
        bottom: keyboardHeight,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderTop: 1,
        borderColor: "divider",
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: !hasSelectedBlock ? "flex-start" : "center",
          alignItems: "center",
          pb: 2,
          px: 0,
          overflow: "hidden",
        }}
      >
        {!hasSelectedBlock ? (
          <GlobalControlsToolbar
            showPanel={showPanel}
            activeTab={activeTab}
            onTabClick={onTabClick}
          />
        ) : (
          <Box sx={{ position: "relative", width: "100%" }}>
            {/* Right Arrow */}
            {showRightArrow && (
              <IconButton
                onClick={scrollRight}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  bgcolor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  width: 36,
                  height: 36,
                  display: { xs: "flex", sm: "none" },
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.85)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                <Icon
                  icon="material-symbols:chevron-right"
                  style={{ fontSize: "small" }}
                />
              </IconButton>
            )}

            <Box
              ref={scrollContainerRef}
              onScroll={checkScrollButtons}
              sx={{
                display: "flex",
                width: "100%",
                overflowX: "auto",
                overflowY: "hidden",
                gap: { xs: 1, sm: 2, md: 3 },
                px: { xs: showRightArrow ? "0 44px 0 0" : 0, sm: 2 },
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollSnapType: "x mandatory",
                justifyContent: {
                  xs: useResponsiveLayout ? "space-around" : "flex-start",
                  sm: "space-around",
                },
                "& > *": buttonContainerStyles,
              }}
            >
              {getToolbarButtons().map((button) => (
                <ToolbarButton
                  key={button.id}
                  button={button}
                  iconButtonStyles={iconButtonStyles}
                  labelStyles={labelStyles}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

// Reusable Toolbar Button Component
interface ToolbarButtonProps {
  button: ToolbarButton;
  iconButtonStyles: (isActive: boolean) => any;
  labelStyles: (isActive: boolean) => any;
}

function ToolbarButton({
  button,
  iconButtonStyles,
  labelStyles,
}: ToolbarButtonProps) {
  return (
    <Box onClick={button.onClick}>
      <IconButton sx={iconButtonStyles(button.isActive)}>
        {button.icon}
      </IconButton>
      <Box sx={labelStyles(button.isActive)}>{button.label}</Box>
    </Box>
  );
}

// Global Controls Toolbar Component
interface GlobalControlsToolbarProps {
  showPanel: boolean;
  activeTab: string;
  onTabClick: (tab: TabType) => void;
}

function GlobalControlsToolbar({
  showPanel,
  activeTab,
  onTabClick,
}: GlobalControlsToolbarProps) {
  const globalControls = [
    {
      id: "global-font-family" as const,
      icon: (
        <Icon icon="material-symbols:font-download" style={{ fontSize: 24 }} />
      ),
      label: "Font Family",
    },
    {
      id: "global-text-color" as const,
      icon: (
        <Icon
          icon="material-symbols:format-color-text"
          style={{ fontSize: 24 }}
        />
      ),
      label: "Text Color",
    },
    {
      id: "backdrop-color" as const,
      icon: <Icon icon="material-symbols:wallpaper" style={{ fontSize: 24 }} />,
      label: "Backdrop Color",
    },
    {
      id: "canvas-color" as const,
      icon: (
        <Icon
          icon="material-symbols:format-color-fill"
          style={{ fontSize: 24 }}
        />
      ),
      label: "Canvas Color",
    },
    {
      id: "canvas-border-color" as const,
      icon: <Icon icon="radix-icons:border-solid" fontSize={24} />,
      label: "Border Color",
    },
    {
      id: "canvas-border-radius" as const,
      icon: (
        <Icon icon="material-symbols:rounded-corner" style={{ fontSize: 24 }} />
      ),
      label: "Border Radius",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        gap: { xs: 1, sm: 2 },
        px: { xs: 0.5, sm: 1 },
        justifyContent: "space-around",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        scrollSnapType: "x mandatory",
      }}
    >
      {globalControls.map((control) => (
        <Box
          key={control.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            minWidth: { xs: "70px", sm: "80px" },
            maxWidth: { xs: "none", sm: "200px" },
            flex: "1 1 0",
            scrollSnapAlign: "center",
            minHeight: "64px",
            justifyContent: "center",
          }}
          onClick={() => onTabClick(control.id)}
        >
          <IconButton
            sx={{
              color:
                showPanel && activeTab === control.id
                  ? "primary.main"
                  : "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
              mb: 0.5,
              minWidth: "40px",
              minHeight: "40px",
            }}
          >
            {control.icon}
          </IconButton>
          <Box
            sx={{
              fontSize: "0.7rem",
              color:
                showPanel && activeTab === control.id
                  ? "primary.main"
                  : "text.secondary",
              textAlign: "center",
              lineHeight: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {control.label}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
