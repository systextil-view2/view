import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { useLocation } from 'react-router-dom';

import { useReports } from '../store/useReports';
import type { ViewMeta, QueryResponse, ReportConfig, Filter } from '../types';

import DataGrid from '../ui/DataGrid';
import { exportToXlsx } from '../utils/exportToXlsx';
import { Container, Stack, Card, Title, Flex, Button, Box, Badge, LoadingSpinner } from '../components/utils';

// ==================== DADOS MOCKADOS ====================
const mockViews: ViewMeta[] = [
  {
    id: 'clientes',
    name: 'TB_CLIENTES',
    label: 'Clientes',
    columns: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'nome', label: 'Nome', type: 'string' },
      { key: 'email', label: 'E-mail', type: 'string' },
      { key: 'telefone', label: 'Telefone', type: 'string' },
      { key: 'cidade_id', label: 'ID Cidade', type: 'number' },
      { key: 'data_cadastro', label: 'Data Cadastro', type: 'date' },
      { key: 'ativo', label: 'Ativo', type: 'boolean' },
    ],
  },
  {
    id: 'pedidos',
    name: 'TB_PEDIDOS',
    label: 'Pedidos',
    columns: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'cliente_id', label: 'ID Cliente', type: 'number' },
      { key: 'data_pedido', label: 'Data Pedido', type: 'date' },
      { key: 'valor_total', label: 'Valor Total', type: 'number' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'vendedor_id', label: 'ID Vendedor', type: 'number' },
    ],
  },
  {
    id: 'produtos',
    name: 'TB_PRODUTOS',
    label: 'Produtos',
    columns: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'nome', label: 'Nome', type: 'string' },
      { key: 'categoria', label: 'Categoria', type: 'string' },
      { key: 'preco', label: 'Preço', type: 'number' },
      { key: 'estoque', label: 'Estoque', type: 'number' },
      { key: 'fornecedor_id', label: 'ID Fornecedor', type: 'number' },
    ],
  },
  {
    id: 'cidades',
    name: 'TB_CIDADES',
    label: 'Cidades',
    columns: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'nome', label: 'Nome', type: 'string' },
      { key: 'uf', label: 'UF', type: 'string' },
      { key: 'regiao', label: 'Região', type: 'string' },
    ],
  },
  {
    id: 'vendedores',
    name: 'TB_VENDEDORES',
    label: 'Vendedores',
    columns: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'nome', label: 'Nome', type: 'string' },
      { key: 'email', label: 'E-mail', type: 'string' },
      { key: 'comissao', label: 'Comissão %', type: 'number' },
      { key: 'data_contratacao', label: 'Data Contratação', type: 'date' },
    ],
  },
];

const mockQueryResponse: QueryResponse = {
  rows: [
    { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 98765-4321', cidade: 'São Paulo', ativo: true },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(21) 97654-3210', cidade: 'Rio de Janeiro', ativo: true },
    { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', telefone: '(31) 96543-2109', cidade: 'Belo Horizonte', ativo: false },
    { id: 4, nome: 'Ana Oliveira', email: 'ana@email.com', telefone: '(41) 95432-1098', cidade: 'Curitiba', ativo: true },
    { id: 5, nome: 'Carlos Mendes', email: 'carlos@email.com', telefone: '(51) 94321-0987', cidade: 'Porto Alegre', ativo: true },
  ],
};

type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';

interface JoinConfig {
  id: string;
  targetTableId: string;
  joinType: JoinType;
  sourceColumn: string;
  targetColumn: string;
}

export default function NovaConsulta() {
  const { views, setViews, addReport, setCurrentResult, currentResult, savedReports } = useReports();

  const [viewId, setViewId] = useState<string>('');
  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [joins, setJoins] = useState<JoinConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [useMockData, setUseMockData] = useState(true);
  
  // Estados para drag-and-drop visual de joins
  const [selectedJoinTable, setSelectedJoinTable] = useState<string>('');
  const [dragState, setDragState] = useState<{
    isDrawing: boolean;
    startColumn: { tableId: string; columnKey: string; label: string } | null;
    currentPosition: { x: number; y: number } | null;
    startPosition: { x: number; y: number } | null;
  }>({
    isDrawing: false,
    startColumn: null,
    currentPosition: null,
    startPosition: null,
  });

  const location = useLocation() as any;
  const editId: string | undefined = location?.state?.editReportId;

  // carregar views (mock ou API)
  useEffect(() => {
    if (useMockData) {
      setViews(mockViews);
    } else {
    (async () => {
      const { data } = await axios.get<ViewMeta[]>('/api/views');
      setViews(data);
    })().catch(console.error);
    }
  }, [setViews, useMockData]);

  // modo edição (opcional)
  useEffect(() => {
    if (!editId) return;
    const cfg = savedReports.find(r => r.id === editId);
    if (cfg) {
      setViewId(cfg.viewId);
      setSelectedCols(cfg.selectedColumns);
      setFilters(cfg.filters ?? []);
    }
  }, [editId, savedReports]);

  const view = useMemo(() => views.find(v => v.id === viewId), [views, viewId]);

  const toggleCol = (key: string) => {
    setSelectedCols(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const canRun = !!viewId && selectedCols.length > 0;

  const updateJoin = (id: string, updates: Partial<JoinConfig>) => {
    setJoins(joins.map(j => j.id === id ? { ...j, ...updates } : j));
  };

  const removeJoin = (id: string) => {
    setJoins(joins.filter(j => j.id !== id));
  };

  const handleColumnDragStart = (tableId: string, columnKey: string, label: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDragState({
      isDrawing: true,
      startColumn: { tableId, columnKey, label },
      startPosition: { x: rect.right, y: rect.top + rect.height / 2 },
      currentPosition: { x: event.clientX, y: event.clientY },
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (dragState.isDrawing) {
      setDragState(prev => ({
        ...prev,
        currentPosition: { x: event.clientX, y: event.clientY },
      }));
    }
  };

  const handleColumnDrop = (targetTableId: string, targetColumnKey: string) => {
    if (dragState.startColumn && dragState.startColumn.tableId !== targetTableId) {
      // Criar novo JOIN
      const newJoin: JoinConfig = {
        id: uuid(),
        targetTableId,
        joinType: 'INNER',
        sourceColumn: dragState.startColumn.columnKey,
        targetColumn: targetColumnKey,
      };
      setJoins([...joins, newJoin]);
    }
    
    setDragState({
      isDrawing: false,
      startColumn: null,
      currentPosition: null,
      startPosition: null,
    });
  };

  const handleMouseUp = () => {
    setDragState({
      isDrawing: false,
      startColumn: null,
      currentPosition: null,
      startPosition: null,
    });
  };

  const runQuery = async () => {
    setIsLoading(true);
    try {
      if (useMockData) {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentResult(mockQueryResponse);
      } else {
    const { data } = await axios.post<QueryResponse>('/api/reports/run', {
      viewId,
      columns: selectedCols,
      filters,
          joins,
    });
    setCurrentResult(data);
      }
    } catch (error) {
      console.error('Erro ao executar consulta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = async () => {
    if (!view) return;
    setIsSaving(true);
    try {
    const cfg: ReportConfig = {
      id: uuid(),
      name: `${view.label} - ${new Date().toLocaleDateString()}`,
      viewId: view.id,
      selectedColumns: selectedCols,
      filters,
      createdAt: new Date().toISOString(),
      folder: 'Geral',
    };
    addReport(cfg);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const onExport = () => {
    if (!currentResult) return;
    exportToXlsx(currentResult, view?.label || 'relatorio');
  };

  return (
    <Container maxW={1400} center paddingX={4}>
      <Stack gap={6}>
        {/* Header */}
        <Flex justify="between" align="center" wrap>
          <Stack gap={1}>
            <Title size="xl" font="'Inter', system-ui" weight={700} color="#1a1a1a">
              Nova Consulta
            </Title>
            <Title size="sm" color="#666" weight={400}>
              Selecione a tabela e as colunas para criar seu relatório personalizado
            </Title>
          </Stack>
          
          {/* Toggle Mock/API */}
          <Flex align="center" gap={2}>
            <Title size="xs" color="#666" weight={500}>
              Modo: {useMockData ? 'Demo' : 'Produção'}
            </Title>
            <Button
              variant={useMockData ? 'attention' : 'default'}
              px={3}
              py={1}
              radius={4}
              onClick={() => setUseMockData(!useMockData)}
              style={{ fontSize: '12px' }}
            >
              {useMockData ? '🧪 Dados Mock' : '🔌 API Real'}
            </Button>
          </Flex>
        </Flex>

        {/* Configuração da Consulta */}
        <Card elevation={2} p={4}>
          <Stack gap={4}>
            <Title size="lg" weight={600} color="#1a1a1a">
              Configuração
            </Title>

            {/* Seleção de Tabela/View */}
            <Stack gap={2}>
              <Title size="sm" weight={600} color="#333">
                1. Selecione a Tabela
              </Title>
              <Box style={{ position: 'relative' }}>
                <select 
                  value={viewId} 
                  onChange={(e) => {
                    setViewId(e.target.value);
                    setSelectedCols([]);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                >
                  <option value="">Selecione uma tabela...</option>
                  {views.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.label} ({v.columns.length} colunas)
                    </option>
                  ))}
                </select>
              </Box>
            </Stack>

            {/* JOINs Visual Builder */}
            {view && (
              <Stack gap={3}>
                <Flex justify="between" align="center" wrap>
                  <Stack gap={1}>
                    <Title size="sm" weight={600} color="#333">
                      2. Relacionamentos (JOINs) - Arraste para Conectar
                    </Title>
                    <Title size="xs" color="#666" weight={400}>
                      Selecione uma tabela para relacionar e arraste entre as colunas
                    </Title>
                  </Stack>
                  <Badge variant="info" size="sm">
                    {joins.length} JOIN{joins.length !== 1 ? 'S' : ''}
                  </Badge>
                </Flex>

                {/* Seletor de Tabela para JOIN */}
                <Card elevation={0} bordered p={3} bg="#f8f9fa">
                  <Flex align="center" gap={3} wrap>
                    <Title size="xs" weight={600} color="#374151">
                      Selecione a tabela para relacionar:
                    </Title>
                    <select
                      value={selectedJoinTable}
                      onChange={(e) => setSelectedJoinTable(e.target.value)}
                      style={{
                        flex: '1 1 300px',
                        padding: '10px 16px',
                        fontSize: '14px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        outline: 'none',
                        fontWeight: 500,
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    >
                      <option value="">-- Escolha uma tabela --</option>
                      {views.filter(v => v.id !== viewId).map(v => {
                        const hasJoin = joins.some(j => j.targetTableId === v.id);
                        return (
                          <option key={v.id} value={v.id}>
                            {hasJoin ? '✓ ' : ''}{v.label} ({v.columns.length} colunas)
                          </option>
                        );
                      })}
                    </select>
                    {selectedJoinTable && (
                      <Button
                        variant="default"
                        px={3}
                        py={1.5}
                        radius={6}
                        onClick={() => setSelectedJoinTable('')}
                        style={{ fontSize: '12px' }}
                      >
                        ✕ Limpar
                      </Button>
                    )}
                  </Flex>
                </Card>

                {/* Canvas para Drag and Drop */}
                {selectedJoinTable ? (
                  <Card 
                    elevation={0} 
                    bordered 
                    p={0}
                    bg="#fafafa"
                    style={{ position: 'relative', overflow: 'visible' }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {/* SVG overlay para linhas */}
                    {dragState.isDrawing && dragState.startPosition && dragState.currentPosition && (
                      <svg
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          pointerEvents: 'none',
                          zIndex: 9999,
                        }}
                      >
                        <defs>
                          <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="10"
                            refX="9"
                            refY="3"
                            orient="auto"
                          >
                            <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                          </marker>
                        </defs>
                        <line
                          x1={dragState.startPosition.x}
                          y1={dragState.startPosition.y}
                          x2={dragState.currentPosition.x}
                          y2={dragState.currentPosition.y}
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray="8,4"
                          markerEnd="url(#arrowhead)"
                          style={{
                            animation: 'dash 0.5s linear infinite',
                          }}
                        />
                      </svg>
                    )}

                    <style>
                      {`
                        @keyframes dash {
                          to {
                            stroke-dashoffset: -12;
                          }
                        }
                      `}
                    </style>

                    <Flex gap={4} style={{ padding: '20px', minHeight: '300px', justifyContent: 'center' }}>
                      {/* Tabela Principal */}
                      <Card elevation={2} p={3} style={{ flex: '0 1 350px', maxHeight: '500px', overflow: 'auto' }}>
                        <Stack gap={2}>
                          <Flex align="center" gap={2} style={{ position: 'sticky', top: 0, backgroundColor: '#fff', paddingBottom: '8px', borderBottom: '2px solid #3b82f6' }}>
                            <Badge variant="info" size="sm">Principal</Badge>
                            <Title size="sm" weight={600} color="#1a1a1a">
                              {view.label}
                            </Title>
                          </Flex>
                          <Stack gap={1}>
                            {view.columns.map(col => {
                              const hasJoinWithThis = joins.some(
                                j => j.targetTableId === selectedJoinTable && j.sourceColumn === col.key
                              );
                              return (
                                <Box
                                  key={col.key}
                                  px={2}
                                  py={1.5}
                                  radius={4}
                                  style={{
                                    backgroundColor: hasJoinWithThis 
                                      ? '#dbeafe' 
                                      : dragState.startColumn?.columnKey === col.key && 
                                        dragState.startColumn?.tableId === viewId 
                                        ? '#bfdbfe' 
                                        : '#fff',
                                    border: `2px solid ${hasJoinWithThis ? '#3b82f6' : '#e5e7eb'}`,
                                    cursor: 'grab',
                                    transition: 'all 0.2s',
                                    userSelect: 'none',
                                  }}
                                  onMouseDown={(e) => handleColumnDragStart(viewId, col.key, col.label, e)}
                                  onMouseEnter={(e) => {
                                    if (!dragState.isDrawing && !hasJoinWithThis) {
                                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                                      e.currentTarget.style.borderColor = '#3b82f6';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!hasJoinWithThis && (!dragState.isDrawing || dragState.startColumn?.columnKey !== col.key)) {
                                      e.currentTarget.style.backgroundColor = '#fff';
                                      e.currentTarget.style.borderColor = '#e5e7eb';
                                    }
                                  }}
                                  onMouseUp={() => {
                                    if (dragState.isDrawing && dragState.startColumn?.tableId !== viewId) {
                                      handleColumnDrop(viewId, col.key);
                                    }
                                  }}
                                >
                                  <Flex justify="between" align="center">
                                    <Flex align="center" gap={1}>
                                      {hasJoinWithThis && <span style={{ fontSize: '12px' }}>🔗</span>}
                                      <Title size="xs" weight={500} color="#374151">
                                        {col.label}
                                      </Title>
                                    </Flex>
                                    <Badge 
                                      variant={
                                        col.type === 'number' ? 'info' : 
                                        col.type === 'date' ? 'warning' : 
                                        'default'
                                      } 
                                      size="sm"
                                      style={{ fontSize: '9px' }}
                                    >
                                      {col.type}
                                    </Badge>
                                  </Flex>
                                </Box>
                              );
                            })}
                          </Stack>
                        </Stack>
                      </Card>

                      {/* Indicador Visual de Conexão */}
                      <Flex 
                        align="center" 
                        justify="center"
                        style={{ 
                          flex: '0 0 60px',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          width: '3px',
                          height: '80%',
                          background: 'repeating-linear-gradient(to bottom, #3b82f6 0px, #3b82f6 8px, transparent 8px, transparent 16px)',
                          borderRadius: '2px',
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: '#fff',
                          border: '3px solid #3b82f6',
                          borderRadius: '50%',
                          padding: '8px',
                          fontSize: '20px',
                        }}>
                          🔗
      </div>
                      </Flex>

                      {/* Tabela Selecionada para JOIN */}
                      {(() => {
                        const targetView = views.find(v => v.id === selectedJoinTable);
                        if (!targetView) return null;
                        
                        return (
                          <Card elevation={2} p={3} style={{ flex: '0 1 350px', maxHeight: '500px', overflow: 'auto' }}>
                            <Stack gap={2}>
                              <Flex align="center" gap={2} style={{ position: 'sticky', top: 0, backgroundColor: '#fff', paddingBottom: '8px', borderBottom: '2px solid #10b981' }}>
                                <Badge variant="success" size="sm">Relacionar</Badge>
                                <Title size="sm" weight={600} color="#1a1a1a">
                                  {targetView.label}
                                </Title>
                              </Flex>
                              <Stack gap={1}>
                                {targetView.columns.map(col => {
                                  const hasJoin = joins.some(
                                    j => j.targetTableId === targetView.id && j.targetColumn === col.key
                                  );
                                  return (
                                    <Box
                                      key={col.key}
                                      px={2}
                                      py={1.5}
                                      radius={4}
                                      style={{
                                        backgroundColor: hasJoin ? '#dcfce7' : '#fff',
                                        border: `2px solid ${hasJoin ? '#10b981' : '#e5e7eb'}`,
                                        cursor: dragState.isDrawing ? 'crosshair' : 'grab',
                                        transition: 'all 0.2s',
                                        userSelect: 'none',
                                      }}
                                      onMouseDown={(e) => handleColumnDragStart(targetView.id, col.key, col.label, e)}
                                      onMouseEnter={(e) => {
                                        if (dragState.isDrawing && dragState.startColumn?.tableId !== targetView.id) {
                                          e.currentTarget.style.backgroundColor = '#fef3c7';
                                          e.currentTarget.style.borderColor = '#f59e0b';
                                          e.currentTarget.style.transform = 'scale(1.02)';
                                        } else if (!dragState.isDrawing && !hasJoin) {
                                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                                          e.currentTarget.style.borderColor = '#10b981';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        if (!hasJoin) {
                                          e.currentTarget.style.backgroundColor = '#fff';
                                          e.currentTarget.style.borderColor = '#e5e7eb';
                                        } else {
                                          e.currentTarget.style.backgroundColor = '#dcfce7';
                                          e.currentTarget.style.borderColor = '#10b981';
                                        }
                                      }}
                                      onMouseUp={() => {
                                        if (dragState.isDrawing && dragState.startColumn?.tableId !== targetView.id) {
                                          handleColumnDrop(targetView.id, col.key);
                                        }
                                      }}
                                    >
                                      <Flex justify="between" align="center">
                                        <Flex align="center" gap={1}>
                                          {hasJoin && <span style={{ fontSize: '12px' }}>🔗</span>}
                                          <Title size="xs" weight={500} color="#374151">
                                            {col.label}
                                          </Title>
                                        </Flex>
                                        <Badge 
                                          variant={
                                            col.type === 'number' ? 'info' : 
                                            col.type === 'date' ? 'warning' : 
                                            'default'
                                          } 
                                          size="sm"
                                          style={{ fontSize: '9px' }}
                                        >
                                          {col.type}
                                        </Badge>
                                      </Flex>
                                    </Box>
                                  );
                                })}
                              </Stack>
                            </Stack>
                          </Card>
                        );
                      })()}
                    </Flex>
                  </Card>
                ) : (
                  <Box 
                    p={6} 
                    radius={8}
                    style={{ 
                      backgroundColor: '#f0f9ff', 
                      border: '2px dashed #0284c7',
                      textAlign: 'center'
                    }}
                  >
                    <Stack gap={2} align="center">
                      <span style={{ fontSize: '48px' }}>🔍</span>
                      <Title size="sm" color="#0369a1" weight={600}>
                        Selecione uma tabela acima para começar
                      </Title>
                      <Title size="xs" color="#0284c7" weight={400}>
                        Escolha qual tabela você deseja relacionar com {view.label}
                      </Title>
                    </Stack>
                  </Box>
                )}

                {/* Lista de JOINs criados */}
                {joins.length === 0 && (
                  <Box 
                    p={3} 
                    radius={6}
                    style={{ 
                      backgroundColor: '#f0f9ff', 
                      border: '1px dashed #0284c7',
                      textAlign: 'center'
                    }}
                  >
                    <Title size="xs" color="#0369a1" weight={500}>
                      💡 Arraste de uma coluna para outra para criar relações entre tabelas
                    </Title>
                  </Box>
                )}

                {joins.length > 0 && (
                  <Stack gap={2}>
                    <Title size="xs" weight={600} color="#666">
                      Relações Configuradas:
                    </Title>
                    {joins.map((join, index) => {
                      const sourceView = view;
                      const targetView = views.find(v => v.id === join.targetTableId);
                      const sourceCol = sourceView?.columns.find(c => c.key === join.sourceColumn);
                      const targetCol = targetView?.columns.find(c => c.key === join.targetColumn);
                      
                      return (
                        <Card key={join.id} elevation={1} p={3} bg="#fff" style={{ border: '2px solid #10b981' }}>
                          <Flex justify="between" align="start" gap={3}>
                            {/* Info da Relação */}
                            <Stack gap={2} style={{ flex: 1 }}>
                              <Flex align="center" gap={2}>
                                <Badge variant="success" size="sm">
                                  JOIN #{index + 1}
                                </Badge>
                                <Title size="xs" color="#666">
                                  {sourceView?.label} → {targetView?.label}
                                </Title>
                              </Flex>

                              {/* Visual da Conexão */}
                              <Flex align="center" gap={2} style={{ 
                                padding: '12px',
                                backgroundColor: '#f0fdf4',
                                borderRadius: '8px',
                                border: '1px solid #86efac'
                              }}>
                                <Box px={2} py={1} radius={4} style={{ backgroundColor: '#dbeafe', border: '1px solid #3b82f6' }}>
                                  <Title size="xs" weight={600} color="#1e40af">
                                    {sourceCol?.label || join.sourceColumn}
                                  </Title>
                                </Box>
                                
                                <Flex align="center" gap={1} style={{ flex: 1, justifyContent: 'center' }}>
                                  <div style={{ 
                                    flex: 1, 
                                    height: '2px', 
                                    background: 'linear-gradient(to right, #3b82f6 50%, transparent 50%)',
                                    backgroundSize: '8px 2px',
                                    backgroundRepeat: 'repeat-x'
                                  }} />
                                  <span style={{ fontSize: '16px' }}>🔗</span>
                                  <div style={{ 
                                    flex: 1, 
                                    height: '2px', 
                                    background: 'linear-gradient(to right, #10b981 50%, transparent 50%)',
                                    backgroundSize: '8px 2px',
                                    backgroundRepeat: 'repeat-x'
                                  }} />
                                </Flex>

                                <Box px={2} py={1} radius={4} style={{ backgroundColor: '#d1fae5', border: '1px solid #10b981' }}>
                                  <Title size="xs" weight={600} color="#065f46">
                                    {targetCol?.label || join.targetColumn}
                                  </Title>
                                </Box>
                              </Flex>

                              {/* Seletor de Tipo de JOIN */}
                              <Flex align="center" gap={2}>
                                <Title size="xs" color="#666" weight={500}>
                                  Tipo:
                                </Title>
                                <select
                                  value={join.joinType}
                                  onChange={(e) => updateJoin(join.id, { joinType: e.target.value as JoinType })}
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    color: '#059669',
                                  }}
                                >
                                  <option value="INNER">INNER JOIN</option>
                                  <option value="LEFT">LEFT JOIN</option>
                                  <option value="RIGHT">RIGHT JOIN</option>
                                  <option value="FULL">FULL JOIN</option>
                                </select>
                                
                                <Box 
                                  px={2} 
                                  py={1} 
                                  radius={4}
                                  style={{ 
                                    backgroundColor: '#fef3c7',
                                    fontFamily: 'monospace',
                                    fontSize: '11px',
                                    color: '#92400e',
                                    flex: 1
                                  }}
                                >
                                  ON {sourceView?.name}.{join.sourceColumn} = {targetView?.name}.{join.targetColumn}
                                </Box>
                              </Flex>
                            </Stack>

                            {/* Botão Remover */}
                            <Button 
                              variant="attention" 
                              px={2} 
                              py={1} 
                              radius={4}
                              onClick={() => removeJoin(join.id)}
                              style={{ fontSize: '11px' }}
                            >
                              ✕
                            </Button>
                          </Flex>
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </Stack>
            )}

            {/* Seleção de Colunas */}
            {view && (
              <Stack gap={2}>
                <Flex justify="between" align="center">
                  <Title size="sm" weight={600} color="#333">
                    3. Selecione as Colunas
                  </Title>
                  <Flex gap={2}>
                    <Button 
                      variant="default" 
                      px={3} 
                      py={1} 
                      radius={4}
                      onClick={() => setSelectedCols(view.columns.map(c => c.key))}
                    >
                      Selecionar Todas
                    </Button>
                    <Button 
                      variant="default" 
                      px={3} 
                      py={1} 
                      radius={4}
                      onClick={() => setSelectedCols([])}
                    >
                      Limpar
                    </Button>
                  </Flex>
                </Flex>
                
                <Card elevation={0} bordered p={3} bg="#f9fafb">
                  <Stack gap={3}>
                    {/* Colunas da Tabela Principal */}
                    <Stack gap={2}>
                      <Flex align="center" gap={2}>
                        <Badge variant="info" size="sm">Tabela Principal</Badge>
                        <Title size="xs" color="#666" weight={600}>
                          {view.label}
                        </Title>
                      </Flex>
                      <Flex gap={2} wrap>
                        {view.columns.map(col => {
                          const isSelected = selectedCols.includes(col.key);
                          return (
                            <Box
                              key={col.key}
                              px={3}
                              py={2}
                              radius={6}
                              style={{
                                cursor: 'pointer',
                                backgroundColor: isSelected ? '#3b82f6' : '#fff',
                                color: isSelected ? '#fff' : '#333',
                                border: `1px solid ${isSelected ? '#3b82f6' : '#ddd'}`,
                                transition: 'all 0.2s',
                                userSelect: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                              onClick={() => toggleCol(col.key)}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                                  e.currentTarget.style.borderColor = '#9ca3af';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = '#fff';
                                  e.currentTarget.style.borderColor = '#ddd';
                                }
                              }}
                            >
                              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                {col.label}
                              </span>
                              <Badge 
                                variant={
                                  col.type === 'number' ? 'info' : 
                                  col.type === 'date' ? 'warning' : 
                                  col.type === 'boolean' ? 'success' : 
                                  'default'
                                } 
                                size="sm"
                                style={{ fontSize: '10px' }}
                              >
                                {col.type}
                              </Badge>
                            </Box>
                          );
                        })}
                      </Flex>
                    </Stack>

                    {/* Colunas das Tabelas Joined */}
                    {joins.map(join => {
                      const joinedView = views.find(v => v.id === join.targetTableId);
                      if (!joinedView) return null;
                      return (
                        <Stack key={join.id} gap={2}>
                          <Flex align="center" gap={2}>
                            <Badge variant="success" size="sm">{join.joinType}</Badge>
                            <Title size="xs" color="#666" weight={600}>
                              {joinedView.label}
                            </Title>
                          </Flex>
                          <Flex gap={2} wrap>
                            {joinedView.columns.map(col => {
                              const colKey = `${joinedView.id}.${col.key}`;
                              const isSelected = selectedCols.includes(colKey);
                              return (
                                <Box
                                  key={colKey}
                                  px={3}
                                  py={2}
                                  radius={6}
                                  style={{
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#10b981' : '#fff',
                                    color: isSelected ? '#fff' : '#333',
                                    border: `1px solid ${isSelected ? '#10b981' : '#ddd'}`,
                                    transition: 'all 0.2s',
                                    userSelect: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                  }}
                                  onClick={() => toggleCol(colKey)}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                                      e.currentTarget.style.borderColor = '#9ca3af';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = '#fff';
                                      e.currentTarget.style.borderColor = '#ddd';
                                    }
                                  }}
                                >
                                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                    {col.label}
                                  </span>
                                  <Badge 
                                    variant={
                                      col.type === 'number' ? 'info' : 
                                      col.type === 'date' ? 'warning' : 
                                      col.type === 'boolean' ? 'success' : 
                                      'default'
                                    } 
                                    size="sm"
                                    style={{ fontSize: '10px' }}
                                  >
                                    {col.type}
                                  </Badge>
                                </Box>
                              );
                            })}
                          </Flex>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Card>

                {selectedCols.length > 0 && (
                  <Box p={2} radius={4} style={{ border: '1px solid #10b981', backgroundColor: '#ecfdf5' }}>
                    <Title size="xs" color="#059669" weight={600}>
                      ✓ {selectedCols.length} coluna{selectedCols.length > 1 ? 's' : ''} selecionada{selectedCols.length > 1 ? 's' : ''}
                    </Title>
                  </Box>
                )}
              </Stack>
            )}

            {/* Filtros (Opcional) */}
            {view && (
              <Stack gap={2}>
                <Title size="sm" weight={600} color="#333">
                  4. Filtros Avançados (Opcional)
                </Title>
                <textarea
                  rows={4}
                  placeholder='Ex: [{"column": "status", "operator": "=", "value": "ativo"}]'
                  value={JSON.stringify(filters, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      if (Array.isArray(parsed)) setFilters(parsed);
                    } catch {
                      // mantém inválido até corrigir
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </Stack>
            )}

            {/* Preview SQL Gerado */}
            {view && selectedCols.length > 0 && (
              <Card elevation={0} bordered p={3} bg="#fefce8" style={{ borderColor: '#fbbf24' }}>
                <Stack gap={2}>
                  <Flex align="center" gap={2}>
                    <Title size="xs" weight={600} color="#92400e">
                      📝 Preview da Query SQL
                    </Title>
                  </Flex>
                  <Box
                    p={2}
                    radius={4}
                    style={{
                      backgroundColor: '#1e293b',
                      color: '#e2e8f0',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      overflow: 'auto',
                      maxHeight: '150px',
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {`SELECT\n  ${selectedCols.map(c => {
                        if (c.includes('.')) {
                          const [tableId, colKey] = c.split('.');
                          const table = views.find(v => v.id === tableId);
                          return `${table?.name}.${colKey}`;
                        }
                        return `${view.name}.${c}`;
                      }).join(',\n  ')}\nFROM ${view.name}${joins.map(j => {
                        const targetView = views.find(v => v.id === j.targetTableId);
                        if (!targetView || !j.sourceColumn || !j.targetColumn) return '';
                        return `\n${j.joinType} JOIN ${targetView.name}\n  ON ${view.name}.${j.sourceColumn} = ${targetView.name}.${j.targetColumn}`;
                      }).join('')}${filters.length > 0 ? '\nWHERE ...' : ''}`}
      </div>
                  </Box>
                </Stack>
              </Card>
            )}

            {/* Ações */}
            <Flex gap={2} justify="end" style={{ paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
              <Button 
                variant="default" 
                px={4} 
                py={2}
                disabled={!canRun || isLoading}
                onClick={runQuery}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size={16} color="#666" />
                    Carregando...
                  </>
                ) : (
                  <>🔍 Pré-visualizar</>
                )}
              </Button>
              <Button 
                variant="accept" 
                px={4} 
                py={2}
                disabled={!canRun || isSaving}
                onClick={onSave}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isSaving ? (
                  <>
                    <LoadingSpinner size={16} color="#fff" />
                    Salvando...
                  </>
                ) : (
                  <>💾 Salvar Relatório</>
                )}
              </Button>
              <Button 
                variant="attention" 
                px={4} 
                py={2}
                disabled={!currentResult}
                onClick={onExport}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                📥 Exportar
              </Button>
            </Flex>
          </Stack>
        </Card>

        {/* Resultados */}
        {currentResult && (
          <Card elevation={2} p={4}>
            <Stack gap={3}>
              <Flex justify="between" align="center">
                <Title size="lg" weight={600} color="#1a1a1a">
                  Resultados
                </Title>
                <Badge variant="info" size="sm">
                  {currentResult.rows.length} registro{currentResult.rows.length !== 1 ? 's' : ''}
                </Badge>
              </Flex>
              <Box style={{ overflowX: 'auto' }}>
                <DataGrid rows={currentResult.rows} columns={selectedCols} />
              </Box>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
