import { Button } from '../components/utils/Buttons';
import { Card } from '../components/utils/Card';
import { Container } from '../components/utils/Container';
import { Flex, Stack } from '../components/utils/Flex';
import { Title } from '../components/utils/TextHeader';
import { Box } from '../components/utils/Box';
import { useReports } from '../store/useReports';
import './Sidebar.css';

type Props = { onNew: () => void };

export default function Sidebar({ onNew }: Props) {
  const { savedReports } = useReports();

  return (
    <Box
      p={3}
      radius={2}
      className="sidebar-container"
      style={{
        borderRight: '1px solid #e5e7eb',
        backgroundColor: '#fafafa',
        minHeight: '100vh',
        width: '320px',
        overflow: 'auto'
      }}
    >
      <Stack gap={4}>
        {/* Header da Sidebar */}
        <Stack gap={3}>
          <Title size="xl" bold color="#1f2937">
            Relatórios
          </Title>
          <Button 
            variant="accept" 
            padding={2} 
            baseUnit={4} 
            onClick={onNew}
            style={{
              borderRadius: '8px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            + Nova consulta
          </Button>
        </Stack>

        {/* Lista de Relatórios Salvos */}
        <Stack gap={2}>
          <Title size="sm" color="#6b7280" bold>
            Relatórios Salvos
          </Title>
          
          {savedReports.length === 0 ? (
            <Card 
              elevation={1} 
              p={4} 
              radius={2}
              style={{
                backgroundColor: '#ffffff',
                border: '1px dashed #d1d5db'
              }}
            >
              <Stack gap={2} align="center">
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '24px', color: '#9ca3af' }}>📊</span>
                </div>
                <Stack gap={1} align="center">
                  <Title size="sm" color="#6b7280">
                    Nenhum relatório salvo
                  </Title>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#9ca3af', 
                    textAlign: 'center',
                    margin: 0
                  }}>
                    Crie sua primeira consulta para começar
                  </p>
                </Stack>
              </Stack>
            </Card>
          ) : (
            <Stack gap={2}>
              {savedReports.map((report, index) => (
                <Card 
                  key={report.id}
                  elevation={1}
                  p={3}
                  radius={2}
                  className="report-card"
                  style={{
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <Stack gap={2}>
                    <Flex justify="between" align="center">
                      <Stack gap={1}>
                        <Title size="sm" bold color="#1f2937">
                          {report.name}
                        </Title>
                        {report.folder && (
                          <p style={{ 
                            fontSize: '12px', 
                            color: '#6b7280',
                            margin: 0,
                            fontWeight: 500
                          }}>
                            📁 {report.folder}
                          </p>
                        )}
                      </Stack>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981'
                      }} />
                    </Flex>
                    
                    <Flex gap={2} align="center" className="report-actions">
                      <Button 
                        variant="attention"
                        px={2}
                        py={1}
                        radius={1}
                        style={{
                          fontSize: '12px',
                          fontWeight: 500
                        }}
                      >
                        Abrir
                      </Button>
                      <Button 
                        variant="warn"
                        px={2}
                        py={1}
                        radius={1}
                        style={{
                          fontSize: '12px',
                          fontWeight: 500
                        }}
                      >
                        Excluir
                      </Button>
                    </Flex>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>

        {/* Footer da Sidebar */}
        <Box 
          pt={3}
          style={{
            borderTop: '1px solid #e5e7eb',
            marginTop: 'auto'
          }}
        >
          <Flex justify="between" align="center">
            <Title size="xs" color="#9ca3af">
              {savedReports.length} relatório{savedReports.length !== 1 ? 's' : ''}
            </Title>
            <Button 
              variant="warn"
              px={2}
              py={1}
              radius={1}
              style={{
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              Limpar todos
            </Button>
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
}

