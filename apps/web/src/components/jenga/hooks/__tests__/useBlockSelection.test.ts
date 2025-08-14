import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBlockSelection } from '../useBlockSelection';
import { Block, GameState } from '../../../../types';

describe('useBlockSelection', () => {
  const mockBlocks: Block[] = [
    {
      id: '1',
      layer: 10, // Use higher layer (not critical support layer)
      position: 1,
      type: 'safe',
      removed: false,
      difficulty: 10,
      stability: 100,
      category: 'wallet-setup',
      content: {
        id: '1',
        title: 'Safe Block',
        text: 'Safe block description',
        severity: 'tip',
        points: 10,
        category: 'wallet-setup',
        fact: 'Test fact',
        impact: 'positive',
      },
    },
    {
      id: '2',
      layer: 11, // Use higher layer
      position: 1,
      type: 'risky',
      removed: false,
      difficulty: 11,
      stability: 80,
      category: 'on-chain-privacy',
      content: {
        id: '2',
        title: 'Risky Block',
        text: 'Risky block description',
        severity: 'warning',
        points: 20,
        category: 'on-chain-privacy',
        fact: 'Test fact',
        impact: 'negative',
      },
    },
    {
      id: '3',
      layer: 12, // Use higher layer
      position: 1,
      type: 'challenge',
      removed: false,
      difficulty: 12,
      stability: 60,
      category: 'coin-mixing',
      content: {
        id: '3',
        title: 'Challenge Block',
        text: 'Challenge block description',
        severity: 'critical',
        points: 15,
        category: 'coin-mixing',
        fact: 'Test fact',
        impact: 'neutral',
      },
    },
  ];

  const mockGameState: GameState = {
    currentPlayer: {
      nickname: 'TestPlayer',
      score: 100,
      achievements: [],
      highScore: 150,
      gamesPlayed: 5,
      totalPoints: 500,
      totalBlocksRemoved: 25,
      correctAnswers: 15,
      incorrectAnswers: 3,
    },
    towerHeight: 18,
    blocksRemoved: 0,
    totalBlocks: 54,
    currentScore: 100,
    gameMode: 'classic',
    difficulty: 2,
    diceResult: 3,
    canPullFromLayers: [10, 11],
    specialActions: [],
    gameHistory: [],
    layerStats: [],
    blockTypeStats: {
      safe: { total: 18, removed: 0, points: 0 },
      risky: { total: 18, removed: 0, points: 0 },
      challenge: { total: 18, removed: 0, points: 0 },
    },
    // Enhanced game state properties for quiz system
    correctAnswers: 15,
    incorrectAnswers: 3,
    consecutiveCorrectAnswers: 2,
    consecutiveIncorrectAnswers: 0,
    towerStability: 85,
    isGameComplete: false,
    gamePhase: 'rolling' as const,
    availableBlocks: ['1', '2'], // Available block IDs after dice roll
  };

  const mockOnBlockClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with no selection', () => {
    const { result } = renderHook(() =>
      useBlockSelection({
        blocks: mockBlocks,
        gameState: mockGameState,
        onBlockClick: mockOnBlockClick,
      })
    );

    expect(result.current.selectedBlockId).toBeNull();
    expect(result.current.focusedBlockId).toBeNull();
  });

  it('selects a block correctly', () => {
    const { result } = renderHook(() =>
      useBlockSelection({
        blocks: mockBlocks,
        gameState: mockGameState,
        onBlockClick: mockOnBlockClick,
      })
    );

    act(() => {
      result.current.selectBlock('1');
    });

    expect(result.current.selectedBlockId).toBe('1');
    expect(mockOnBlockClick).toHaveBeenCalledWith(mockBlocks[0]);
  });

  it('identifies accessible blocks correctly', () => {
    const { result } = renderHook(() =>
      useBlockSelection({
        blocks: mockBlocks,
        gameState: mockGameState,
        onBlockClick: mockOnBlockClick,
      })
    );

    // Blocks in layers 10 and 11 should be accessible
    expect(result.current.accessibleBlocks).toHaveLength(2);
    expect(result.current.accessibleBlocks.map(b => b.id)).toEqual(['1', '2']);
  });

  it('determines block removability correctly', () => {
    const { result } = renderHook(() =>
      useBlockSelection({
        blocks: mockBlocks,
        gameState: mockGameState,
        onBlockClick: mockOnBlockClick,
      })
    );

    // Block in layer 10 should be removable
    expect(result.current.isBlockRemovable(mockBlocks[0])).toBe(true);
    
    // Block in layer 12 should not be removable (not in canPullFromLayers)
    expect(result.current.isBlockRemovable(mockBlocks[2])).toBe(false);
  });

  it('determines block accessibility correctly', () => {
    const { result } = renderHook(() =>
      useBlockSelection({
        blocks: mockBlocks,
        gameState: mockGameState,
        onBlockClick: mockOnBlockClick,
      })
    );

    expect(result.current.isBlockAccessible(mockBlocks[0])).toBe(true);
    expect(result.current.isBlockAccessible(mockBlocks[1])).toBe(true);
    expect(result.current.isBlockAccessible(mockBlocks[2])).toBe(false);
  });

  it('updates accessible blocks when game state changes', () => {
    const { result, rerender } = renderHook(
      ({ blocks, gameState, onBlockClick }) =>
        useBlockSelection({ blocks, gameState, onBlockClick }),
      {
        initialProps: {
          blocks: mockBlocks,
          gameState: mockGameState,
          onBlockClick: mockOnBlockClick,
        },
      }
    );

    expect(result.current.accessibleBlocks).toHaveLength(2);

    // Update game state to allow layer 12
    rerender({
      blocks: mockBlocks,
      gameState: { 
        ...mockGameState, 
        canPullFromLayers: [10, 11, 12], 
        availableBlocks: ['1', '2', '3'] 
      },
      onBlockClick: mockOnBlockClick,
    });

    expect(result.current.accessibleBlocks).toHaveLength(3);
  });

  it('handles removed blocks correctly', () => {
    const blocksWithRemoved = mockBlocks.map((block, index) => ({
      ...block,
      removed: index === 1, // Remove the second block
    }));

    const { result } = renderHook(() =>
      useBlockSelection({
        blocks: blocksWithRemoved,
        gameState: mockGameState,
        onBlockClick: mockOnBlockClick,
      })
    );

    // Should only have 1 accessible block (excluding removed block and layer 3)
    expect(result.current.accessibleBlocks).toHaveLength(1);
    expect(result.current.accessibleBlocks[0].id).toBe('1');
  });

  it('clears selection correctly', () => {
    const { result } = renderHook(() =>
      useBlockSelection({
        blocks: mockBlocks,
        gameState: mockGameState,
        onBlockClick: mockOnBlockClick,
      })
    );

    // First select a block
    act(() => {
      result.current.selectBlock('1');
    });

    expect(result.current.selectedBlockId).toBe('1');

    // Then clear selection
    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedBlockId).toBeNull();
  });

  it('maintains performance with large block sets', () => {
    const largeBlockSet = Array.from({ length: 200 }, (_, index) => ({
      id: index.toString(),
      layer: Math.floor(index / 3) + 7, // Start from layer 7 to avoid critical support layers
      position: (index % 3) + 1,
      type: 'safe' as const,
      removed: false,
      difficulty: Math.floor(index / 3) + 7,
      stability: 100,
      category: 'wallet-setup' as const,
      content: {
        id: index.toString(),
        title: `Block ${index}`,
        text: `Block ${index} description`,
        severity: 'tip' as const,
        points: 10,
        category: 'wallet-setup' as const,
        fact: 'Test fact',
        impact: 'positive' as const,
      },
    }));

    const start = performance.now();
    const { result } = renderHook(() =>
      useBlockSelection({
        blocks: largeBlockSet,
        gameState: { 
          ...mockGameState, 
          canPullFromLayers: [7, 8, 9, 10, 11],
          availableBlocks: Array.from({ length: 15 }, (_, i) => i.toString()) // First 15 blocks as available
        },
        onBlockClick: mockOnBlockClick,
      })
    );
    const end = performance.now();

    expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    expect(result.current.accessibleBlocks.length).toBeGreaterThan(0);
  });
});
