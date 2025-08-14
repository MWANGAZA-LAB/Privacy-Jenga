import { useEffect, useCallback } from 'react';
import { Block } from '../../../types';

interface UseKeyboardNavigationProps {
  accessibleBlocks: Block[];
  focusedBlockId: string | null;
  selectedBlockId: string | null;
  onBlockSelect: (blockId: string) => void;
  onFocusChange: (blockId: string) => void;
  isEnabled: boolean;
}

export const useKeyboardNavigation = ({
  accessibleBlocks,
  focusedBlockId,
  selectedBlockId,
  onBlockSelect,
  onFocusChange,
  isEnabled = true
}: UseKeyboardNavigationProps) => {
  
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isEnabled || event.target !== document.body) return;
    
    if (accessibleBlocks.length === 0) return;
    
    const currentIndex = focusedBlockId 
      ? accessibleBlocks.findIndex(b => b.id === focusedBlockId)
      : -1;
    
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : accessibleBlocks.length - 1;
        break;
        
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex < accessibleBlocks.length - 1 ? currentIndex + 1 : 0;
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        // Navigate to block 3 positions back (same layer, previous row)
        newIndex = currentIndex >= 3 ? currentIndex - 3 : currentIndex;
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        // Navigate to block 3 positions forward (same layer, next row)
        newIndex = currentIndex + 3 < accessibleBlocks.length ? currentIndex + 3 : currentIndex;
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedBlockId) {
          onBlockSelect(focusedBlockId);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        if (selectedBlockId) {
          onFocusChange(selectedBlockId);
        }
        break;
        
      default:
        return; // Don't prevent default for other keys
    }
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < accessibleBlocks.length) {
      onFocusChange(accessibleBlocks[newIndex].id);
    }
  }, [
    isEnabled, 
    accessibleBlocks, 
    focusedBlockId, 
    selectedBlockId, 
    onBlockSelect, 
    onFocusChange
  ]);

  useEffect(() => {
    if (!isEnabled) return;
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, isEnabled]);

  // Auto-focus first accessible block if none is focused
  useEffect(() => {
    if (isEnabled && !focusedBlockId && accessibleBlocks.length > 0) {
      onFocusChange(accessibleBlocks[0].id);
    }
  }, [isEnabled, focusedBlockId, accessibleBlocks, onFocusChange]);
};
