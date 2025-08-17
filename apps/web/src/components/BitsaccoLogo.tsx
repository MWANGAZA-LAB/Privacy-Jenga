import React from 'react';
import bitsaccoLogo from '../assets/bitsacco-logo.png';
import { BitsaccoLogoProps } from '../types';

const BitsaccoLogo: React.FC<BitsaccoLogoProps> = ({ size = 32, className = '' }) => {
  return (
    <div 
      className={`bitsacco-logo-clean ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={bitsaccoLogo}
        alt="Bitsacco Teal Horse Logo"
        style={{
          transition: 'all 0.3s ease-in-out'
        }}
      />
    </div>
  );
};

export default BitsaccoLogo;
