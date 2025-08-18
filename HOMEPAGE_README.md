# Homepage - Sistema de Visualização de Relatórios

## Visão Geral

Uma homepage moderna e responsiva para o sistema de visualização de relatórios, construída utilizando os componentes utils do design system.

## Características

### 🎨 Design Moderno
- Interface limpa e profissional
- Tipografia Inter para melhor legibilidade
- Esquema de cores consistente
- Animações suaves e feedback visual

### 📱 Responsividade
- Layout adaptativo para diferentes tamanhos de tela
- Cards flexíveis que se reorganizam automaticamente
- Breakpoints otimizados para mobile, tablet e desktop

### ⚡ Performance
- Componentes otimizados
- Estados de loading para melhor UX
- Transições suaves

## Seções da Homepage

### 1. Header
- Título principal com descrição
- Botão de ação principal (Nova Consulta)
- Layout responsivo com wrap automático

### 2. Cards de Estatísticas
- Métricas importantes do sistema
- Indicadores de crescimento
- Layout em grid responsivo

### 3. Ações Rápidas
- Acesso direto às funcionalidades principais
- Ícones intuitivos
- Efeitos hover interativos

### 4. Relatórios Recentes
- Lista dos últimos relatórios executados
- Informações detalhadas (nome, pasta, última execução)
- Tags das colunas utilizadas
- Badges para categorização

### 5. Recursos Principais
- Apresentação dos recursos do sistema
- Ícones coloridos por categoria
- Layout em grid responsivo

## Componentes Utilizados

### Core Components
- `Container`: Limitação de largura e centralização
- `Flex/Stack`: Layout flexível e empilhamento
- `Card`: Containers com elevação e bordas
- `Title`: Tipografia consistente
- `Button`: Ações interativas
- `Box`: Spacing e estilização básica

### Extended Components
- `Badge`: Indicadores de status e categorias
- `LoadingSpinner`: Estados de carregamento

## Dados Mockados

A homepage utiliza dados mockados para demonstração:

### Relatórios Recentes
```typescript
const recentReports = [
  {
    id: '1',
    name: 'Vendas por Região',
    viewId: 'vendas',
    lastRun: '2024-01-15T10:30:00Z',
    folder: 'Comercial',
    columns: ['regiao', 'vendedor', 'valor', 'data']
  },
  // ...
];
```

### Ações Rápidas
```typescript
const quickActions = [
  {
    title: 'Nova Consulta',
    description: 'Criar um novo relatório personalizado',
    icon: '📊',
    variant: 'accept',
    action: () => console.log('Nova consulta')
  },
  // ...
];
```

### Estatísticas
```typescript
const stats = [
  { label: 'Relatórios Criados', value: '24', change: '+12%' },
  { label: 'Consultas Executadas', value: '156', change: '+8%' },
  // ...
];
```

## Funcionalidades Interativas

### Estados de Loading
- Botão principal com spinner durante ações
- Feedback visual para o usuário
- Prevenção de múltiplos cliques

### Efeitos Hover
- Cards com elevação dinâmica
- Transições suaves
- Feedback visual imediato

### Responsividade
- Layout adaptativo
- Texto e espaçamentos otimizados
- Breakpoints bem definidos

## Melhorias Futuras

### Funcionalidades Sugeridas
1. **Integração com API real**: Substituir dados mockados
2. **Filtros dinâmicos**: Busca e filtros nos relatórios
3. **Notificações**: Sistema de alertas e notificações
4. **Temas**: Suporte a temas claro/escuro
5. **Animações**: Micro-interações mais elaboradas

### Componentes Adicionais
1. **SearchBar**: Busca global
2. **NotificationBell**: Indicador de notificações
3. **UserMenu**: Menu do usuário
4. **Breadcrumb**: Navegação hierárquica

## Como Usar

```typescript
import { Home } from './pages/Home';

// A homepage já está configurada e pronta para uso
// Basta importar e renderizar no roteamento
```

## Dependências

- React 18+
- TypeScript
- Componentes utils do design system
- Fonte Inter (Google Fonts)

## Estrutura de Arquivos

```
src/
├── pages/
│   └── Home.tsx              # Homepage principal
├── components/
│   └── utils/
│       ├── index.ts          # Exportações
│       ├── Box.tsx           # Container básico
│       ├── Card.tsx          # Cards com elevação
│       ├── Container.tsx     # Container responsivo
│       ├── Flex.tsx          # Layout flexível
│       ├── Title.tsx         # Tipografia
│       ├── Button.tsx        # Botões
│       ├── Badge.tsx         # Badges
│       └── LoadingSpinner.tsx # Spinner de loading
└── index.css                 # Estilos globais
```
