import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxW?: number | string;       // ex: 1200 ou "80ch"
  center?: boolean;             // centraliza com margin auto
  paddingX?: number;            // padding horizontal em unidades (base 8)
  baseUnit?: number;
}

export const Container: React.FC<ContainerProps> = ({
  maxW = 1200,
  center = true,
  paddingX = 3,
  baseUnit = 8,
  style,
  ...rest
}) => {
  const maxWidth = typeof maxW === "number" ? `${maxW}px` : maxW;
  return (
    <div
      style={{
        maxWidth,
        marginLeft: center ? "auto" : undefined,
        marginRight: center ? "auto" : undefined,
        paddingLeft: `${paddingX * baseUnit}px`,
        paddingRight: `${paddingX * baseUnit}px`,
        width: "100%",
        ...style,
      }}
      {...rest}
    />
  );
};
