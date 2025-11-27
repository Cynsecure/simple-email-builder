import React, { useState } from "react";

import { TEditorBlock } from "../../../../editor/core";

import BlocksMenu from "./BlocksMenu";
import DividerButton from "./DividerButton";
import PlaceholderButton from "./PlaceholderButton";

type Props = {
  placeholder?: boolean;
  onSelect: (block: TEditorBlock) => void;
  isAfterSelectedBlock?: boolean;
  isBeforeSelectedBlock?: boolean;
  isLastBlock?: boolean;
};
export default function AddBlockButton({
  onSelect,
  placeholder,
  isAfterSelectedBlock,
  isBeforeSelectedBlock,
  isLastBlock,
}: Props) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [buttonElement, setButtonElement] = useState<HTMLElement | null>(null);

  const handleButtonClick = () => {
    setMenuAnchorEl(buttonElement);
  };

  const renderButton = () => {
    if (placeholder) {
      return <PlaceholderButton onClick={handleButtonClick} />;
    } else {
      return (
        <DividerButton
          buttonElement={buttonElement}
          onClick={handleButtonClick}
          isAfterSelectedBlock={isAfterSelectedBlock}
          isBeforeSelectedBlock={isBeforeSelectedBlock}
          isLastBlock={isLastBlock}
        />
      );
    }
  };

  return (
    <>
      <div ref={setButtonElement} style={{ position: "relative" }}>
        {renderButton()}
      </div>
      <BlocksMenu
        anchorEl={menuAnchorEl}
        setAnchorEl={setMenuAnchorEl}
        onSelect={onSelect}
      />
    </>
  );
}
