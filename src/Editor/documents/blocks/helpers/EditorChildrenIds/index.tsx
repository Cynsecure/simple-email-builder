import React, { Fragment } from "react";

import { TEditorBlock } from "../../../editor/core";
import EditorBlock from "../../../editor/EditorBlock";
import { useSelectedBlockId } from "../../../editor/EditorContext";

import AddBlockButton from "./AddBlockMenu";

export type EditorChildrenChange = {
  blockId: string;
  block: TEditorBlock;
  childrenIds: string[];
};

function generateId() {
  return `block-${Date.now()}`;
}

export type EditorChildrenIdsProps = {
  childrenIds: string[] | null | undefined;
  onChange: (val: EditorChildrenChange) => void;
};
export default function EditorChildrenIds({
  childrenIds,
  onChange,
}: EditorChildrenIdsProps) {
  const selectedBlockId = useSelectedBlockId();

  const appendBlock = (block: TEditorBlock) => {
    const blockId = generateId();
    return onChange({
      blockId,
      block,
      childrenIds: [...(childrenIds || []), blockId],
    });
  };

  const insertBlock = (block: TEditorBlock, index: number) => {
    const blockId = generateId();
    const newChildrenIds = [...(childrenIds || [])];
    newChildrenIds.splice(index, 0, blockId);
    return onChange({
      blockId,
      block,
      childrenIds: newChildrenIds,
    });
  };

  if (!childrenIds || childrenIds.length === 0) {
    return <AddBlockButton placeholder onSelect={appendBlock} />;
  }

  return (
    <>
      {childrenIds.map((childId, i) => (
        <Fragment key={childId}>
          <AddBlockButton
            onSelect={(block) => insertBlock(block, i)}
            isAfterSelectedBlock={
              i > 0 && selectedBlockId === childrenIds[i - 1]
            } // Show after the previous block if it's selected
            isBeforeSelectedBlock={selectedBlockId === childId} // Show before this block if it's selected
          />
          <EditorBlock id={childId} />
        </Fragment>
      ))}
      <AddBlockButton
        onSelect={appendBlock}
        isLastBlock
        isAfterSelectedBlock={
          selectedBlockId === childrenIds[childrenIds.length - 1]
        } // Also show if the last block is selected
      />
    </>
  );
}
