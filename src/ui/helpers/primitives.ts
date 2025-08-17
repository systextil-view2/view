import React from "react";

export type Space = number | string;
export const toSpace = (v: Space | undefined, unit: number) =>
  v === undefined ? undefined : typeof v === "number" ? `${v * unit}px` : v;

export type Align =
  | "start" | "center" | "end" | "stretch" | "baseline";
export type Justify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";
export type Direction = "row" | "column" | "row-reverse" | "column-reverse";

export const mapAlign = (a?: Align) =>
  a ? ({ start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" } as const)[a] ?? a : undefined;

export const mapJustify = (j?: Justify) =>
  j
    ? (
        {
          start: "flex-start",
          center: "center",
          end: "flex-end",
          between: "space-between",
          around: "space-around",
          evenly: "space-evenly",
        } as const
      )[j]
    : undefined;
