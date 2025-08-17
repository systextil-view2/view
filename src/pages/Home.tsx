import React from 'react';
import { Container, Flex, Stack, Card, Title, Button, Box, Badge, LoadingSpinner } from '../components/utils';

// Dados mockados para demonstração
const recentReports = [
  {
    id: '1',
    name: 'Vendas por Região',
    viewId: 'vendas',
    lastRun: '2024-01-15T10:30:00Z',
    folder: 'Comercial',
    columns: ['regiao', 'vendedor', 'valor', 'data']
  },
  {
    id: '2', 
    name: 'Clientes Ativos',
    viewId: 'clientes',
    lastRun: '2024-01-14T14:20:00Z',
    folder: 'Comercial',
    columns: ['nome', 'email', 'status', 'data_cadastro']
  },
  {
    id: '3',
    name: 'Produtos em Estoque',
    viewId: 'produtos',
    lastRun: '2024-01-13T09:15:00Z',
    folder: 'Estoque',
    columns: ['produto', 'categoria', 'quantidade', 'preco']
  }
];

const quickActions = [
  {
    title: 'Nova Consulta',
    description: 'Criar um novo relatório personalizado',
    icon: '📊',
    variant: 'accept' as const,
    action: () => console.log('Nova consulta')
  },
  {
    title: 'Relatórios Salvos',
    description: 'Acessar relatórios previamente criados',
    icon: '📁',
    variant: 'default' as const,
    action: () => console.log('Relatórios salvos')
  },
  {
    title: 'Importar Dados',
    description: 'Carregar dados externos para análise',
    icon: '📥',
    variant: 'attention' as const,
    action: () => console.log('Importar dados')
  }
];

const stats = [
  { label: 'Relatórios Criados', value: '24', change: '+12%' },
  { label: 'Consultas Executadas', value: '156', change: '+8%' },
  { label: 'Views Disponíveis', value: '8', change: '+2' },
  { label: 'Dados Processados', value: '2.4M', change: '+15%' }
];

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleQuickAction = (action: () => void) => {
    setIsLoading(true);
    // Simular loading
    setTimeout(() => {
      action();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Container maxW={1400} center paddingX={4}>
      <Stack gap={6}>
        {/* Header */}
        <Flex justify="between" align="center" wrap>
          <Stack gap={1}>
            <Title size="xl" font="'Inter', system-ui" weight={700} color="#1a1a1a">
              Dashboard de Relatórios
            </Title>
            <Title size="sm" color="#666" weight={400}>
              Visualize e gerencie seus relatórios de banco de dados
            </Title>
          </Stack>
          <Button 
            variant="accept" 
            padding={3} 
            px={4} 
            py={2}
            disabled={isLoading}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size={16} color="#fff" />
                Carregando...
              </>
            ) : (
              '+ Nova Consulta'
            )}
          </Button>
        </Flex>

        {/* Stats Cards */}
        <Flex gap={3} wrap>
          {stats.map((stat, index) => (
            <Card key={index} elevation={1} p={3} style={{ flex: '1 1 200px', minWidth: 0 }}>
              <Stack gap={1}>
                <Title size="sm" color="#666" weight={500}>
                  {stat.label}
                </Title>
                <Flex align="center" gap={2}>
                  <Title size="lg" weight={700} color="#1a1a1a">
                    {stat.value}
                  </Title>
                  <Title size="xs" color="#2ecc71" weight={600}>
                    {stat.change}
                  </Title>
                </Flex>
              </Stack>
            </Card>
          ))}
        </Flex>

        {/* Main Content */}
        <Flex gap={6} wrap>
          {/* Quick Actions */}
          <Card elevation={2} p={4} style={{ flex: '1 1 400px', minWidth: 0 }}>
            <Stack gap={4}>
              <Title size="lg" weight={600} color="#1a1a1a">
                Ações Rápidas
              </Title>
              <Stack gap={3}>
                {quickActions.map((action, index) => (
                  <Card 
                    key={index} 
                    elevation={0} 
                    bordered 
                    p={3} 
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,.08)';
                    }}
                                         onClick={() => handleQuickAction(action.action)}
                  >
                    <Flex align="center" gap={3}>
                      <Title size="lg" style={{ fontSize: '24px' }}>
                        {action.icon}
                      </Title>
                      <Stack gap={1} style={{ flex: 1 }}>
                        <Title size="sm" weight={600} color="#1a1a1a">
                          {action.title}
                        </Title>
                        <Title size="xs" color="#666" weight={400}>
                          {action.description}
                        </Title>
                      </Stack>
                      <Button variant={action.variant} px={2} py={1} radius={4}>
                        →
                      </Button>
                    </Flex>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Card>

          {/* Recent Reports */}
          <Card elevation={2} p={4} style={{ flex: '1 1 500px', minWidth: 0 }}>
            <Stack gap={4}>
              <Flex justify="between" align="center">
                <Title size="lg" weight={600} color="#1a1a1a">
                  Relatórios Recentes
                </Title>
                <Button variant="default" px={3} py={1} radius={4}>
                  Ver Todos
                </Button>
              </Flex>
              <Stack gap={3}>
                {recentReports.map((report) => (
                  <Card 
                    key={report.id} 
                    elevation={0} 
                    bordered 
                    p={3}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,.08)';
                    }}
                  >
                    <Stack gap={2}>
                                             <Flex justify="between" align="center">
                         <Title size="sm" weight={600} color="#1a1a1a">
                           {report.name}
                         </Title>
                         <Badge variant="info" size="sm">
                           {report.folder}
                         </Badge>
                       </Flex>
                      <Title size="xs" color="#666" weight={400}>
                        Última execução: {formatDate(report.lastRun)}
                      </Title>
                      <Flex gap={1} wrap>
                        {report.columns.slice(0, 3).map((col, index) => (
                          <Box 
                            key={index} 
                            px={2} 
                            py={1} 
                            radius={2}
                            style={{ 
                              background: '#f0f0f0', 
                              fontSize: '11px',
                              color: '#666'
                            }}
                          >
                            {col}
                          </Box>
                        ))}
                        {report.columns.length > 3 && (
                          <Box 
                            px={2} 
                            py={1} 
                            radius={2}
                            style={{ 
                              background: '#f0f0f0', 
                              fontSize: '11px',
                              color: '#666'
                            }}
                          >
                            +{report.columns.length - 3}
                          </Box>
                        )}
                      </Flex>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Flex>

        {/* Features Section */}
        <Card elevation={1} p={4} bg="#f8f9fa">
          <Stack gap={4}>
            <Title size="lg" weight={600} color="#1a1a1a" style={{ textAlign: 'center' }}>
              Recursos Principais
            </Title>
            <Flex gap={4} wrap justify="center">
              <Flex align="center" gap={2} style={{ flex: '1 1 200px', minWidth: 0 }}>
                <Box 
                  p={2} 
                  radius={4}
                  style={{ background: '#e8f5e8', fontSize: '20px' }}
                >
                  🔍
                </Box>
                <Stack gap={1}>
                  <Title size="sm" weight={600} color="#1a1a1a">
                    Consultas SQL
                  </Title>
                  <Title size="xs" color="#666" weight={400}>
                    Execute queries complexas
                  </Title>
                </Stack>
              </Flex>
              <Flex align="center" gap={2} style={{ flex: '1 1 200px', minWidth: 0 }}>
                <Box 
                  p={2} 
                  radius={4}
                  style={{ background: '#fff3cd', fontSize: '20px' }}
                >
                  📊
                </Box>
                <Stack gap={1}>
                  <Title size="sm" weight={600} color="#1a1a1a">
                    Visualizações
                  </Title>
                  <Title size="xs" color="#666" weight={400}>
                    Gráficos e tabelas
                  </Title>
                </Stack>
              </Flex>
              <Flex align="center" gap={2} style={{ flex: '1 1 200px', minWidth: 0 }}>
                <Box 
                  p={2} 
                  radius={4}
                  style={{ background: '#d1ecf1', fontSize: '20px' }}
                >
                  💾
                </Box>
                <Stack gap={1}>
                  <Title size="sm" weight={600} color="#1a1a1a">
                    Exportação
                  </Title>
                  <Title size="xs" color="#666" weight={400}>
                    Excel, CSV, PDF
                  </Title>
                </Stack>
              </Flex>
              <Flex align="center" gap={2} style={{ flex: '1 1 200px', minWidth: 0 }}>
                <Box 
                  p={2} 
                  radius={4}
                  style={{ background: '#f8d7da', fontSize: '20px' }}
                >
                  🔄
                </Box>
                <Stack gap={1}>
                  <Title size="sm" weight={600} color="#1a1a1a">
                    Agendamento
                  </Title>
                  <Title size="xs" color="#666" weight={400}>
                    Relatórios automáticos
                  </Title>
                </Stack>
              </Flex>
            </Flex>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
