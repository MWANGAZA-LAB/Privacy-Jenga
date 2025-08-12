import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { Block as BlockType } from '@/types';
import * as THREE from 'three';

interface JengaTowerProps {
  blocks: BlockType[];
  onBlockClick: (block: BlockType) => void;
  isInteractive: boolean;
  selectedBlockId?: string;
  gameState: any;
}

interface BlockProps {
  block: BlockType;
  onClick: (block: BlockType) => void;
  isSelected: boolean;
  isClickable: boolean;
  position: [number, number, number];
}

const Block: React.FC<BlockProps> = ({ block, onClick, isSelected, isClickable, position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isClickable && !block.removed) {
      onClick(block);
    }
  };

  if (block.removed) {
    return null; // Don't render removed blocks
  }

  // Color based on block type and state
  const getBlockColor = () => {
    if (isSelected) return '#3b82f6'; // Blue for selected
    
    switch (block.type) {
      case 'safe':
        return '#10b981'; // Green for safe blocks
      case 'risky':
        return '#ef4444'; // Red for risky blocks
      case 'challenge':
        return '#f59e0b'; // Yellow for challenge blocks
      default:
        return '#6b7280'; // Gray fallback
    }
  };

  // Visual feedback for block type
  const getBlockMaterial = () => {
    const baseColor = getBlockColor();
    
    if (isSelected) {
      return (
        <meshBasicMaterial 
          color="#3b82f6" 
          wireframe={true}
          transparent={true}
          opacity={0.5} 
        />
      );
    }

    return (
      <meshStandardMaterial 
        color={baseColor}
        transparent={true}
        opacity={isClickable ? 1 : 0.5}
        roughness={0.3}
        metalness={0.1}
      />
    );
  };

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[2.8, 0.8, 0.8]} // Jenga block proportions
      onClick={handleClick}
    >
      {getBlockMaterial()}
      
      {/* Block type indicator */}
      {!isSelected && (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.2, 0.1, 0.2]} />
          <meshBasicMaterial color={getBlockColor()} />
        </mesh>
      )}
    </Box>
  );
};

const JengaTower: React.FC<JengaTowerProps> = ({ 
  blocks, 
  onBlockClick, 
  isInteractive, 
  selectedBlockId,
  gameState,
}) => {
  const getBlockPosition = (_blockData: BlockType, index: number): [number, number, number] => {
    // Calculate position based on 18 layers × 3 blocks per layer
    const layer = Math.floor(index / 3) + 1;
    const position = (index % 3) + 1;
    const isEvenLayer = layer % 2 === 0;
    
    let x = 0;
    let z = 0;
    
    if (isEvenLayer) {
      // Even layers: blocks along X-axis
      x = (position - 2) * 3; // -3, 0, 3
      z = 0;
    } else {
      // Odd layers: blocks along Z-axis (rotated 90 degrees)
      x = 0;
      z = (position - 2) * 3; // -3, 0, 3
    }
    
    const y = (layer - 1) * 0.9; // Height increases with layer
    
    return [x, y, z];
  };

  // Filter out removed blocks
  const visibleBlocks = blocks.filter(block => !block.removed);

  // Calculate camera position based on visible blocks
  const maxLayer = Math.max(...visibleBlocks.map(b => b.layer));

  return (
    <div className="w-full h-96 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl overflow-hidden">
      <Canvas
        camera={{ 
          position: [10, 10, 10], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow={true}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        {/* Ground plane */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -1, 0]}
          receiveShadow={true}
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#f3f4f6" />
        </mesh>
        
        {/* Render blocks */}
        {visibleBlocks.map((block, index) => (
          <Block
            key={block.id}
            block={block}
            onClick={onBlockClick}
            isSelected={block.id === selectedBlockId}
            isClickable={isInteractive}
            position={getBlockPosition(block, index)}
          />
        ))}
        
        {/* Tower stability indicator */}
        {visibleBlocks.length < blocks.length && (
          <Text
            position={[0, maxLayer * 0.9 + 3, 0]}
            fontSize={1}
            color="#ef4444"
            anchorX="center"
            anchorY="middle"
          >
            Tower Unstable!
          </Text>
        )}
        
        {/* Layer information */}
        {gameState && gameState.diceResult > 0 && (
          <Text
            position={[0, -2, 0]}
            fontSize={0.8}
            color="#3b82f6"
            anchorX="center"
            anchorY="middle"
          >
            Available Layers: {gameState.canPullFromLayers.join(', ')}
          </Text>
        )}
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={25}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm font-medium text-gray-700">
          Blocks Remaining: {visibleBlocks.length}/{blocks.length}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Layers: {maxLayer}/18
        </div>
        {isInteractive && (
          <div className="text-xs text-gray-500 mt-1">
            Click a block to remove it
          </div>
        )}
      </div>
      
      {/* Block Type Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs font-medium text-gray-700 mb-2">Block Types</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs">Safe (Green)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs">Risky (Red)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs">Challenge (Yellow)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs">Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JengaTower;
