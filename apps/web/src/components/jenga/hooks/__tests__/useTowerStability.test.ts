import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTowerStability } from '../useTowerStability';
import { Block, GameState } from '../../../../types';

describe('useTowerStability', () => {
  const mockBlocks: Block[] = [
    {
      id: '1',
      layer: 1,
      position: 1,
      type: 'safe',
      removed: false,
      difficulty: 1,
      stability: 85,
      category: 'wallet-setup',
      content: {
        id: '1',
        title: 'Safe Block',
        text: 'Safe block content',
        severity: 'tip',
        points: 10,
        category: 'wallet-setup',
        fact: 'This is a safe privacy practice',
        impact: 'positive'
      },
    },
    {
      id: '2',
      layer: 1,
      position: 2,
      type: 'risky',
      removed: false,
      difficulty: 1,
      stability: 75,
      category: 'on-chain-privacy',
      content: {
        id: '2',
        title: 'Risky Block',
        text: 'Risky block content',
        severity: 'warning',
        points: 20,
        category: 'on-chain-privacy',
        fact: 'This practice has privacy risks',
        impact: 'negative'
      },
    },
    {
      id: '3',
      layer: 2,
      position: 1,
      type: 'challenge',
      removed: true, // This block is removed
      difficulty: 2,
      stability: 65,
      category: 'coin-mixing',
      content: {
        id: '3',
        title: 'Challenge Block',
        text: 'Challenge block content',
        severity: 'critical',
        points: 15,
        category: 'coin-mixing',
        fact: 'This practice is very risky',
        impact: 'negative'
      },
    },
  ];

  const mockGameState: GameState = {
    currentPlayer: {
      nickname: 'TestPlayer',
      score: 100,
      achievements: [],
      highScore: 100,
      gamesPlayed: 1,
      totalPoints: 100,
      totalBlocksRemoved: 1,
      correctAnswers: 0,
      incorrectAnswers: 0
    },
    towerHeight: 18,
    blocksRemoved: 1,
    totalBlocks: 54,
    currentScore: 100,
    gameMode: 'classic',
    difficulty: 2,
    diceResult: 3,
    canPullFromLayers: [1, 2],
    specialActions: [],
    gameHistory: [],
    layerStats: [],
    blockTypeStats: {
      safe: { total: 18, removed: 0, points: 0 },
      risky: { total: 18, removed: 0, points: 0 },
      challenge: { total: 18, removed: 1, points: 15 }
    },
    // Enhanced game state properties for quiz system
    correctAnswers: 12,
    incorrectAnswers: 2,
    consecutiveCorrectAnswers: 1,
    consecutiveIncorrectAnswers: 0,
    towerStability: 90,
    isGameComplete: false,
    gamePhase: 'rolling' as const,
    availableBlocks: ['1', '2', '3'], // Available block IDs after dice roll
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates stability correctly for stable tower', () => {
    const { result } = renderHook(() =>
      useTowerStability({
        blocks: mockBlocks.filter(b => !b.removed), // Only non-removed blocks
        gameState: { ...mockGameState, blocksRemoved: 0 }
      })
    );

    expect(result.current.stability).toBeGreaterThan(80);
    expect(result.current.isStable).toBe(true);
    expect(result.current.criticalBlocks).toHaveLength(0);
  });

  it('calculates stability correctly for unstable tower', () => {
    const { result } = renderHook(() =>
      useTowerStability({
        blocks: mockBlocks,
        gameState: { ...mockGameState, blocksRemoved: 10 }
      })
    );

    expect(result.current.stability).toBeLessThan(50);
    expect(result.current.isStable).toBe(false);
  });

  it('identifies critical blocks correctly', () => {
    const criticalBlocks = mockBlocks.map(block => ({
      ...block,
      type: 'risky' as const, // Make all blocks risky
    }));

    const { result } = renderHook(() =>
      useTowerStability({
        blocks: criticalBlocks,
        gameState: { ...mockGameState, blocksRemoved: 5 }
      })
    );

    expect(result.current.criticalBlocks.length).toBeGreaterThan(0);
  });

  it('updates when blocks change', () => {
    const { result, rerender } = renderHook(
      ({ blocks, gameState }) => useTowerStability({ blocks, gameState }),
      {
        initialProps: {
          blocks: mockBlocks,
          gameState: mockGameState,
        },
      }
    );

    const initialStability = result.current.stability;

    // Add more removed blocks
    rerender({
      blocks: mockBlocks,
      gameState: { ...mockGameState, blocksRemoved: 5 },
    });

    expect(result.current.stability).toBeLessThan(initialStability);
  });

  it('handles empty blocks array', () => {
    const { result } = renderHook(() =>
      useTowerStability({
        blocks: [],
        gameState: mockGameState
      })
    );

    expect(result.current.stability).toBeDefined();
    expect(result.current.isStable).toBeDefined();
    expect(result.current.criticalBlocks).toEqual([]);
  });

  it('calculates stability based on removed blocks count', () => {
    const { result } = renderHook(() =>
      useTowerStability({
        blocks: mockBlocks,
        gameState: { ...mockGameState, blocksRemoved: 3 }
      })
    );

    // Stability should decrease with more removed blocks
    expect(result.current.stability).toBeLessThan(100);
  });

  it('maintains performance with large number of blocks', () => {
    const largeBlockSet = Array.from({ length: 100 }, (_, index) => ({
      id: index.toString(),
      layer: Math.floor(index / 3) + 1,
      position: (index % 3) + 1,
      type: 'safe' as const,
      removed: false,
      difficulty: Math.floor(index / 3) + 1,
      stability: 85,
      category: 'wallet-setup' as const,
      content: {
        id: index.toString(),
        title: `Block ${index}`,
        text: `Block ${index} content`,
        severity: 'tip' as const,
        points: 10,
        category: 'wallet-setup' as const,
        fact: `Block ${index} fact`,
        impact: 'positive' as const
      },
    }));

    const start = performance.now();
    const { result } = renderHook(() =>
      useTowerStability({
        blocks: largeBlockSet,
        gameState: mockGameState
      })
    );
    const end = performance.now();

    expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    expect(result.current.stability).toBeDefined();
  });
});
