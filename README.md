UI Primitives — Design System (React + TypeScript)

Primitives reutilizáveis para layout e UI: Box, Flex/Stack, Container, Card, Title, Button — com escala numérica de espaçamento, tokens tipados e overrides previsíveis.

Estrutura de pastas
src/
  components/
    utils/
      Box.tsx
      Flex.tsx
      Container.tsx
      Card.tsx
      Title.tsx
      Button.tsx
      index.ts
  ui/
    helper/
      helper.ts


ui/helper/helper.ts contém tipos/funcões compartilhadas (escala, mapeamentos de alinhamento, etc).

Conceitos

Escala numérica: 2 ⇒ 2 * baseUnit px (padrão baseUnit = 8).

Precedência de espaçamento: lado (pt/pr/pb/pl) > eixo (px/py) > geral (p).

Overrides: style da prop sempre vence o estilo interno.

Tokens tipados: variantes de cor, tamanhos, alinhamentos, etc. evitam valores inválidos.

Helper (ui/helper/helper.ts)
export type Space = number | string;
export const toSpace = (v: Space | undefined, unit: number) =>
  v === undefined ? undefined : typeof v === "number" ? `${v * unit}px` : v;

export type Direction = "row" | "column" | "row-reverse" | "column-reverse";
export type Align = "start" | "center" | "end" | "stretch" | "baseline";
export type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";

export const mapAlign = (a?: Align) =>
  a ? ({ start:"flex-start", center:"center", end:"flex-end", stretch:"stretch", baseline:"baseline" } as const)[a] : undefined;

export const mapJustify = (j?: Justify) =>
  j ? ({ start:"flex-start", center:"center", end:"flex-end", between:"space-between", around:"space-around", evenly:"space-evenly" } as const)[j] : undefined;

Componentes (APIs resumidas)
Box

Base de spacing/radius.

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  baseUnit?: number;
  m?: Space; mt?: Space; mr?: Space; mb?: Space; ml?: Space; mx?: Space; my?: Space;
  p?: Space; pt?: Space; pr?: Space; pb?: Space; pl?: Space; px?: Space; py?: Space;
  radius?: Space;
}

Flex / Stack

Layout flex e centralização (Stack = Flex com direction="column").

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: Direction; align?: Align; justify?: Justify;
  wrap?: boolean; gap?: Space; baseUnit?: number;
  fullWidth?: boolean; fullHeight?: boolean;
}

Container

Limita largura e centraliza horizontalmente.

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxW?: number | string; center?: boolean; paddingX?: number; baseUnit?: number;
}

Card

Plano de fundo com sombra/borda e spacing de Box.

type Elevation = 0 | 1 | 2 | 3;
interface CardProps extends BoxProps {
  elevation?: Elevation; bordered?: boolean; bg?: string;
}

Title

Tipografia com 5 tamanhos + fonte/peso.

type TitleSize = "xs" | "sm" | "md" | "lg" | "xl";
type AllowedAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: TitleSize; font?: string; bold?: boolean; weight?: React.CSSProperties["fontWeight"];
  color?: string; as?: AllowedAs;
}

Button

Variantes + cor custom + padding numérico.

type Variant = "attention" | "warn" | "accept";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; bg?: string;
  padding?: Space; px?: Space; py?: Space; pt?: Space; pr?: Space; pb?: Space; pl?: Space;
  radius?: Space; baseUnit?: number; fullWidth?: boolean;
}

Exemplos

Centralizar cards:

import { Container, Flex, Stack, Card, Title, Button } from "@/components/utils";

<Container maxW={1000} center paddingX={4}>
  <Flex justify="center" align="center" gap={3} wrap>
    {[1,2,3].map((n) => (
      <Card key={n} elevation={2} p={3} radius={2} style={{ width: 280 }}>
        <Stack gap={1}>
          <Title size="lg" bold>Card {n}</Title>
          <p>Conteúdo.</p>
          <Button variant="accept" padding={2}>Confirmar</Button>
        </Stack>
      </Card>
    ))}
  </Flex>
</Container>


Spacing numérico + override:

<Flex align="baseline" justify="between" gap={2} style={{ background: "#fafafa" }}>
  <Title size="sm">Subtítulo</Title>
  <Button bg="#111" radius="999px" px={3} py={1} style={{ boxShadow: "0 6px 16px rgba(0,0,0,.15)" }}>
    Ação
  </Button>
</Flex>


Title com fonte/peso:

<Title size="xl" font="'Inter', system-ui" weight={700} color="#222" as="h1">
  Dashboard
</Title>

Troubleshooting

baseline/stretch não existe → cheque se mapAlign cobre todas as chaves do tipo Align.

Conflito de tipos do Title com SVG → as é só para elementos HTML (h1…div).

Padding não aplica → ver precedência: pt/pr/pb/pl > px/py > p e o baseUnit.

Roadmap (opcional)

Grid responsivo tipado (cols, minColWidth, gap).

theme.ts com tokens (cores, radius, baseUnit) + ThemeProvider.