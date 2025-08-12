import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, OrbitControls } from '@react-three/drei';
import { Block, GameState } from '../types';

interface JengaTowerProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  gameState: GameState;
  selectedBlockId?: string;
}

interface BlockProps {
  block: Block;
  onClick: () => void;
  isSelected: boolean;
  isRemovable: boolean;
  canPullFromLayer: boolean;
  layer: number;
  position: number;
  worldPosition: [number, number, number];
}

const BlockComponent: React.FC<BlockProps> = ({ 
  block, 
  onClick, 
  isSelected, 
  isRemovable, 
  canPullFromLayer,
  layer,
  position,
  worldPosition
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const isRemoved = block.removed;

  // Determine block color based on LAYER position (not block type) - following Bitcoin Jenga design
  const getBlockColor = () => {
    if (isRemoved) return '#374151'; // Gray for removed blocks
    
    if (!canPullFromLayer) return '#1f2937'; // Dark gray for restricted layers
    
    // Layer-based color gradient (like the Bitcoin Jenga design)
    // Bottom layers = Red/Orange (dangerous), Top layers = Green (safe)
    if (layer <= 2) return '#ef4444'; // Red for bottom layers (most dangerous)
    if (layer <= 4) return '#f97316'; // Orange for lower-middle layers
    if (layer <= 6) return '#eab308'; // Yellow for middle layers
    if (layer <= 8) return '#84cc16'; // Light green for upper-middle layers
    if (layer <= 10) return '#22c55e'; // Green for upper layers
    if (layer <= 12) return '#10b981'; // Teal for top layers (safest)
    if (layer <= 14) return '#06b6d4'; // Blue for very top layers
    if (layer <= 16) return '#8b5cf6'; // Purple for highest layers
    if (layer <= 18) return '#ec4899'; // Pink for ultimate layers
    
    return '#6b7280'; // Gray fallback
  };

  // Debug: Log block information
  console.log(`Block ${block.id}: type=${block.type}, layer=${layer}, position=${position}, color=${getBlockColor()}`);

  // Enhanced visual effects
  useFrame((state) => {
    if (meshRef.current && !isRemoved) {
      // Subtle floating animation for accessible blocks
      if (isRemovable && canPullFromLayer) {
        meshRef.current.position.y = worldPosition[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      }
      
      // Warning pulse for risky blocks
      if (block.type === 'risky' && canPullFromLayer && meshRef.current.material) {
        const material = meshRef.current.material as THREE.Material;
        if ('opacity' in material) {
          material.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
        }
      }
    }
  });

  // Determine block opacity
  const getBlockOpacity = () => {
    if (isRemoved) return 0.3;
    if (!canPullFromLayer) return 0.5;
    if (isSelected) return 1;
    return 0.9;
  };

  // Determine block scale for visual feedback
  const getBlockScale = () => {
    if (isSelected) return 1.1;
    if (isRemovable && canPullFromLayer) return 1.05;
    return 1;
  };

  if (isRemoved) {
    return null;
  }

  const blockColor = getBlockColor();
  const blockOpacity = getBlockOpacity();

  return (
    <mesh
      ref={meshRef}
      position={worldPosition}
      onClick={onClick}
      scale={getBlockScale()}
    >
      <Box args={[1, 0.3, 3]} />
      <meshStandardMaterial 
        color={blockColor}
        transparent 
        opacity={blockOpacity}
        metalness={0.1}
        roughness={0.8}
      />
      
      {/* Block Layer Indicator (instead of type) */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.12}
        color={canPullFromLayer ? '#ffffff' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
      >
        {layer <= 2 ? '🔴' : layer <= 4 ? '🟠' : layer <= 6 ? '🟡' : layer <= 8 ? '🟢' : layer <= 10 ? '🟢' : layer <= 12 ? '🔵' : layer <= 14 ? '🔵' : layer <= 16 ? '🟣' : '🟣'}
      </Text>
      
      {/* Layer number */}
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.15}
        color={canPullFromLayer ? '#ffffff' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
      >
        {layer}
      </Text>
      
      {/* Position indicator */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.12}
        color={canPullFromLayer ? '#e5e7eb' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
      >
        {position + 1}
      </Text>

      {/* Selection highlight */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <Box args={[1.1, 0.35, 3.1]} />
          <meshBasicMaterial 
            color="#06b6d4" 
            wireframe={true}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Removable indicator */}
      {isRemovable && canPullFromLayer && (
        <mesh position={[0, 0, 0]}>
          <Box args={[1.05, 0.32, 3.05]} />
          <meshBasicMaterial 
            color="#ffffff" 
            wireframe={true}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </mesh>
  );
};

const JengaTower: React.FC<JengaTowerProps> = ({ 
  blocks, 
  onBlockClick, 
  gameState,
  selectedBlockId 
}) => {
  // Debug: Log what blocks are being received
  console.log('JengaTower - Received blocks:', blocks?.length || 0);
  if (blocks && blocks.length > 0) {
    console.log('JengaTower - First few blocks:', blocks.slice(0, 3).map(b => ({ id: b.id, type: b.type, layer: b.layer })));
  }
  
  const maxLayer = Math.max(...(blocks?.map(b => b.layer) || [0]));
  
  // Calculate 3D positions for all blocks
  const getBlockWorldPosition = (layer: number, position: number): [number, number, number] => {
    const layerHeight = 0.4; // Height between layers
    const blockSpacing = 1.2; // Spacing between blocks in same layer
    
    // Calculate position within layer (0, 1, or 2)
    const x = (position - 1) * blockSpacing;
    const y = (maxLayer - layer) * layerHeight;
    
    // Alternate orientation every layer
    const z = layer % 2 === 0 ? 0 : 1.5;
    
    return [x, y, z];
  };

  // Filter visible blocks and determine which are removable
  const visibleBlocks = useMemo(() => {
    if (!blocks || blocks.length === 0) {
      console.warn('JengaTower - No blocks provided to component');
      return [];
    }
    
    if (!gameState) {
      console.warn('JengaTower - No game state provided');
      return [];
    }
    
    const filtered = blocks
      .filter(block => !block.removed)
      .map(block => {
        // Handle both number and array types for canPullFromLayers
        const maxAllowedLayer = Array.isArray(gameState.canPullFromLayers) 
          ? Math.max(...gameState.canPullFromLayers)
          : gameState.canPullFromLayers;
        
        const isRemovable = block.layer <= maxAllowedLayer;
        const canPullFromLayer = block.layer <= maxAllowedLayer;
        const worldPosition = getBlockWorldPosition(block.layer, block.position);
        
        return {
          ...block,
          isRemovable,
          canPullFromLayer,
          worldPosition
        };
      });
    
    console.log('JengaTower - Visible blocks after filtering:', filtered.length);
    console.log('JengaTower - First few visible blocks:', filtered.slice(0, 3).map(b => ({ id: b.id, type: b.type, layer: b.layer })));
    
    return filtered;
  }, [blocks, gameState?.canPullFromLayers]);

  // Get the maximum allowed layer for display
  const maxAllowedLayer = Array.isArray(gameState.canPullFromLayers) 
    ? Math.max(...gameState.canPullFromLayers)
    : gameState.canPullFromLayers;

  return (
    <div className="jenga-tower-container relative w-full h-full">
      {/* Layer Restriction Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-teal-400/50">
        <div className="text-center">
          <div className="text-teal-300 text-sm font-semibold mb-1">Available Layers</div>
          <div className="text-white text-lg font-bold">
            {maxAllowedLayer === 1 && "1-3 (Safe Zone)"}
            {maxAllowedLayer === 2 && "1-6 (Steady)"}
            {maxAllowedLayer === 3 && "1-9 (Risky)"}
            {maxAllowedLayer === 4 && "1-12 (Danger)"}
            {maxAllowedLayer === 5 && "1-15 (Extreme)"}
            {maxAllowedLayer === 6 && "All Layers (Ultimate)"}
          </div>
          <div className="text-teal-200 text-xs mt-1">
            Roll dice to change access
          </div>
        </div>
      </div>

      {/* Enhanced Layer-Based Color Legend */}
      <div className="absolute top-4 right-4 z-10 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-600/50">
        <div className="text-center mb-3">
          <div className="text-gray-300 text-sm font-semibold">Layer Difficulty</div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 p-2 bg-red-500/10 border border-red-400/30 rounded-lg">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <div>
              <div className="font-semibold text-red-300">Layers 1-2</div>
              <div className="text-red-200 text-xs">Most Dangerous</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-orange-500/10 border border-orange-400/30 rounded-lg">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <div>
              <div className="font-semibold text-orange-300">Layers 3-4</div>
              <div className="text-orange-200 text-xs">High Risk</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <div>
              <div className="font-semibold text-yellow-300">Layers 5-6</div>
              <div className="text-yellow-200 text-xs">Medium Risk</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-green-500/10 border border-green-400/30 rounded-lg">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <div>
              <div className="font-semibold text-green-300">Layers 7-12</div>
              <div className="text-green-200 text-xs">Lower Risk</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <div>
              <div className="font-semibold text-blue-300">Layers 13-18</div>
              <div className="text-blue-200 text-xs">Safest</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tower Stability Indicator */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-600/50">
        <div className="text-center">
          <div className="text-gray-300 text-sm font-semibold mb-1">Tower Stability</div>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                gameState.towerHeight > 15 ? 'bg-green-500' :
                gameState.towerHeight > 10 ? 'bg-yellow-500' :
                gameState.towerHeight > 5 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${(gameState.towerHeight / maxLayer) * 100}%` }}
            />
          </div>
          <div className="text-white text-sm font-bold mt-1">
            {gameState.towerHeight}/{maxLayer} layers
          </div>
        </div>
      </div>

      {/* 3D Canvas - Full size and properly configured */}
      <Canvas
        camera={{ position: [8, 8, 8], fov: 50 }}
        className="w-full h-full"
        style={{ minHeight: '600px' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Ground plane for reference */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="#374151" transparent opacity={0.3} />
        </mesh>
        
        {/* Render blocks */}
        {visibleBlocks.map((block) => {
          return (
            <BlockComponent
              key={block.id}
              block={block}
              onClick={() => onBlockClick(block)}
              isSelected={selectedBlockId === block.id}
              isRemovable={block.isRemovable}
              canPullFromLayer={block.canPullFromLayer}
              layer={block.layer}
              position={block.position}
              worldPosition={block.worldPosition}
            />
          );
        })}
        
        {/* Layer separation lines */}
        {Array.from({ length: maxLayer + 1 }, (_, i) => (
          <mesh key={`layer-${i}`} position={[0, (maxLayer - i) * 0.4, 0]}>
            <planeGeometry args={[10, 0.01]} />
            <meshBasicMaterial color="#374151" transparent opacity={0.3} />
          </mesh>
        ))}
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>

      {/* Interactive Instructions */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-blue-400/50 max-w-xs">
        <div className="text-center">
          <div className="text-blue-300 text-sm font-semibold mb-2">How to Play</div>
          <div className="text-gray-300 text-xs space-y-1">
            <div>• Click on highlighted blocks to remove</div>
            <div>• Red/Orange = Dangerous (easy access)</div>
            <div>• Yellow = Medium risk</div>
            <div>• Green/Blue = Safe (harder access)</div>
            <div>• Roll dice to change layer access</div>
            <div>• Learn privacy tips from each block</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JengaTower;
