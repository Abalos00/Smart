import React from 'react';

const BeeLogo = ({ className = "w-8 h-8", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 32 32" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cuerpo principal de la abeja - rombos */}
      <g fill={color}>
        {/* Cabeza */}
        <path d="M16 4 L20 8 L16 12 L12 8 Z" opacity="0.9" />
        
        {/* Segmento 1 del cuerpo */}
        <path d="M16 10 L22 16 L16 22 L10 16 Z" opacity="0.8" />
        
        {/* Segmento 2 del cuerpo */}
        <path d="M16 18 L20 22 L16 26 L12 22 Z" opacity="0.7" />
        
        {/* Alas izquierdas */}
        <path d="M8 12 L12 8 L16 12 L12 16 Z" opacity="0.4" />
        <path d="M6 16 L10 12 L14 16 L10 20 Z" opacity="0.3" />
        
        {/* Alas derechas */}
        <path d="M24 12 L20 8 L16 12 L20 16 Z" opacity="0.4" />
        <path d="M26 16 L22 12 L18 16 L22 20 Z" opacity="0.3" />
        
        {/* Antenas */}
        <circle cx="13" cy="6" r="1" opacity="0.8" />
        <circle cx="19" cy="6" r="1" opacity="0.8" />
        <path d="M13 5 L11 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 5 L21 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </g>
      
      {/* Rayas del cuerpo */}
      <g stroke={color} strokeWidth="1" opacity="0.6">
        <line x1="12" y1="14" x2="20" y2="14" />
        <line x1="13" y1="18" x2="19" y2="18" />
        <line x1="14" y1="22" x2="18" y2="22" />
      </g>
    </svg>
  );
};

export default BeeLogo;