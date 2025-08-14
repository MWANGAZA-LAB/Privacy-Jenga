import { useMemo } from 'react';
import * as THREE from 'three';

interface MaterialManagerProps {
  blockType: 'safe' | 'risky' | 'challenge';
  isRemoved: boolean;
  opacity?: number;
}

export const useMaterialManager = ({ blockType, isRemoved, opacity = 1 }: MaterialManagerProps) => {
  const material = useMemo(() => {
    // BULLETPROOF color system - ZERO chance of white corruption
    const COLOR_MAP: Record<string, number> = {
      safe: 0x059669,      // Emerald-600 (hex)
      risky: 0xdc2626,     // Red-600 (hex)  
      challenge: 0xd97706, // Amber-600 (hex)
      removed: 0x374151    // Gray-700 (hex)
    };

    const baseColor = isRemoved ? COLOR_MAP.removed : COLOR_MAP[blockType];
    
    // CRITICAL: Validate hex color exists and is not white
    if (!baseColor || baseColor === 0xffffff) {
      console.error(`🚨 MATERIAL CORRUPTION DETECTED: Invalid color for type ${blockType}, using emergency green`);
      return new THREE.MeshStandardMaterial({
        color: 0x059669, // Emergency green fallback
        transparent: true,
        opacity,
        metalness: 0.1,
        roughness: 0.8,
        toneMapped: false
      });
    }

    return new THREE.MeshStandardMaterial({
      color: baseColor,
      transparent: true,
      opacity: isRemoved ? 0.3 : opacity,
      metalness: 0.1,
      roughness: 0.8,
      toneMapped: false
    });
  }, [blockType, isRemoved, opacity]);

  // Force material refresh if corruption detected
  if (material.color.getHex() === 0xffffff) {
    console.error('🚨 WHITE CORRUPTION DETECTED IN MATERIAL - EMERGENCY RESET');
    material.color.setHex(0x059669); // Force green
    material.needsUpdate = true;
  }

  return material;
};

export default useMaterialManager;
