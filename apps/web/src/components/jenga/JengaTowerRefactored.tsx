import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BlockComponent } from './BlockComponent';
import { useTowerStability } from './hooks/useTowerStability';
import { useBlockSelection } from './hooks/useBlockSelection';
import { Block, GameState } from '../../types';

interface JengaTowerProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  gameState: GameState | null;
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

  // Custom hooks for separated concerns
  const { stability, isStable } = useTowerStability({ blocks, gameState });

  // Report stability changes to parent component - OPTIMIZED: Only when stability actually changes
  React.useEffect(() => {
    if (onStabilityChange && typeof stability === 'number') {
      onStabilityChange(stability);
    }
  }, [stability, onStabilityChange]);
  
  const {
    selectedBlockId,
    focusedBlockId,
    selectBlock,
    isBlockAccessible,
    isBlockRemovable
  } = useBlockSelection({ blocks, gameState, onBlockClick });

  // Calculate world positions for blocks with optimization - OPTIMIZED: Stable dependencies
  const blocksWithPositions = useMemo(() => {
    if (!blocks?.length) return [];
    
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

  // OPTIMIZED: Memoize expensive calculations
  const visibleBlocks = useMemo(() => {
    return blocksWithPositions.filter(block => !block.removed);
  }, [blocksWithPositions]);

  // OPTIMIZED: Memoize layer separation lines to prevent recreation
  const layerSeparationLines = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => (
      <mesh key={`layer-${i}`} position={[0, i * 0.4, 0]}>
        <planeGeometry args={[10, 0.01]} />
        <meshBasicMaterial color="#1f2937" transparent opacity={0.1} />
      </mesh>
    ));
  }, []);

  // OPTIMIZED: Memoize camera position to prevent unnecessary updates
  const cameraPosition = useMemo(() => [8, 6, 8] as [number, number, number], []);

  // OPTIMIZED: Memoize lighting positions
  const ambientLightIntensity = useMemo(() => 0.6, []);
  const directionalLightPosition = useMemo(() => [10, 10, 5] as [number, number, number], []);
  const directionalLightIntensity = useMemo(() => 1, []);

  return (
    <div className="relative w-full h-full">
      {/* Game Info Overlay - OPTIMIZED: Only render when needed */}
      {showGameInfo && (
        <div className="absolute top-4 left-4 z-10 bg-gray-800 bg-opacity-90 text-white p-4 rounded-lg max-w-sm">
          <h3 className="text-lg font-bold mb-2">Game Information</h3>
          <p>Total Blocks: {blocks.length}</p>
          <p>Removed: {blocks.filter(b => b.removed).length}</p>
          <p>Stability: {stability.toFixed(1)}%</p>
          <button 
            onClick={() => setShowGameInfo(false)}
            className="mt-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      )}

      {/* Help Overlay - OPTIMIZED: Only render when needed */}
      {showHelp && (
        <div className="absolute top-4 right-4 z-10 bg-gray-800 bg-opacity-90 text-white p-4 rounded-lg max-w-sm">
          <h3 className="text-lg font-bold mb-2">Quick Help</h3>
          <p>• Click on blocks to interact</p>
          <p>• Use arrow keys to navigate</p>
          <p>• Roll dice to unlock layers</p>
          <button 
            onClick={() => setShowHelp(false)}
            className="mt-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      )}

      {/* 3D Tower Canvas - ENHANCED for better interaction and performance */}
      <Canvas
        camera={{ 
          position: cameraPosition, 
          fov: 50 
        }}
        shadows
        className="w-full h-full"
        onPointerMissed={() => {
          console.log('🎯 Canvas pointer missed - clearing selection');
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        {/* Lighting - OPTIMIZED: Memoized values */}
        <ambientLight intensity={ambientLightIntensity} />
        <directionalLight 
          position={directionalLightPosition} 
          intensity={directionalLightIntensity} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Tower Base - OPTIMIZED: Static geometry */}
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[6, 0.2, 6]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Render Blocks - OPTIMIZED: Only render visible blocks */}
        {visibleBlocks.map((block) => (
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
        ))}
        
        {/* Layer Separation Lines - OPTIMIZED: Memoized */}
        {layerSeparationLines}
        
        {/* Camera Controls - OPTIMIZED: Stable component */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>

      {/* Tower Stability Warning - OPTIMIZED: Only show when unstable */}
      {!isStable && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-20">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-bold">Tower Unstable!</div>
              <div>Stability: {stability.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons - OPTIMIZED: Stable positioning */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        <button
          onClick={() => setShowGameInfo(!showGameInfo)}
          className="bg-gray-800 bg-opacity-90 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          ℹ️ Info
        </button>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="bg-gray-800 bg-opacity-90 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          ❓ Help
        </button>
      </div>

      {/* Accessibility Instructions */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
        <div>Use mouse to rotate, scroll to zoom</div>
        <div>Click blocks to interact</div>
      </div>
    </div>
  );
};
