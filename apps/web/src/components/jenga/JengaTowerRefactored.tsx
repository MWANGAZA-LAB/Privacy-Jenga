import React, { useMemo, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Block, GameState } from '../../types';
import { BlockComponent } from './BlockComponent';
import { TowerControls } from './TowerControls';
import { useTowerStability } from './hooks/useTowerStability';
import { useBlockSelection } from './hooks/useBlockSelection';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';

interface JengaTowerProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  gameState: GameState;
  onStabilityChange?: (stability: number) => void;
}

export const JengaTowerRefactored: React.FC<JengaTowerProps> = ({
  blocks,
  onBlockClick,
  gameState,
  onStabilityChange
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);
  const [towerShake, setTowerShake] = useState(false);

  // Custom hooks for separated concerns
  const { stability, isStable, criticalBlocks } = useTowerStability({ blocks, gameState });

  // Report stability changes to parent component
  React.useEffect(() => {
    if (onStabilityChange) {
      onStabilityChange(stability);
    }
  }, [stability, onStabilityChange]);

  // Tower shake effect when blocks are removed
  React.useEffect(() => {
    if (gameState && gameState.blocksRemoved > 0) {
      setTowerShake(true);
      const timer = setTimeout(() => setTowerShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [gameState]);
  
  const {
    selectedBlockId,
    focusedBlockId,
    accessibleBlocks,
    selectBlock,
    isBlockAccessible,
    isBlockRemovable
  } = useBlockSelection({ blocks, gameState, onBlockClick });

  // Calculate max allowed layer based on game state
  const maxAllowedLayer = useMemo(() => {
    if (!gameState?.canPullFromLayers.length) return 1;
    return Math.max(...gameState.canPullFromLayers);
  }, [gameState?.canPullFromLayers]);

  // Calculate world positions for blocks with optimization
  const blocksWithPositions = useMemo(() => {
    const maxLayer = Math.max(...blocks.map(b => b.layer));
    
    return blocks.map(block => {
      const x = (block.position - 1) * 1.2 - 1.2; // -1.2, 0, 1.2
      const y = (maxLayer - block.layer) * 0.4;
      const z = 0;
      
      return {
        ...block,
        worldPosition: [x, y, z] as [number, number, number]
      };
    });
  }, [blocks]);

  // Handle focus changes for keyboard navigation
  const handleFocusChange = useCallback((_blockId: string) => {
    // Focus logic is handled by useBlockSelection hook
  }, []);

  // Keyboard navigation
  useKeyboardNavigation({
    accessibleBlocks,
    focusedBlockId,
    selectedBlockId,
    onBlockSelect: selectBlock,
    onFocusChange: handleFocusChange,
    isEnabled: !showHelp && !showGameInfo
  });

  // Toggle functions
  const toggleHelp = useCallback(() => setShowHelp(!showHelp), [showHelp]);
  const toggleGameInfo = useCallback(() => setShowGameInfo(!showGameInfo), [showGameInfo]);

  return (
    <div className={`relative w-full h-full ${towerShake ? 'tower-stability-warning' : ''}`}>
      {/* 3D Tower Canvas - ENHANCED for better interaction */}
      <Canvas
        camera={{ 
          position: [8, 6, 8], 
          fov: 50 
        }}
        shadows
        className="w-full h-full"
        onPointerMissed={() => {
          console.log('🎯 Canvas pointer missed - clearing selection');
          // Could clear selection here if desired
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Tower Base */}
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[6, 0.2, 6]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Render Blocks */}
        {blocksWithPositions.map((block) => {
          if (block.removed) return null;
          
          return (
            <BlockComponent
              key={block.id}
              block={block}
              onClick={() => selectBlock(block.id)}
              isSelected={selectedBlockId === block.id}
              isRemovable={isBlockRemovable(block)}
              canPullFromLayer={isBlockAccessible(block)}
              layer={block.layer}
              position={block.position}
              worldPosition={block.worldPosition}
              isFocused={focusedBlockId === block.id}
            />
          );
        })}
        
        {/* Layer Separation Lines */}
        {Array.from({ length: 18 }, (_, i) => (
          <mesh key={`layer-${i}`} position={[0, i * 0.4, 0]}>
            <planeGeometry args={[10, 0.01]} />
            <meshBasicMaterial color="#1f2937" transparent opacity={0.1} />
          </mesh>
        ))}
        
        {/* Camera Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Tower Controls UI */}
      <TowerControls
        gameState={gameState}
        towerStability={stability}
        maxAllowedLayer={maxAllowedLayer}
        onToggleHelp={toggleHelp}
        onToggleGameInfo={toggleGameInfo}
        showHelp={showHelp}
        showGameInfo={showGameInfo}
      />

      {/* Accessibility Instructions */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="text-center text-gray-500 text-xs opacity-50">
          <div>Use arrow keys to navigate</div>
          <div>Enter/Space to select blocks</div>
          <div>H for help, I for info</div>
        </div>
      </div>

      {/* Tower Stability Warning */}
      {!isStable && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="bg-red-500/90 text-white p-4 rounded-lg border border-red-400 animate-pulse">
            <div className="text-center">
              <div className="text-lg font-bold">⚠️ Tower Unstable!</div>
              <div className="text-sm">Stability: {Math.round(stability)}%</div>
              {criticalBlocks.length > 0 && (
                <div className="text-xs mt-1">
                  Critical blocks detected
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
