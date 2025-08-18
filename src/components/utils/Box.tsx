import React from "react";
import { type Space, toSpace } from "../../ui/helpers/primitives";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  baseUnit?: number;
  m?: Space; mt?: Space; mr?: Space; mb?: Space; ml?: Space; mx?: Space; my?: Space;
  p?: Space; pt?: Space; pr?: Space; pb?: Space; pl?: Space; px?: Space; py?: Space;
  radius?: Space;
}

export const Box: React.FC<BoxProps> = ({
  baseUnit = 8,
  m, mt, mr, mb, ml, mx, my,
  p, pt, pr, pb, pl, px, py,
  radius,
  style,
  ...rest
}) => {
  const M = toSpace(m, baseUnit);
  const P = toSpace(p, baseUnit);
  const styles: React.CSSProperties = {
    marginTop: toSpace(mt, baseUnit) ?? toSpace(my, baseUnit) ?? M,
    marginRight: toSpace(mr, baseUnit) ?? toSpace(mx, baseUnit) ?? M,
    marginBottom: toSpace(mb, baseUnit) ?? toSpace(my, baseUnit) ?? M,
    marginLeft: toSpace(ml, baseUnit) ?? toSpace(mx, baseUnit) ?? M,
    paddingTop: toSpace(pt, baseUnit) ?? toSpace(py, baseUnit) ?? P,
    paddingRight: toSpace(pr, baseUnit) ?? toSpace(px, baseUnit) ?? P,
    paddingBottom: toSpace(pb, baseUnit) ?? toSpace(py, baseUnit) ?? P,
    paddingLeft: toSpace(pl, baseUnit) ?? toSpace(px, baseUnit) ?? P,
    borderRadius: toSpace(radius, baseUnit),
    ...style,
  };
  return <div style={styles} {...rest} />;
};