import React from "react";
import { Box, type BoxProps } from "./Box";

type Elevation = 0 | 1 | 2 | 3;

const shadows: Record<Elevation, string> = {
  0: "none",
  1: "0 2px 6px rgba(0,0,0,.08)",
  2: "0 6px 16px rgba(0,0,0,.12)",
  3: "0 12px 24px rgba(0,0,0,.16)",
};

export interface CardProps extends BoxProps {
  elevation?: Elevation;
  bordered?: boolean;
  bg?: string;
}

export const Card: React.FC<CardProps> = ({
  elevation = 1,
  bordered = false,
  bg = "#fff",
  style,
  p = 2,
  radius = 2,
  ...rest
}) => {
  return (
    <Box
      p={p}
      radius={radius}
      style={{
        background: bg,
        boxShadow: shadows[elevation],
        border: bordered ? "1px solid rgba(0,0,0,.08)" : undefined,
        ...style,
      }}
      {...rest}
    />
  );
};
