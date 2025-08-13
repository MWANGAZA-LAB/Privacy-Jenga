import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Block, GameState } from '../types';
import { ChevronDown, ChevronUp, Info, Gamepad2 } from 'lucide-react';

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
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // ✅ BULLETPROOF COLOR MAP for block types - NO WHITE ALLOWED
  const BLOCK_COLORS: Record<string, string> = {
    safe: '#10b981',      // Green
    risky: '#ef4444',     // Red
    challenge: '#f59e0b', // Yellow
  };

  // ✅ Returns a guaranteed valid hex color for a block - ABSOLUTELY NO WHITE
  const getBlockColor = (block: Block): string => {
    if (block.removed) return '#374151'; // Dark gray for removed blocks

    // Validate block type first
    if (!block.type || !['safe', 'risky', 'challenge'].includes(block.type)) {
      console.warn(`Invalid block type "${block.type}" for block ${block.id}, defaulting to safe`);
      return '#10b981'; // Always return green for invalid types
    }

    let color = BLOCK_COLORS[block.type];
    
    // Multiple layers of protection against white
    if (!color || 
        color.toLowerCase() === '#ffffff' || 
        color.toLowerCase() === 'white' ||
        color.toLowerCase() === '#fff' ||
        color.toLowerCase() === 'fff' ||
        !/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      console.warn(`Invalid or white color "${color}" for block ${block.id}, falling back to green`);
      color = '#10b981';
    }

    // Final validation - if somehow we still have white, force green
    if (color.toLowerCase() === '#ffffff' || color.toLowerCase() === 'white') {
      console.error(`CRITICAL: White color still detected for block ${block.id}, forcing green`);
      color = '#10b981';
    }

    return color;
  };

  // ✅ Returns opacity based on block state
  const getBlockOpacity = (block: Block): number => {
    if (block.removed) return 0.3;
    return 1.0;
  };

  // ✅ Default material to prevent white flash on initial render
  const defaultMaterial = (
    <meshStandardMaterial
      color="#10b981"
      transparent
      opacity={1.0}
      metalness={0.0}
      roughness={1.0}
    />
  );

  // ✅ Returns a bulletproof material for a block - NO WHITE MATERIALS
  const getBlockMaterial = (block: Block) => {
    const color = getBlockColor(block);
    const opacity = getBlockOpacity(block);

    // Final safety check - if somehow we still have white, force green
    const finalColor = (color.toLowerCase() === '#ffffff' || color.toLowerCase() === 'white') 
      ? '#10b981' 
      : color;

    // ✅ Force material update to prevent white flash
    const material = (
      <meshStandardMaterial
        color={finalColor}
        transparent
        opacity={opacity}
        metalness={0.0}
        roughness={1.0}
        key={`${block.id}-${finalColor}-${opacity}`} // Force re-render on changes
      />
    );

    return material;
  };

  // Enhanced visual effects with performance optimization
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

      // Hover effect
      if (isHovered && canPullFromLayer) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.1;
      }
    }
  });

  // Block opacity is handled by material transparency

  // Determine block scale for visual feedback
  const getBlockScale = () => {
    if (isSelected) return 1.1;
    if (isHovered && canPullFromLayer) return 1.08;
    if (isRemovable && canPullFromLayer) return 1.05;
    return 1;
  };

  // Handle block click with animation
  const handleBlockClick = useCallback(() => {
    if (!canPullFromLayer || isAnimating) return;
    
    setIsAnimating(true);
    onClick();
    
    // Reset animation state after a delay
    setTimeout(() => setIsAnimating(false), 500);
  }, [canPullFromLayer, isAnimating, onClick]);

  // Keyboard navigation support (handled globally)

  // ✅ Guard against invalid blocks to prevent white flash
  if (!block || !block.type || isRemoved) {
    return null;
  }

  // ✅ Runtime validation - ensure no white blocks can render
  const blockColor = getBlockColor(block);
  if (blockColor.toLowerCase() === '#ffffff' || blockColor.toLowerCase() === 'white') {
    console.error(`CRITICAL ERROR: White block detected at runtime for block ${block.id}, forcing green`);
    // Force the block to be green
    block.type = 'safe';
  }



  // Material properties are now handled inline for better performance

  return (
    <mesh
      ref={meshRef}
      position={worldPosition}
      onClick={handleBlockClick}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      scale={getBlockScale()}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 0.3, 3]} />
      {block && block.type ? getBlockMaterial(block) : defaultMaterial}
      
      {/* Block Type Indicator - ENHANCED WITH ANIMATIONS */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.12}
        color={canPullFromLayer ? '#10b981' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
        scale={isHovered && canPullFromLayer ? 1.2 : 1}
      >
        {block.type === 'safe' ? '🟢' : block.type === 'risky' ? '🔴' : '🟡'}
      </Text>
      
      {/* Layer number */}
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.15}
        color={canPullFromLayer ? '#10b981' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
      >
        {layer}
      </Text>
      
      {/* Position indicator */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.12}
        color={canPullFromLayer ? '#10b981' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
      >
        {position + 1}
      </Text>

      {/* Enhanced Selection highlight - Made darker to prevent white appearance */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <Box args={[1.1, 0.35, 3.1]} />
          <meshBasicMaterial 
            color="#059669" 
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Enhanced Removable indicator - Made darker to prevent white appearance */}
      {isRemovable && canPullFromLayer && (
        <mesh position={[0, 0, 0]}>
          <Box args={[1.05, 0.32, 3.05]} />
          <meshBasicMaterial 
            color={isHovered ? "#d97706" : "#047857"} 
            transparent
            opacity={isHovered ? 0.3 : 0.15}
          />
        </mesh>
      )}

      {/* Hover effect for interactive blocks - Made darker to prevent white appearance */}
      {isHovered && canPullFromLayer && (
        <mesh position={[0, 0, 0]}>
          <Box args={[1.15, 0.4, 3.15]} />
          <meshBasicMaterial 
            color="#d97706" 
            transparent
            opacity={0.08}
            wireframe
          />
        </mesh>
      )}

      {/* Interactive Block Indicator - NEW: Shows which blocks are clickable */}
      {canPullFromLayer && !isHovered && (
        <mesh position={[0, 0, 0]}>
          <Box args={[1.02, 0.31, 3.02]} />
          <meshBasicMaterial 
            color="#10b981" 
            transparent
            opacity={0.1}
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
  const maxLayer = Math.max(...(blocks?.map(b => b.layer) || [0]));
  const [isLoading, setIsLoading] = useState(true);
  const [towerStability, setTowerStability] = useState(100);
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);
  
  // UI State Management
  const [showGameInfo, setShowGameInfo] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Performance optimization: Calculate tower stability
  useEffect(() => {
    if (gameState) {
      const stability = Math.max(0, 100 - (gameState.blocksRemoved * 2));
      setTowerStability(stability);
    }
  }, [gameState]);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation is handled in the global keyboard listener

  // Global keyboard listener
  useEffect(() => {
    const handleGlobalKeyPress = (event: KeyboardEvent) => {
      if (event.target === document.body && gameState) {
        // Handle keyboard navigation directly here to avoid dependency issues
        const accessibleBlocks = blocks.filter(block => 
          !block.removed && block.layer <= Math.max(...gameState.canPullFromLayers)
        );
        
        if (accessibleBlocks.length === 0) return;
        
        const currentIndex = focusedBlock 
          ? accessibleBlocks.findIndex(b => b.id === focusedBlock)
          : -1;
        
        let newIndex = currentIndex;
        
        switch (event.key) {
          case 'ArrowLeft':
            newIndex = currentIndex > 0 ? currentIndex - 1 : accessibleBlocks.length - 1;
            break;
          case 'ArrowRight':
            newIndex = currentIndex < accessibleBlocks.length - 1 ? currentIndex + 1 : 0;
            break;
          case 'ArrowUp':
            newIndex = currentIndex >= 3 ? currentIndex - 3 : currentIndex;
            break;
          case 'ArrowDown':
            newIndex = currentIndex + 3 < accessibleBlocks.length ? currentIndex + 3 : currentIndex;
            break;
          case 'Enter':
          case ' ':
            if (focusedBlock) {
              const block = accessibleBlocks.find(b => b.id === focusedBlock);
              if (block) onBlockClick(block);
            }
            break;
        }
        
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < accessibleBlocks.length) {
          setFocusedBlock(accessibleBlocks[newIndex].id);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyPress);
    return () => document.removeEventListener('keydown', handleGlobalKeyPress);
  }, [gameState, blocks, focusedBlock, onBlockClick]);

  // Filter visible blocks and determine which are removable
  const visibleBlocks = useMemo(() => {
    if (!blocks || blocks.length === 0) {
      return [];
    }
    
    if (!gameState) {
      return [];
    }
    
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
    
    const filtered = blocks
      .filter(block => !block.removed)
      .map(block => {
        // Get the actual maximum allowed layer from game state
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
    
    return filtered;
  }, [blocks, gameState, maxLayer]);

  // Get the maximum allowed layer for display
  const maxAllowedLayer = Array.isArray(gameState.canPullFromLayers) 
    ? Math.max(...gameState.canPullFromLayers)
    : gameState.canPullFromLayers;

  if (isLoading) {
    return (
      <div className="jenga-tower-container relative w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-teal-400 text-lg font-semibold">Building Tower...</div>
          <div className="text-gray-400 text-sm">Preparing your privacy journey</div>
        </div>
      </div>
    );
  }

  return (
    <div className="jenga-tower-container relative w-full h-full">
      {/* Consolidated Game Info Panel - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-black/90 backdrop-blur-sm rounded-lg border border-gray-600/50 overflow-hidden">
          {/* Header with toggle */}
          <button
            onClick={() => setShowGameInfo(!showGameInfo)}
            className="w-full px-4 py-3 bg-gray-800/80 hover:bg-gray-700/80 transition-colors flex items-center justify-between text-white font-semibold"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-400" />
              Game Information
            </div>
            {showGameInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {/* Collapsible content */}
          {showGameInfo && (
            <div className="p-4 space-y-4 max-w-sm">
              {/* Available Layers */}
              <div className="text-center p-3 bg-teal-500/10 border border-teal-400/30 rounded-lg">
                <div className="text-teal-300 text-sm font-semibold mb-1">Available Layers</div>
                <div className="text-white text-lg font-bold">
                  {maxAllowedLayer <= 3 && `1-${maxAllowedLayer} (Safe Zone)`}
                  {maxAllowedLayer > 3 && maxAllowedLayer <= 6 && `1-${maxAllowedLayer} (Steady)`}
                  {maxAllowedLayer > 6 && maxAllowedLayer <= 9 && `1-${maxAllowedLayer} (Risky)`}
                  {maxAllowedLayer > 9 && maxAllowedLayer <= 12 && `1-${maxAllowedLayer} (Danger)`}
                  {maxAllowedLayer > 12 && maxAllowedLayer <= 15 && `1-${maxAllowedLayer} (Extreme)`}
                  {maxAllowedLayer > 15 && "1-18 (Ultimate)"}
                </div>
                <div className="text-teal-200 text-xs mt-1">Roll dice to change access</div>
              </div>

              {/* Block Types Legend */}
              <div className="space-y-2">
                <div className="text-gray-300 text-sm font-semibold text-center">Block Types</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-400/30 rounded">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-green-300 font-medium">Safe (Green)</span>
                    <span className="text-green-200 text-xs">+Points, +Stability</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-400/30 rounded">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-yellow-300 font-medium">Challenge</span>
                    <span className="text-yellow-200 text-xs">Quiz Questions</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-400/30 rounded">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-red-300 font-medium">Risky</span>
                    <span className="text-red-200 text-xs">+Points, -Stability</span>
                  </div>
                </div>
                <div className="mt-2 p-2 bg-green-500/10 border border-green-400/30 rounded text-xs text-green-300">
                  💡 <strong>Strategy:</strong> Start with Green blocks to build confidence!
                </div>
              </div>

              {/* Tower Stability */}
              <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                <div className="text-gray-300 text-sm font-semibold mb-1">Tower Stability</div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${
                      towerStability > 80 ? 'bg-green-500' :
                      towerStability > 60 ? 'bg-yellow-500' :
                      towerStability > 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${towerStability}%` }}
                  />
                </div>
                <div className="text-white text-sm font-bold mt-1">
                  {gameState.towerHeight}/{maxLayer} layers
                </div>
                <div className={`text-xs mt-1 ${
                  towerStability > 80 ? 'text-green-400' :
                  towerStability > 60 ? 'text-yellow-400' :
                  towerStability > 40 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {towerStability > 80 ? 'Stable' :
                   towerStability > 60 ? 'Caution' :
                   towerStability > 40 ? 'Warning' : 'Critical'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Consolidated Controls Panel - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-black/90 backdrop-blur-sm rounded-lg border border-gray-600/50 overflow-hidden">
          {/* Header with toggle */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="w-full px-4 py-3 bg-gray-800/80 hover:bg-gray-700/80 transition-colors flex items-center justify-between text-white font-semibold"
          >
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-blue-400" />
              Game Controls
            </div>
            {showControls ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {/* Collapsible content */}
          {showControls && (
            <div className="p-4 space-y-4 max-w-xs">
              {/* How to Play */}
              <div className="text-center">
                <div className="text-blue-300 text-sm font-semibold mb-2">How to Play</div>
                <div className="text-gray-300 text-xs space-y-1 text-left">
                  <div>• Click on highlighted blocks to remove</div>
                  <div>• <span className="text-green-300">Green = Safe</span> (start here!)</div>
                  <div>• <span className="text-yellow-300">Yellow = Challenge</span> (quiz questions)</div>
                  <div>• <span className="text-red-300">Red = Risky</span> (high risk, high reward)</div>
                  <div>• Roll dice to change layer access</div>
                  <div>• Learn privacy tips from each block</div>
                  <div className="text-blue-200 font-semibold mt-2">💡 Start with Safe blocks to build confidence!</div>
                  <div className="text-blue-200 text-xs mt-1">⌨️ Use arrow keys to navigate</div>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                <div className="text-blue-300 text-sm font-semibold mb-2">Keyboard Shortcuts</div>
                <div className="text-blue-200 text-xs space-y-1">
                  <div>↑↓←→ Navigate blocks</div>
                  <div>Enter/Space Select block</div>
                  <div>H Toggle help</div>
                  <div>I Toggle game info</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Help Toggle - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-600/50 hover:bg-gray-700/80 transition-colors"
          title="Quick Help"
        >
          <div className="text-center">
            <div className="text-gray-300 text-sm font-semibold">?</div>
            <div className="text-gray-400 text-xs">Help</div>
          </div>
        </button>
        
        {/* Quick help tooltip */}
        {showHelp && (
          <div className="absolute top-full left-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-gray-600/50 max-w-xs z-30">
            <div className="text-gray-300 text-xs space-y-1">
              <div className="font-semibold text-white mb-2">Quick Tips:</div>
              <div>• Green blocks are safe to remove first</div>
              <div>• Hover over blocks to see details</div>
              <div>• Use arrow keys to navigate</div>
              <div>• Roll dice to access more layers</div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced 3D Canvas - Centered and Full Size */}
      <Canvas
        camera={{ position: [8, 8, 8], fov: 50 }}
        className="w-full h-full"
        style={{ minHeight: '600px' }}
        shadows
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-10, -10, -10]} intensity={0.4} />
        <pointLight position={[0, 15, 0]} intensity={0.5} castShadow />
        
        {/* Enhanced Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        
        {/* Render blocks with performance optimization */}
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
        
        {/* Enhanced Layer separation lines - Made darker to prevent white appearance */}
        {Array.from({ length: maxLayer + 1 }, (_, i) => (
          <mesh key={`layer-${i}`} position={[0, (maxLayer - i) * 0.4, 0]}>
            <planeGeometry args={[10, 0.01]} />
            <meshBasicMaterial color="#1f2937" transparent opacity={0.2} />
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

      {/* Accessibility Instructions - Subtle and Non-Intrusive */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5 pointer-events-none">
        <div className="text-center text-gray-500 text-xs opacity-30">
          <div>Use arrow keys to navigate blocks</div>
          <div>Press Enter or Space to select</div>
        </div>
      </div>

      {/* Click outside to close panels */}
      {(showGameInfo || showControls || showHelp) && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowGameInfo(false);
            setShowControls(false);
            setShowHelp(false);
          }}
        />
      )}
    </div>
  );
};

export default JengaTower;
