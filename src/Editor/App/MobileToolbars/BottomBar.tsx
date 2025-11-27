import React, { useState, useEffect, useRef } from "react";
import { Backdrop } from "@mui/material";
import { EditorFileUploadCallback } from "../../types";

import {
  useSelectedBlockId,
  useDocument,
  setDocument,
} from "../../documents/editor/EditorContext";
import {
  TextColorPickerPanel,
  BackgroundColorPickerPanel,
  BorderColorPickerPanel,
} from "./ColorPickerPanels";
import { FontSizePickerPanel, FontFamilyPickerPanel } from "./FontPickerPanels";
import { PaddingPickerPanel } from "./PaddingPickerPanels";
import { HeadingPickerPanel } from "./HeadingPickerPanels";
import { ButtonVariantPickerPanel } from "./ButtonVariantPickerPanel";
import BottomToolbar from "./BottomToolbar";
import CollapsiblePanel from "./CollapsiblePanel";

// Constants for better maintainability
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

const COLOR_SUPPORTED_BLOCKS = [
  BLOCK_TYPES.TEXT,
  BLOCK_TYPES.HEADING,
  BLOCK_TYPES.BUTTON,
  BLOCK_TYPES.IMAGE,
  BLOCK_TYPES.CONTAINER,
  BLOCK_TYPES.COLUMNS_CONTAINER,
  BLOCK_TYPES.SPACER,
  BLOCK_TYPES.DIVIDER,
  BLOCK_TYPES.HTML,
];

const FONT_SUPPORTED_BLOCKS = [
  BLOCK_TYPES.TEXT,
  BLOCK_TYPES.HEADING,
  BLOCK_TYPES.BUTTON,
  BLOCK_TYPES.HTML,
];

const PADDING_SUPPORTED_BLOCKS = [
  BLOCK_TYPES.TEXT,
  BLOCK_TYPES.HEADING,
  BLOCK_TYPES.BUTTON,
  BLOCK_TYPES.HTML,
  BLOCK_TYPES.CONTAINER,
  BLOCK_TYPES.COLUMNS_CONTAINER,
  BLOCK_TYPES.IMAGE,
  BLOCK_TYPES.AVATAR,
  BLOCK_TYPES.DIVIDER,
];

const GLOBAL_TABS = [
  "backdrop-color",
  "canvas-color",
  "canvas-border-color",
  "canvas-border-radius",
  "global-font-family",
  "global-text-color",
] as const;

const PANEL_CLOSE_DELAY = 150;
const DRAG_STATE_CLEAR_DELAY = 100;
const KEYBOARD_THRESHOLD = 150;

type TabType =
  | "styles"
  | "colors"
  | "fonts"
  | "alignment"
  | "links"
  | "image"
  | "html"
  | "columns"
  | (typeof GLOBAL_TABS)[number];

interface PanelState {
  showPanel: boolean;
  showTextColorPicker: boolean;
  showBgColorPicker: boolean;
  showBorderColorPicker: boolean;
  showFontSizePicker: boolean;
  showFontFamilyPicker: boolean;
  showPaddingPicker: boolean;
  showHeadingPicker: boolean;
  showButtonVariantPicker: boolean;
}

interface BottomBarProps {
  onFileUpload?: EditorFileUploadCallback;
  onPanelStateChange?: (isOpen: boolean) => void;
}

export default function BottomBar({
  onFileUpload,
  onPanelStateChange,
}: BottomBarProps) {
  const selectedBlockId = useSelectedBlockId();
  const hasSelectedBlock = Boolean(
    selectedBlockId && selectedBlockId !== "root"
  );
  const editorDocument = useDocument();
  const selectedBlock =
    hasSelectedBlock && selectedBlockId
      ? editorDocument[selectedBlockId]
      : null;

  // Consolidated panel state
  const [panelState, setPanelState] = useState<PanelState>({
    showPanel: false,
    showTextColorPicker: false,
    showBgColorPicker: false,
    showBorderColorPicker: false,
    showFontSizePicker: false,
    showFontFamilyPicker: false,
    showPaddingPicker: false,
    showHeadingPicker: false,
    showButtonVariantPicker: false,
  });

  const [activeTab, setActiveTab] = useState<TabType>("styles");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);

  // Helper function to close all panels
  const closeAllPanels = () => {
    setPanelState({
      showPanel: false,
      showTextColorPicker: false,
      showBgColorPicker: false,
      showBorderColorPicker: false,
      showFontSizePicker: false,
      showFontFamilyPicker: false,
      showPaddingPicker: false,
      showHeadingPicker: false,
      showButtonVariantPicker: false,
    });
  };

  // Helper function to toggle a specific panel
  const togglePanel = (panelKey: keyof PanelState) => {
    closeAllPanels();
    setPanelState((prev) => ({ ...prev, [panelKey]: !prev[panelKey] }));
  };

  // Helper function to check if block supports feature
  const blockSupportsFeature = (
    blockType: string,
    supportedBlocks: string[]
  ) => {
    return supportedBlocks.includes(blockType);
  };

  // Check if any panel is open
  const isAnyPanelOpen = Object.values(panelState).some(Boolean);

  // Consolidated useEffect for closing panels based on block type changes
  useEffect(() => {
    if (!selectedBlock) {
      closeAllPanels();
      return;
    }

    const { type: blockType } = selectedBlock;

    setPanelState((prev) => ({
      ...prev,
      // Close color pickers if block doesn't support colors
      showTextColorPicker:
        prev.showTextColorPicker &&
        blockSupportsFeature(blockType, COLOR_SUPPORTED_BLOCKS),
      showBgColorPicker:
        prev.showBgColorPicker &&
        blockSupportsFeature(blockType, COLOR_SUPPORTED_BLOCKS),
      showBorderColorPicker:
        prev.showBorderColorPicker &&
        blockSupportsFeature(blockType, COLOR_SUPPORTED_BLOCKS),

      // Close font pickers if block doesn't support fonts
      showFontSizePicker:
        prev.showFontSizePicker &&
        blockSupportsFeature(blockType, FONT_SUPPORTED_BLOCKS) &&
        blockType !== BLOCK_TYPES.HEADING,
      showFontFamilyPicker:
        prev.showFontFamilyPicker &&
        blockSupportsFeature(blockType, FONT_SUPPORTED_BLOCKS),

      // Close padding picker if block doesn't support padding
      showPaddingPicker:
        prev.showPaddingPicker &&
        blockSupportsFeature(blockType, PADDING_SUPPORTED_BLOCKS),

      // Close type-specific pickers
      showHeadingPicker:
        prev.showHeadingPicker && blockType === BLOCK_TYPES.HEADING,
      showButtonVariantPicker:
        prev.showButtonVariantPicker && blockType === BLOCK_TYPES.BUTTON,
    }));
  }, [selectedBlock]);

  // Block update functions
  const updateBlockStyle = (newStyle: any) => {
    if (!selectedBlock || !selectedBlockId) return;

    const { data, type } = selectedBlock;
    const currentStyle = (data as any)?.style || {};
    const updatedData = {
      ...data,
      style: { ...currentStyle, ...newStyle },
    } as any;

    setDocument({ [selectedBlockId]: { type, data: updatedData } });
  };

  const updateBlockProps = (newProps: any) => {
    if (!selectedBlock || !selectedBlockId) return;

    const { data, type } = selectedBlock;
    const updatedData = {
      ...data,
      props: { ...(data as any)?.props, ...newProps },
    } as any;

    setDocument({ [selectedBlockId]: { type, data: updatedData } });
  };

  // Color change handlers
  const handleTextColorChange = (color: string) => {
    if (selectedBlock?.type === BLOCK_TYPES.DIVIDER) {
      updateBlockProps({ lineColor: color });
    } else {
      updateBlockStyle({ color });
    }
  };

  const handleBackgroundColorChange = (color: string) => {
    if (
      selectedBlock?.type === BLOCK_TYPES.BUTTON &&
      (selectedBlock.data as any)?.props?.variant === "bordered"
    ) {
      updateBlockStyle({ borderColor: color });
    } else {
      updateBlockStyle({ backgroundColor: color });
    }
  };

  const handleBorderColorChange = (color: string) => {
    updateBlockStyle({ borderColor: color });
  };

  // Tab click handler
  const handleTabClick = (tab: TabType) => {
    const isGlobalTab = GLOBAL_TABS.includes(tab as any);

    if (!hasSelectedBlock && isGlobalTab) {
      if (activeTab === tab && panelState.showPanel) {
        closeAllPanels();
      } else {
        closeAllPanels();
        setActiveTab(tab);
        setPanelState((prev) => ({ ...prev, showPanel: true }));
      }
      return;
    }

    if (activeTab === tab && panelState.showPanel) {
      closeAllPanels();
    } else {
      closeAllPanels();
      setActiveTab(tab);
      setPanelState((prev) => ({ ...prev, showPanel: true }));
    }
  };

  // Panel state change notification
  useEffect(() => {
    onPanelStateChange?.(isAnyPanelOpen);
  }, [isAnyPanelOpen, onPanelStateChange]);

  // Backdrop click handler
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeAllPanels();
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Don't close if currently dragging
      if (isDraggingRef.current) {
        return;
      }

      // Don't close if clicking within the panel
      if (panelRef.current && panelRef.current.contains(target)) {
        return;
      }

      // Don't close if clicking on MUI Portal elements (dropdowns, popovers, etc.)
      const muiPortals = document.querySelectorAll(
        "[data-mui-portal], .MuiPopover-root, .MuiDialog-root, .MuiDrawer-root, .MuiMenu-root, .MuiTooltip-root"
      );
      for (let i = 0; i < muiPortals.length; i++) {
        if (muiPortals[i].contains(target)) {
          return;
        }
      }

      // Don't close if clicking on the bottom toolbar buttons
      const bottomToolbar = document.querySelector("[data-bottom-toolbar]");
      if (bottomToolbar && bottomToolbar.contains(target)) {
        return;
      }

      // Don't close if interacting with sliders, inputs, or other form controls
      const isFormControl = (target as Element).closest(
        'input, [role="slider"], .MuiSlider-root, .MuiSlider-thumb, .MuiSlider-track, .MuiSlider-rail, .MuiTextField-root, .MuiInput-root, .MuiFormControl-root, .MuiSlider-mark, .MuiSlider-markLabel'
      );
      if (isFormControl) {
        return;
      }

      // Don't close if target is a button or toggle button (for style controls)
      const isButtonControl = (target as Element).closest(
        "button, .MuiButton-root, .MuiToggleButton-root, .MuiIconButton-root, .MuiToggleButtonGroup-root"
      );

      // Check if the button is within any collapsible panel or alignment controls
      const isWithinPanel = (target as Element).closest(
        '[data-testid="collapsible-panel"], .MuiCollapse-root, .MuiPaper-root'
      );

      // Don't close if it's any form of radio group or alignment control
      const isAlignmentControl = (target as Element).closest(
        '.MuiToggleButtonGroup-root, [role="radiogroup"]'
      );

      if ((isButtonControl && isWithinPanel) || isAlignmentControl) {
        return;
      }

      // Don't close if clicking on color picker components
      const isColorPicker = (target as Element).closest(
        ".react-colorful, .react-colorful__saturation, .react-colorful__hue, .react-colorful__alpha, .react-colorful__pointer"
      );
      if (isColorPicker) {
        return;
      }

      // Add small delay to prevent accidental closes during form interactions
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(closeAllPanels, PANEL_CLOSE_DELAY);
    };

    const handleDragStart = () => {
      isDraggingRef.current = true;
    };

    const handleDragEnd = () => {
      // Add a small delay before clearing drag state to prevent immediate closure
      setTimeout(() => {
        isDraggingRef.current = false;
      }, DRAG_STATE_CLEAR_DELAY);
    };

    if (isAnyPanelOpen) {
      // Use mousedown for better detection, but with proper exclusions
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      // Track drag operations to prevent panel closure during slider interactions
      document.addEventListener("dragstart", handleDragStart);
      document.addEventListener("dragend", handleDragEnd);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchend", handleDragEnd);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [isAnyPanelOpen]);

  // Virtual keyboard handler
  useEffect(() => {
    let initialViewportHeight =
      (window as any).visualViewport?.height || window.innerHeight;

    const handleViewportChange = () => {
      if ((window as any).visualViewport) {
        const currentHeight = (window as any).visualViewport.height;
        const heightDifference = initialViewportHeight - currentHeight;
        setKeyboardHeight(
          heightDifference > KEYBOARD_THRESHOLD ? heightDifference : 0
        );
      }
    };

    const handleResize = () => {
      if (!(window as any).visualViewport) {
        initialViewportHeight = window.innerHeight;
      }
    };

    if ((window as any).visualViewport) {
      (window as any).visualViewport.addEventListener(
        "resize",
        handleViewportChange
      );
    } else {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if ((window as any).visualViewport) {
        (window as any).visualViewport.removeEventListener(
          "resize",
          handleViewportChange
        );
      } else {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Event handlers for toolbar
  const toolbarHandlers = {
    onTextColorPickerToggle: () => togglePanel("showTextColorPicker"),
    onBgColorPickerToggle: () => togglePanel("showBgColorPicker"),
    onBorderColorPickerToggle: () => togglePanel("showBorderColorPicker"),
    onFontSizePickerToggle: () => {
      if (selectedBlock?.type !== BLOCK_TYPES.HEADING) {
        togglePanel("showFontSizePicker");
      }
    },
    onFontFamilyPickerToggle: () => togglePanel("showFontFamilyPicker"),
    onPaddingPickerToggle: () => togglePanel("showPaddingPicker"),
    onHeadingPickerToggle: () => togglePanel("showHeadingPicker"),
    onButtonVariantPickerToggle: () => togglePanel("showButtonVariantPicker"),
    onHeadingLevelChange: (level: any) => updateBlockProps({ level }),
    onFontWeightToggle: () => {
      const currentWeight =
        (selectedBlock?.data as any)?.style?.fontWeight || "normal";
      const newWeight = currentWeight === "bold" ? "normal" : "bold";
      updateBlockStyle({ fontWeight: newWeight });
    },
  };

  return (
    <>
      {isAnyPanelOpen && (
        <Backdrop
          open={isAnyPanelOpen}
          onClick={handleBackdropClick}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer - 1,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        />
      )}

      {/* Color Picker Panels */}
      <TextColorPickerPanel
        selectedBlock={selectedBlock}
        keyboardHeight={keyboardHeight}
        showTextColorPicker={panelState.showTextColorPicker}
        showBgColorPicker={panelState.showBgColorPicker}
        showBorderColorPicker={panelState.showBorderColorPicker}
        handleTextColorChange={handleTextColorChange}
        handleBackgroundColorChange={handleBackgroundColorChange}
        handleBorderColorChange={handleBorderColorChange}
        updateBlockProps={updateBlockProps}
      />

      <BackgroundColorPickerPanel
        selectedBlock={selectedBlock}
        keyboardHeight={keyboardHeight}
        showTextColorPicker={panelState.showTextColorPicker}
        showBgColorPicker={panelState.showBgColorPicker}
        showBorderColorPicker={panelState.showBorderColorPicker}
        handleTextColorChange={handleTextColorChange}
        handleBackgroundColorChange={handleBackgroundColorChange}
        handleBorderColorChange={handleBorderColorChange}
        updateBlockProps={updateBlockProps}
      />

      <BorderColorPickerPanel
        selectedBlock={selectedBlock}
        keyboardHeight={keyboardHeight}
        showTextColorPicker={panelState.showTextColorPicker}
        showBgColorPicker={panelState.showBgColorPicker}
        showBorderColorPicker={panelState.showBorderColorPicker}
        handleTextColorChange={handleTextColorChange}
        handleBackgroundColorChange={handleBackgroundColorChange}
        handleBorderColorChange={handleBorderColorChange}
        updateBlockProps={updateBlockProps}
      />

      {/* Font Picker Panels */}
      <FontSizePickerPanel
        selectedBlock={selectedBlock}
        keyboardHeight={keyboardHeight}
        showFontSizePicker={panelState.showFontSizePicker}
        showFontFamilyPicker={panelState.showFontFamilyPicker}
        updateBlockStyle={updateBlockStyle}
      />

      <FontFamilyPickerPanel
        selectedBlock={selectedBlock}
        keyboardHeight={keyboardHeight}
        showFontSizePicker={panelState.showFontSizePicker}
        showFontFamilyPicker={panelState.showFontFamilyPicker}
        updateBlockStyle={updateBlockStyle}
      />

      {/* Other Panels */}
      <PaddingPickerPanel
        selectedBlock={selectedBlock}
        keyboardHeight={keyboardHeight}
        showPaddingPicker={panelState.showPaddingPicker}
        updateBlockStyle={updateBlockStyle}
      />

      <HeadingPickerPanel
        selectedBlock={selectedBlock}
        keyboardHeight={keyboardHeight}
        showHeadingPicker={panelState.showHeadingPicker}
        onHeadingLevelChange={toolbarHandlers.onHeadingLevelChange}
      />

      <ButtonVariantPickerPanel
        selectedBlock={selectedBlock}
        keyboardHeight={keyboardHeight}
        showButtonVariantPicker={panelState.showButtonVariantPicker}
      />

      <CollapsiblePanel
        showPanel={panelState.showPanel}
        keyboardHeight={keyboardHeight}
        activeTab={activeTab}
        selectedBlock={selectedBlock}
        hasSelectedBlock={hasSelectedBlock}
        updateBlockStyle={updateBlockStyle}
        updateBlockProps={updateBlockProps}
        onFileUpload={onFileUpload}
      />

      <BottomToolbar
        selectedBlock={selectedBlock}
        hasSelectedBlock={hasSelectedBlock}
        keyboardHeight={keyboardHeight}
        showPanel={panelState.showPanel}
        activeTab={activeTab}
        showTextColorPicker={panelState.showTextColorPicker}
        showBgColorPicker={panelState.showBgColorPicker}
        showBorderColorPicker={panelState.showBorderColorPicker}
        showFontSizePicker={panelState.showFontSizePicker}
        showFontFamilyPicker={panelState.showFontFamilyPicker}
        showPaddingPicker={panelState.showPaddingPicker}
        showHeadingPicker={panelState.showHeadingPicker}
        showButtonVariantPicker={panelState.showButtonVariantPicker}
        onTabClick={handleTabClick}
        {...toolbarHandlers}
      />
    </>
  );
}
