import React from "react";
import { type Align, type Direction, type Justify, mapAlign, mapJustify, type Space, toSpace } from "../../ui/helpers/primitives";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: Direction;
  align?: Align;          // align-items
  justify?: Justify;      // justify-content
  wrap?: boolean;
  gap?: Space;            // numeric or string
  baseUnit?: number;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

export const Flex: React.FC<FlexProps> = ({
  direction = "row",
  align,
  justify,
  wrap = false,
  gap,
  baseUnit = 8,
  fullWidth,
  fullHeight,
  style,
  children,
  ...rest
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        alignItems: mapAlign(align),
        justifyContent: mapJustify(justify),
        flexWrap: wrap ? "wrap" : "nowrap",
        gap: toSpace(gap, baseUnit),
        width: fullWidth ? "100%" : undefined,
        height: fullHeight ? "100%" : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

// Alias "Stack" com default column
export const Stack: React.FC<Omit<FlexProps, "direction">> = (props) => (
  <Flex direction="column" {...props} />
);
