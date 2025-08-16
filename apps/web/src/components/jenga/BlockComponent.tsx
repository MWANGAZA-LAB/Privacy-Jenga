import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import * as THREE from 'three';
import { Block } from '../../types';

interface BlockComponentProps {
  block: Block;
  onClick: () => void;
  isSelected: boolean;
  isRemovable: boolean;
  canPullFromLayer: boolean;
  layer: number;
  position: number;
  worldPosition: [number, number, number];
  isFocused?: boolean;
}

export const BlockComponent: React.FC<BlockComponentProps> = React.memo(({ 
  block, 
  onClick, 
  isSelected, 
  isRemovable, 
  canPullFromLayer,
  layer,
  position,
  worldPosition,
  isFocused = false
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // OPTIMIZED: Memoized color system with stable references
  const blockColor = useMemo(() => {
    if (block.removed) return 0x374151; // Gray-700 for removed blocks

    // CRITICAL: Validate block type exists and is valid
    if (!block.type || !['safe', 'risky', 'challenge'].includes(block.type)) {
      console.error(`🚨 CRITICAL: Invalid block type "${block.type}" for block ${block.id}, forcing safe color`);
      return 0x059669; // Force safe green - never white
    }

    const BLOCK_COLORS: Record<string, number> = {
      safe: 0x059669,      // Emerald-600 - Never white
      risky: 0xdc2626,     // Red-600 - Never white  
      challenge: 0xd97706, // Amber-600 - Never white
    };

    const color = BLOCK_COLORS[block.type];
    
    // TRIPLE DEFENSE against white corruption
    if (!color || color === 0xffffff) {
      console.error(`🚨 WHITE CORRUPTION DETECTED: Invalid color for block ${block.id}, emergency fallback to green`);
      return 0x059669;
    }

    return color;
  }, [block.type, block.removed, block.id]);

  // OPTIMIZED: Memoized opacity calculation
  const blockOpacity = useMemo(() => {
    return block.removed ? 0.3 : 1.0;
  }, [block.removed]);

  // OPTIMIZED: Memoized scale calculation
  const blockScale = useMemo(() => {
    if (isSelected) return 1.1;
    if (isHovered && canPullFromLayer) return 1.05;
    return 1.0;
  }, [isSelected, isHovered, canPullFromLayer]);

  // OPTIMIZED: Memoized material properties
  const materialProps = useMemo(() => ({
    color: blockColor,
    transparent: true,
    opacity: blockOpacity,
    metalness: 0.1,
    roughness: 0.8,
    toneMapped: false
  }), [blockColor, blockOpacity]);

  // Enhanced animation frame for better feedback and performance
  useFrame((state) => {
    if (!meshRef.current) return;

    // ENHANCED: Subtle floating animation for accessible blocks
    if (isRemovable && canPullFromLayer && !isAnimating) {
      const floatY = worldPosition[1] + Math.sin(state.clock.elapsedTime * 2) * 0.03;
      meshRef.current.position.y = floatY;
      
      // Add gentle rotation for removable blocks
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.02;
    }
    
    // ENHANCED: Warning pulse for risky blocks with better visual feedback
    if (block.type === 'risky' && canPullFromLayer && !isAnimating && meshRef.current.material) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      const baseOpacity = blockOpacity;
      material.opacity = baseOpacity + Math.sin(state.clock.elapsedTime * 3) * 0.15;
    }

    // ENHANCED: Hover effect with tactile feedback
    if (isHovered && canPullFromLayer && !isAnimating) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.08;
      // Add subtle bobbing motion
      meshRef.current.position.y = worldPosition[1] + Math.sin(state.clock.elapsedTime * 3) * 0.02;
    }

    // ENHANCED: Focus indication with pulsing scale
    if (isFocused && meshRef.current.scale && !isAnimating) {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.04;
      meshRef.current.scale.setScalar(pulseScale);
    }

    // ENHANCED PHYSICS-BASED REMOVAL ANIMATION
    if (block.removed && meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      const timeElapsed = state.clock.elapsedTime;
      
      // Physics simulation for realistic falling
      const gravity = 0.012; // Enhanced gravity acceleration
      const rotationSpeed = 0.06; // Enhanced tumbling speed
      const fadeSpeed = 0.012; // Slower fade for better visibility
      
      // Enhanced falling motion with gravity acceleration
      const fallSpeed = gravity * Math.pow(timeElapsed * 0.8, 1.5);
      meshRef.current.position.y -= fallSpeed;
      
      // More realistic tumbling with variance based on block ID
      const blockSeed = parseInt(block.id) * 0.1;
      meshRef.current.rotation.x += rotationSpeed + Math.sin(timeElapsed + blockSeed) * 0.03;
      meshRef.current.rotation.y += rotationSpeed * 0.8 + Math.cos(timeElapsed * 1.4 + blockSeed) * 0.025;
      meshRef.current.rotation.z += rotationSpeed * 0.6 + Math.sin(timeElapsed * 0.9 + blockSeed) * 0.02;
      
      // Enhanced horizontal drift with slight bounce
      meshRef.current.position.x += Math.sin(timeElapsed * 2.5 + blockSeed) * 0.003;
      meshRef.current.position.z += Math.cos(timeElapsed * 1.8 + blockSeed) * 0.003;
      
      // Smooth fade out with slight delay for better visibility
      if (timeElapsed > 0.5) { // Small delay before fading
        material.opacity = Math.max(0, material.opacity - fadeSpeed);
      }
      
      // Enhanced scale down with slight bounce effect
      const fallScale = Math.max(0.2, 1 - (timeElapsed * 0.002));
      meshRef.current.scale.setScalar(fallScale);
      
      // Mark for removal when completely faded and fallen
      if (material.opacity <= 0 || meshRef.current.position.y < -12) {
        meshRef.current.visible = false;
      }
    }
  });

  // OPTIMIZED: Stable callback for block click
  const handleBlockClick = useCallback((e: THREE.Event) => {
    e.stopPropagation();
    
    if (!canPullFromLayer || block.removed || isAnimating) {
      console.log(`🚫 Block ${block.id} not clickable:`, { canPullFromLayer, removed: block.removed, isAnimating });
      return;
    }

    try {
      setIsAnimating(true);
      console.log(`🎯 Block ${block.id} clicked:`, { type: block.type, layer, position, worldPosition });

      // Call the onClick handler
      onClick();

      // Enhanced animation with better performance
      if (meshRef.current) {
        // Scale animation
        meshRef.current.scale.setScalar(1.2);
        
        // Color flash effect (optional - can be disabled for performance)
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        if (material && material.color) {
          const originalColor = material.color.getHex();
          material.color.setHex(0xffffff); // Flash white
          material.needsUpdate = true;
          
          // Restore original color
          setTimeout(() => {
            if (material && material.color) {
              material.color.setHex(originalColor);
              material.needsUpdate = true;
            }
          }, 150);
        }
        
        // Restore scale
        setTimeout(() => {
          if (meshRef.current) {
            meshRef.current.scale.setScalar(1);
          }
        }, 300);
      }

      // Reset animation state
      setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    } catch (error) {
      console.error('🚨 CRITICAL: Error in handleBlockClick:', error);
      setIsAnimating(false);
    }
  }, [canPullFromLayer, block.removed, isAnimating, onClick, block.id, block.type, layer, position, worldPosition]);

  // OPTIMIZED: Stable pointer event handlers
  const handlePointerEnter = useCallback((e: THREE.Event) => {
    e.stopPropagation();
    if (canPullFromLayer && !block.removed) {
      document.body.style.cursor = 'pointer';
      setIsHovered(true);
    }
  }, [canPullFromLayer, block.removed]);

  const handlePointerLeave = useCallback((e: THREE.Event) => {
    e.stopPropagation();
    document.body.style.cursor = 'default';
    setIsHovered(false);
  }, []);

  // OPTIMIZED: Stable userData
  const userData = useMemo(() => ({
    blockId: block.id,
    clickable: canPullFromLayer
  }), [block.id, canPullFromLayer]);

  // Don't render removed blocks or invalid blocks
  if (block.removed || !block.type) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={worldPosition}
      onClick={handleBlockClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      scale={blockScale}
      castShadow
      receiveShadow
      userData={userData}
    >
      <boxGeometry args={[1, 0.3, 3]} />
      <meshStandardMaterial {...materialProps} />
      
      {/* ENHANCED Block Type Indicator with better visibility */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.15}
        color={canPullFromLayer ? '#ffffff' : '#9ca3af'}
        anchorX="center"
        anchorY="middle"
        scale={isHovered && canPullFromLayer ? 1.3 : 1}
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {block.type === 'safe' ? '🟢' : block.type === 'risky' ? '🔴' : '🟡'}
      </Text>
      
      {/* ENHANCED Layer number with better contrast */}
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.18}
        color={canPullFromLayer ? '#ffffff' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {layer}
      </Text>
      
      {/* Position indicator */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.15}
        color={canPullFromLayer ? '#ffffff' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {position}
      </Text>

      {/* ENHANCED Selection highlight with animation */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <Box args={[1.1, 0.35, 3.1]} />
          <meshBasicMaterial 
            color="#059669" 
            transparent
            opacity={0.4 + Math.sin(Date.now() * 0.008) * 0.1}
          />
        </mesh>
      )}

      {/* ENHANCED Focus highlight with pulse */}
      {isFocused && (
        <mesh position={[0, 0, 0]}>
          <Box args={[1.15, 0.4, 3.15]} />
          <meshBasicMaterial 
            color="#3b82f6" 
            transparent
            opacity={0.25 + Math.sin(Date.now() * 0.01) * 0.1}
          />
        </mesh>
      )}

      {/* ENHANCED Removable indicator with glow effect */}
      {isRemovable && canPullFromLayer && (
        <>
          <mesh position={[0, 0, 0]}>
            <Box args={[1.05, 0.32, 3.05]} />
            <meshBasicMaterial 
              color={isHovered ? "#f59e0b" : "#059669"} 
              transparent
              opacity={isHovered ? 0.4 : 0.2}
            />
          </mesh>
          {/* Glow effect for better tactile feedback */}
          <mesh position={[0, 0, 0]}>
            <Box args={[1.2, 0.45, 3.2]} />
            <meshBasicMaterial 
              color={isHovered ? "#fbbf24" : "#10b981"} 
              transparent
              opacity={isHovered ? 0.15 : 0.08}
            />
          </mesh>
        </>
      )}

      {/* REMOVAL ANIMATION: Dramatic visual feedback when block is being removed */}
      {isAnimating && (
        <>
          {/* Explosion effect particles */}
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={`particle-${i}`} position={[
              Math.sin(i / 8 * Math.PI * 2) * 0.5,
              0,
              Math.cos(i / 8 * Math.PI * 2) * 0.5
            ]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial 
                color="#fbbf24"
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
          
          {/* Shockwave effect */}
          <mesh position={[0, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 16]} />
            <meshBasicMaterial 
              color="#fbbf24" 
              transparent
              opacity={0.3}
            />
          </mesh>
        </>
      )}
    </mesh>
  );
});

BlockComponent.displayName = 'BlockComponent';
