import React from 'react';

const GeometricBackground = () => {
  return (
    <svg
      className="geometric-bg-canvas"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Polygon Facet Colors matching reference image */}
        <linearGradient id="poly1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#141E34" />
          <stop offset="100%" stopColor="#0B111F" />
        </linearGradient>
        <linearGradient id="poly2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#182540" />
          <stop offset="100%" stopColor="#0F1728" />
        </linearGradient>
        <linearGradient id="poly3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0E1627" />
          <stop offset="100%" stopColor="#070C16" />
        </linearGradient>
        <linearGradient id="poly4" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#101A2D" />
          <stop offset="100%" stopColor="#090E1A" />
        </linearGradient>
        <linearGradient id="polyHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A2845" />
          <stop offset="100%" stopColor="#111B2E" />
        </linearGradient>
      </defs>

      {/* Base Dark Background */}
      <rect width="1000" height="1000" fill="#080D17" />

      {/* Large Polygon Facets matching screenshot geometry */}
      {/* Top right facet */}
      <polygon points="400,0 1000,0 780,380" fill="url(#poly2)" />
      
      {/* Center large diagonal facet */}
      <polygon points="400,0 780,380 480,620" fill="url(#polyHighlight)" />
      
      {/* Far right middle facet */}
      <polygon points="1000,0 1000,650 780,380" fill="url(#poly1)" />
      
      {/* Lower center facet */}
      <polygon points="480,620 780,380 1000,650" fill="url(#poly4)" />
      
      {/* Bottom right facet */}
      <polygon points="1000,650 1000,1000 650,1000" fill="url(#poly3)" />
      
      {/* Bottom middle facet */}
      <polygon points="480,620 1000,650 650,1000" fill="url(#poly2)" />
      
      {/* Bottom left facet extending under white angular cut */}
      <polygon points="0,480 480,620 650,1000" fill="url(#poly1)" />
      <polygon points="0,480 650,1000 0,1000" fill="url(#poly3)" />
      <polygon points="0,0 400,0 480,620" fill="url(#poly4)" />
      <polygon points="0,0 480,620 0,480" fill="url(#polyHighlight)" />

      {/* Subtle Facet Edge Lines */}
      <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" fill="none">
        <line x1="400" y1="0" x2="780" y2="380" />
        <line x1="780" y1="380" x2="1000" y2="0" />
        <line x1="780" y1="380" x2="480" y2="620" />
        <line x1="780" y1="380" x2="1000" y2="650" />
        <line x1="480" y1="620" x2="1000" y2="650" />
        <line x1="480" y1="620" x2="650" y2="1000" />
        <line x1="1000" y1="650" x2="650" y2="1000" />
      </g>
    </svg>
  );
};

export default GeometricBackground;
