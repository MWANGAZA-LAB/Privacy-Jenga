import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { Block as BlockType } from '@/types';
import * as THREE from 'three';

interface JengaTowerProps {
  blocks: BlockType[];
  onBlockClick: (block: BlockType) => void;
  isInteractive: boolean;
  selectedBlockId?: string;
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

  // Color based on severity and state
  const getBlockColor = () => {
    if (isSelected) return '#3b82f6'; // Blue for selected
    if (!isClickable) return '#9ca3af'; // Gray for non-clickable
    
    // Color by level for visual variety
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4'];
    return colors[block.level % colors.length];
  };

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[2.8, 0.8, 0.8]} // Jenga block proportions
      onClick={handleClick}
    >
      <meshStandardMaterial 
        color={getBlockColor()}
        transparent={true}
        opacity={isClickable ? 1 : 0.5}
        roughness={0.3}
        metalness={0.1}
      />
      {isSelected && (
        <meshBasicMaterial 
          color="#3b82f6" 
          wireframe={true}
          transparent={true}
          opacity={0.5} 
        />
      )}
    </Box>
  );
};

const JengaTower: React.FC<JengaTowerProps> = ({ 
  blocks, 
  onBlockClick, 
  isInteractive, 
  selectedBlockId 
}) => {
  const getBlockPosition = (blockData: BlockType): [number, number, number] => {
    const { level, position } = blockData;
    const isEvenLevel = level % 2 === 0;
    
    let x = 0;
    let z = 0;
    
    if (isEvenLevel) {
      // Even levels: blocks along X-axis
      x = (position - 1) * 3; // -3, 0, 3
      z = 0;
    } else {
      // Odd levels: blocks along Z-axis (rotated 90 degrees)
      x = 0;
      z = (position - 1) * 3; // -3, 0, 3
    }
    
    const y = level * 0.9; // Stack height
    
    return [x, y, z];
  };

  const visibleBlocks = useMemo(() => {
    return blocks.filter(block => !block.removed);
  }, [blocks]);

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
        {visibleBlocks.map((block) => (
          <Block
            key={block.id}
            block={block}
            onClick={onBlockClick}
            isSelected={block.id === selectedBlockId}
            isClickable={isInteractive}
            position={getBlockPosition(block)}
          />
        ))}
        
        {/* Tower stability indicator */}
        {visibleBlocks.length < blocks.length && (
          <Text
            position={[0, Math.max(...visibleBlocks.map(b => b.level)) * 0.9 + 3, 0]}
            fontSize={1}
            color="#ef4444"
            anchorX="center"
            anchorY="middle"
          >
            Tower Unstable!
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
        {isInteractive && (
          <div className="text-xs text-gray-500 mt-1">
            Click a block to remove it
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs font-medium text-gray-700 mb-2">Block Colors</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span className="text-xs">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JengaTower;
