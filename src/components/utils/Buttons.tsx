import type React from "react";

type Variant = "attention" | "warn" | "accept" | "default";

const variantColors: Record<Variant, string> = {
    attention: "#e74c3c", // Vermelho
    warn: "#f1c40f",      // Amarelo
    accept: "#2ecc71",    // Verde
    default: "#68c3b7"
}

type Space = number | string;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: Variant;
    padding?: Space;
    children: React.ReactNode;
    onClick?: () => void;
    bg?: string;
    px?: Space; py?: Space;
    pt?: Space; pr?: Space; pb?: Space; pl?: Space;
    radius?: Space;
    /** define o tamanho da escala (padrão 8px) */
    baseUnit?: number;
}

const toSpace = (v: Space | undefined, unit: number) =>
  v === undefined ? undefined : typeof v === "number" ? `${v * unit}px` : v;

export const Button: React.FC<ButtonProps> = ({
    variant = "default",
    padding,
    bg,
    px,py,pt,pr,pb,pl,
    radius = 6,
    baseUnit = 8,
    style,
    children,
    ...rest
}) => {
    const backgroundColor = bg ?? variantColors[variant];

  // precedência: lados > eixo (px/py) > padding geral
  const pAll = toSpace(padding, baseUnit);
  const pT = toSpace(pt, baseUnit) ?? toSpace(py, baseUnit) ?? pAll;
  const pR = toSpace(pr, baseUnit) ?? toSpace(px, baseUnit) ?? pAll;
  const pB = toSpace(pb, baseUnit) ?? toSpace(py, baseUnit) ?? pAll;
  const pL = toSpace(pl, baseUnit) ?? toSpace(px, baseUnit) ?? pAll;

  return (
    <button
      style={{
        backgroundColor,
        border: "none",
        color: "#fff",
        cursor: "pointer",
        borderRadius: toSpace(radius, baseUnit),
        paddingTop: pT,
        paddingRight: pR,
        paddingBottom: pB,
        paddingLeft: pL,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}