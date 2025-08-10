// Tipos de relatórios salvos, filtros e resposta da execução

import type { ViewMeta } from "./view";

/** Operadores comuns de filtro */
export type FilterOperator =
| 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'
| 'contains' | 'startsWith' | 'endsWith' | 'in' | 'between';


export type Filter = {
    /** campo deve existir em ViewMeta.columns.key */
    field: string;
    op: FilterOperator;

    /** valor pode ser string/number/Date/array dependendo do op */
    value: unknown;
}

/** Parâmetros que você envia na execução: colunas + filtros + paginação opcional */
export type RunParams = {
    columns: string[];
    filters?: Filter[];
    page?: number;
    pageSize?: number;
    sort?: string[]; // ex: ["UF:asc", "DATA_CRIACAO:desc"]
}

/** Configuração persistida de um relatório (lado do front) */
export type ReportConfig = {
    id: string;                  // uuid no front
    name: string;                // "Clientes por UF"
    viewId: ViewMeta['id'];      // referencia a view
    selectedColumns: string[];   // chaves das colunas escolhidas
    filters?: Filter[];          // filtros salvos
    createdAt: string;           // ISO
    folder?: string;             // "Comercial/2025"
    sort?: string[];             // ordenação salva
    pageSize?: number;           // preferencia do usuário
}

/** Resposta padrão da consulta */
export type QueryResponse = {
    rows: Array<Record<string,unknown>>;
    /** total de linhas no servidor (se houver paginação) */
    total?: number;
    page?: number;
    pageSize?: number;
    hasMore?: boolean;
    /** meta extra (ex: totais, somatórios) */
    aggregates?: Record<string, number>;
}