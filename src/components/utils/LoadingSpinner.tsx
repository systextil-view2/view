import React from 'react';
import { Box } from './Box';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color = '#68c3b7',
  thickness = 2
}) => {
  return (
    <Box
      style={{
        width: size,
        height: size,
        border: `${thickness}px solid #f3f3f3`,
        borderTop: `${thickness}px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );
};


