// src/store/useReports.ts

// `create` cria a store (estado global) do Zustand.
// `persist` é um middleware que salva e restaura o estado do navegador (localStorage por padrão).
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Importamos apenas as "formas" (tipos) dos dados que trafegam na app.
// Isso ajuda o TypeScript a apontar erros cedo (autocompletar e validação).
import type { ViewMeta, ReportConfig, QueryResponse } from '../types';

// Esta é a "interface" da nossa store: descreve o que existe no estado
// e quais "ações" (funções) podem alterá-lo.
// - Ter um tipo forte aqui é ouro: toda a app sabe exatamente o que esperar.
type ReportsState = {
  // ---------- DADOS ----------
  // Lista de views disponíveis, carregadas do backend (GET /api/views).
  views: ViewMeta[];

  // Relatórios que o usuário salvou (nome, colunas, filtros, etc.).
  savedReports: ReportConfig[];

  // Resultado da última execução de consulta (linhas, totais, paginação...).
  currentResult?: QueryResponse;

  // ---------- AÇÕES (mutations) ----------
  // Seta a lista de views (normalmente após carregar da API).
  setViews: (v: ViewMeta[]) => void;

  // Adiciona um novo relatório salvo ao início da lista.
  addReport: (r: ReportConfig) => void;

  // Atualiza um relatório já salvo, fazendo um "merge" (patch) só nas chaves fornecidas.
  updateReport: (id: string, patch: Partial<ReportConfig>) => void;

  // Remove um relatório salvo pelo id.
  removeReport: (id: string) => void;

  // Define o resultado atual (após rodar a consulta).
  setCurrentResult: (q?: QueryResponse) => void;

  // Limpa o resultado atual (útil ao trocar de view, por exemplo).
  clearCurrentResult: () => void;
};

// `create<ReportsState>()` tipa a store inteira.
// Em volta, usamos `persist(...)` para que o estado sobreviva ao refresh da página.
// A `name` em `persist` é a chave usada no localStorage.
export const useReports = create<ReportsState>()(
  persist(
    (set) => ({
      // ---------- ESTADO INICIAL ----------
      views: [],            // começa vazio; será preenchido via setViews()
      savedReports: [],     // relatórios salvos pelo usuário
      currentResult: undefined, // nenhum resultado carregado inicialmente

      // ---------- IMPLEMENTAÇÃO DAS AÇÕES ----------

      // Substitui a lista de views inteira.
      // Dica: sempre prefira substituir tudo vs. mutar item a item,
      // a menos que você precise "mesclar". Ajuda na previsibilidade.
      setViews: (v) => set({ views: Array.isArray(v) ? v : [] }),


      // Insere um relatório no início do array (mais recente primeiro).
      // A função `set` recebe o estado anterior: (s) => novoEstado
      addReport: (r) =>
        set((s) => ({
          savedReports: [r, ...s.savedReports],
        })),

      // Atualiza um relatório salvo: procura pelo id e faz um spread/merge.
      // Se o id não existir, não muda nada (padrão seguro).
      updateReport: (id, patch) =>
        set((s) => ({
          savedReports: s.savedReports.map((r) =>
            r.id === id ? { ...r, ...patch } : r
          ),
        })),

      // Remove um relatório pelo id (filtra fora).
      removeReport: (id) =>
        set((s) => ({
          savedReports: s.savedReports.filter((r) => r.id !== id),
        })),

      // Define o resultado atual (pode receber undefined para limpar também).
      setCurrentResult: (q) => set({ currentResult: q }),

      // Atalho explícito para zerar o resultado atual.
      clearCurrentResult: () => set({ currentResult: undefined }),
    }),
    {
      // Chave no localStorage. Você pode trocar se quiser versionar/segregar.
      name: 'relatorios-store',

      // (Opcional) Se quiser salvar só parte do estado:
      // partialize: (state) => ({ savedReports: state.savedReports }),

      // (Opcional) Migrar versões antigas (útil quando mudar estrutura dos dados):
      // version: 1,
      // migrate: (persistedState, version) => { ... }
    }
  )
);

