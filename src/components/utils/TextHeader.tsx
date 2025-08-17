type TitleSize = "xs" | "sm" | "md" | "lg" | "xl";
const sizeMap: Record<TitleSize, string> = { xs:"14px", sm:"18px", md:"24px", lg:"32px", xl:"40px" };

// Limite `as` apenas a esses elementos:
type AllowedAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: TitleSize;
  font?: string;
  bold?: boolean;
  weight?: React.CSSProperties["fontWeight"];
  color?: string;
  as?: AllowedAs; // <- não deixa usar elementos SVG
}

export function Title({
  size = "md",
  font,
  bold,
  weight,
  color = "#000",
  as: Component = "h1",
  style,
  children,
  ...rest
}: TitleProps) {
  return (
    <Component
      style={{
        fontSize: sizeMap[size],
        fontFamily: font,
        fontWeight: weight ?? (bold ? "bold" : "normal"),
        color,
        margin: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
