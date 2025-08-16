import { useState, useEffect, useCallback } from 'react';
import { Block, GameState } from '../../../types';

interface UseTowerStabilityProps {
  blocks: Block[];
  gameState: GameState | null;
}

interface TowerStabilityState {
  stability: number;
  isStable: boolean;
  criticalBlocks: string[];
  stabilityTrend: 'improving' | 'declining' | 'stable';
}

export const useTowerStability = ({ blocks, gameState }: UseTowerStabilityProps): TowerStabilityState => {
  const [stability, setStability] = useState<number>(100);
  const [previousStability, setPreviousStability] = useState<number>(100);
  const [criticalBlocks, setCriticalBlocks] = useState<string[]>([]);

  const calculateStability = useCallback(() => {
    if (!gameState) return 100;

    // CRITICAL FIX: Use the gameState.towerStability directly instead of recalculating
    // This eliminates the conflict between hook calculation and service calculation
    if (gameState.towerStability !== undefined) {
      return gameState.towerStability;
    }

    // Fallback calculation only if gameState.towerStability is not available
    const remainingBlocks = blocks.filter(b => !b.removed);
    if (remainingBlocks.length === 0) return 0;

    // Fresh tower should start at 100%
    if (gameState.blocksRemoved === 0) {
      return 100;
    }

    // Simplified calculation: 100% - (blocks removed * 2.5%)
    // This aligns better with the service's stability changes
    const removalPenalty = gameState.blocksRemoved * 2.5;
    const finalStability = Math.max(0, 100 - removalPenalty);

    return finalStability;
  }, [gameState, blocks]);

  // CRITICAL: Only recalculate when gameState.towerStability changes
  useEffect(() => {
    const newStability = calculateStability();
    setPreviousStability(stability);
    setStability(newStability);
  }, [gameState?.towerStability, gameState?.blocksRemoved, calculateStability]);

  // Identify critical blocks (blocks in high layers that are risky/challenge)
  useEffect(() => {
    if (!blocks || !gameState) return;

    const remainingBlocks = blocks.filter(b => !b.removed);
    const criticalBlockIds: string[] = [];
    
    remainingBlocks.forEach(block => {
      if (block.layer > 15 && (block.type === 'risky' || block.type === 'challenge')) {
        criticalBlockIds.push(block.id);
      }
    });

    setCriticalBlocks(criticalBlockIds);
  }, [blocks, gameState?.blocksRemoved]);

  const stabilityTrend = 
    stability > previousStability ? 'improving' : 
    stability < previousStability ? 'declining' : 'stable';

  return {
    stability,
    isStable: stability > 40,
    criticalBlocks,
    stabilityTrend
  };
};
