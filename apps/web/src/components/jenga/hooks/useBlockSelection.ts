import { useState, useCallback, useMemo } from 'react';
import { Block, GameState } from '../../../types';

interface UseBlockSelectionProps {
  blocks: Block[];
  gameState: GameState | null;
  onBlockClick: (block: Block) => void;
}

interface BlockSelectionState {
  selectedBlockId: string | null;
  focusedBlockId: string | null;
  accessibleBlocks: Block[];
  selectBlock: (blockId: string) => void;
  clearSelection: () => void;
  isBlockAccessible: (block: Block) => boolean;
  isBlockRemovable: (block: Block) => boolean;
}

export const useBlockSelection = ({ 
  blocks, 
  gameState, 
  onBlockClick 
}: UseBlockSelectionProps): BlockSelectionState => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

  // Memoized accessible blocks calculation
  const accessibleBlocks = useMemo(() => {
    if (!gameState) return [];
    
    const maxLayer = Math.max(...gameState.canPullFromLayers);
    return blocks.filter(block => 
      !block.removed && 
      block.layer <= maxLayer
    );
  }, [blocks, gameState]);

  const isBlockAccessible = useCallback((block: Block): boolean => {
    if (!gameState || block.removed) return false;
    const maxLayer = Math.max(...gameState.canPullFromLayers);
    return block.layer <= maxLayer;
  }, [gameState]);

  const isBlockRemovable = useCallback((block: Block): boolean => {
    if (!isBlockAccessible(block)) return false;
    
    // Check if block can be safely removed based on tower structure
    const sameLayerBlocks = blocks.filter(b => 
      b.layer === block.layer && !b.removed
    );
    
    // Don't allow removal if it's the last block in a critical support layer
    if (sameLayerBlocks.length === 1 && block.layer <= 6) {
      return false;
    }
    
    return true;
  }, [blocks, isBlockAccessible]);

  const selectBlock = useCallback((blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !isBlockRemovable(block)) return;
    
    setSelectedBlockId(blockId);
    setFocusedBlockId(blockId);
    onBlockClick(block);
  }, [blocks, isBlockRemovable, onBlockClick]);

  const clearSelection = useCallback(() => {
    setSelectedBlockId(null);
    setFocusedBlockId(null);
  }, []);

  return {
    selectedBlockId,
    focusedBlockId,
    accessibleBlocks,
    selectBlock,
    clearSelection,
    isBlockAccessible,
    isBlockRemovable
  };
};
