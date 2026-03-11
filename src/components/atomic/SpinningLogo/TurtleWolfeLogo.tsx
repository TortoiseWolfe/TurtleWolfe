import React from 'react';
import Image from 'next/image';

export interface TurtleWolfeLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const TurtleWolfeLogo: React.FC<TurtleWolfeLogoProps> = ({
  className = 'w-full h-full',
  width = 400,
  height = 400,
}) => {
  return (
    <Image
      src="/turtlewolfe-logo.svg"
      alt="TurtleWolfe Logo"
      width={width}
      height={height}
      className={className}
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      priority
    />
  );
};

TurtleWolfeLogo.displayName = 'TurtleWolfeLogo';
