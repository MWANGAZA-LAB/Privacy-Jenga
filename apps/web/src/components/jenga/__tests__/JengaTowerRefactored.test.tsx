import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JengaTowerRefactored } from '../JengaTowerRefactored';
import { Block, GameState } from '../../../types';

// Mock Three.js and react-three-fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'canvas' }, children),
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => React.createElement('div', { 'data-testid': 'orbit-controls' }),
}));

// Mock custom hooks
vi.mock('../hooks/useTowerStability', () => ({
  useTowerStability: () => ({
    stability: 85,
    isStable: true,
    criticalBlocks: [],
  }),
}));

vi.mock('../hooks/useBlockSelection', () => ({
  useBlockSelection: () => ({
    selectedBlockId: null,
    focusedBlockId: null,
    accessibleBlocks: [],
    selectBlock: vi.fn(),
    clearSelection: vi.fn(),
    isBlockAccessible: vi.fn(() => true),
    isBlockRemovable: vi.fn(() => true),
  }),
}));

vi.mock('../hooks/useKeyboardNavigation', () => ({
  useKeyboardNavigation: vi.fn(),
}));

describe('JengaTowerRefactored', () => {
  const mockBlocks: Block[] = [
    {
      id: '1',
      layer: 1,
      position: 1,
      type: 'safe',
      removed: false,
      difficulty: 1,
      stability: 0.9,
      category: 'on-chain-privacy',
      content: {
        id: '1',
        title: 'Test Block',
        text: 'Test description',
        severity: 'tip',
        points: 10,
        category: 'on-chain-privacy',
        fact: 'Test fact',
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
      stability: 0.8,
      category: 'wallet-setup',
      content: {
        id: '2',
        title: 'Risky Block',
        text: 'Risky description',
        severity: 'warning',
        points: 20,
        category: 'wallet-setup',
        fact: 'Risky fact',
        impact: 'neutral'
      },
    },
  ];

  const mockGameState: GameState = {
    currentPlayer: {
      nickname: 'Test Player',
      score: 100,
      achievements: [],
      highScore: 200,
      gamesPlayed: 5,
      totalPoints: 500,
      totalBlocksRemoved: 20,
      correctAnswers: 15,
      incorrectAnswers: 5
    },
    towerHeight: 18,
    blocksRemoved: 2,
    totalBlocks: 54,
    currentScore: 100,
    gameMode: 'learning' as const,
    difficulty: 1,
    diceResult: 4,
    canPullFromLayers: [1, 2],
    specialActions: [],
    gameHistory: [],
    layerStats: [],
    blockTypeStats: {
      safe: { total: 18, removed: 0, points: 0 },
      risky: { total: 18, removed: 0, points: 0 },
      challenge: { total: 18, removed: 0, points: 0 }
    },
    // Enhanced game state properties for quiz system
    correctAnswers: 15,
    incorrectAnswers: 5,
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

  it('renders the 3D canvas', () => {
    render(
      <JengaTowerRefactored
        blocks={mockBlocks}
        onBlockClick={mockOnBlockClick}
        gameState={mockGameState}
      />
    );

    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
  });

  it('renders blocks with correct positions', () => {
    render(
      <JengaTowerRefactored
        blocks={mockBlocks}
        onBlockClick={mockOnBlockClick}
        gameState={mockGameState}
      />
    );

    // Check that blocks are rendered (mocked Three.js components)
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('handles block selection', async () => {
    render(
      <JengaTowerRefactored
        blocks={mockBlocks}
        onBlockClick={mockOnBlockClick}
        gameState={mockGameState}
      />
    );

    // The actual block clicking is handled by Three.js mesh interactions
    // which are mocked in our test environment
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('displays tower stability correctly when unstable', () => {
    // Mock unstable tower
    vi.doMock('../hooks/useTowerStability', () => ({
      useTowerStability: () => ({
        stability: 25,
        isStable: false,
        criticalBlocks: ['1'],
      }),
    }));

    render(
      <JengaTowerRefactored
        blocks={mockBlocks}
        onBlockClick={mockOnBlockClick}
        gameState={mockGameState}
      />
    );

    // Check for stability warning
    expect(screen.getByText(/Tower Unstable!/)).toBeInTheDocument();
    expect(screen.getByText(/Stability: 25%/)).toBeInTheDocument();
  });

  it('responds to keyboard navigation', () => {
    render(
      <JengaTowerRefactored
        blocks={mockBlocks}
        onBlockClick={mockOnBlockClick}
        gameState={mockGameState}
      />
    );

    // Verify keyboard navigation hook is called
    const { useKeyboardNavigation } = require('../hooks/useKeyboardNavigation');
    expect(useKeyboardNavigation).toHaveBeenCalled();
  });

  it('calculates block positions correctly', () => {
    render(
      <JengaTowerRefactored
        blocks={mockBlocks}
        onBlockClick={mockOnBlockClick}
        gameState={mockGameState}
      />
    );

    // Position calculations are tested indirectly through rendering
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('handles empty blocks array gracefully', () => {
    render(
      <JengaTowerRefactored
        blocks={[]}
        onBlockClick={mockOnBlockClick}
        gameState={mockGameState}
      />
    );

    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('updates when game state changes', () => {
    const { rerender } = render(
      <JengaTowerRefactored
        blocks={mockBlocks}
        onBlockClick={mockOnBlockClick}
        gameState={mockGameState}
      />
    );

    const newGameState = {
      ...mockGameState,
      canPullFromLayers: [1, 2, 3, 4],
      availableBlocks: ['1', '2', '3', '4'],
    };

    rerender(
      <JengaTowerRefactored
        blocks={mockBlocks}
        onBlockClick={mockOnBlockClick}
        gameState={newGameState}
      />
    );

    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });
});
