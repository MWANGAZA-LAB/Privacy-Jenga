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
    if (!gameState || !blocks) return 100;

    const remainingBlocks = blocks.filter(b => !b.removed);
    if (remainingBlocks.length === 0) return 0;

    // CRITICAL FIX: Fresh tower should ALWAYS start at 100%
    if (gameState.blocksRemoved === 0) {
      return 100;
    }

    // Start with base stability - fresh tower should be 100%
    const baseStability = 100;

    // Apply penalty for removed blocks (each removed block reduces stability)
    const removalPenalty = gameState.blocksRemoved * 3; // 3% per removed block
    
    // Apply penalty for risky block distribution
    const riskyBlocks = remainingBlocks.filter(b => b.type === 'risky').length;
    const challengeBlocks = remainingBlocks.filter(b => b.type === 'challenge').length;
    const safeBlocks = remainingBlocks.filter(b => b.type === 'safe').length;
    const riskyPenalty = riskyBlocks * 0.5; // 0.5% per risky block
    const challengePenalty = challengeBlocks * 1; // 1% per challenge block

    // Calculate final stability
    const finalStability = baseStability - removalPenalty - riskyPenalty - challengePenalty;

    // Debug logging for initial game state
    if (gameState.blocksRemoved === 0) {
      console.log('🎯 Tower Stability Debug:', {
        totalBlocks: remainingBlocks.length,
        safeBlocks,
        riskyBlocks,
        challengeBlocks,
        removalPenalty,
        riskyPenalty,
        challengePenalty,
        finalStability: Math.max(0, Math.min(100, finalStability))
      });
    }

    // Identify critical blocks (blocks in high layers that are risky/challenge)
    const criticalBlockIds: string[] = [];
    remainingBlocks.forEach(block => {
      if (block.layer > 15 && (block.type === 'risky' || block.type === 'challenge')) {
        criticalBlockIds.push(block.id);
      }
    });

    setCriticalBlocks(criticalBlockIds);
    return Math.max(0, Math.min(100, finalStability));
  }, [blocks, gameState]);

  useEffect(() => {
    const newStability = calculateStability();
    setPreviousStability(stability);
    setStability(newStability);
  }, [calculateStability, stability]);

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
