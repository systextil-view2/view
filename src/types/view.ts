// Tipos e contratos relacionados às Views (metadados vindos do back)
export type ColumnType = 'string' | 'number' | 'date' | 'boolean'; 

export type ColumnMeta = {
    /** chave técnica vinda do back (ex: "UF", "DATA_CRIACAO") */
    key: string;

    /** rótulo para UI (ex: "UF", "Data de Criação") */
    label: string;

    /** tipo básico para ajudar no grid e formatação */
    type: ColumnType;

    /** formato opcional para exibição (ex: "pt-BR", "dd/MM/yyyy") */
    format?: string;
}


export type ViewMeta = {
    /** id interno da view (pode ser UUID ou o próprio nome da view) */
    id: string;
    
    /** nome técnico no banco (ex: "VW_CLIENTES_ATIVOS") */
    name: string;
    
    /** nome amigável pro usuário (ex: "Clientes Ativos") */
    label: string;

    /** colunas disponíveis nessa view */
    columns: ReadonlyArray<ColumnMeta>;

    /** ordenação padrão opcional (ex: ["DATA_CRIACAO:desc"]) */
    defaultSort?: ReadonlyArray<string>;

    /** quaisquer flags extras que o back exponha (ex: suportaPaginação: true) */
    capabilities?: Record<string, unknown>;
}