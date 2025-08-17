import React from 'react';

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

export default function HomeWithoutUtils() {
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
    setTimeout(() => {
      action();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      maxWidth: '1400px',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: '32px',
      paddingRight: '32px',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <h1 style={{
              fontSize: '40px',
              fontFamily: "'Inter', system-ui",
              fontWeight: 700,
              color: '#1a1a1a',
              margin: 0
            }}>
              Dashboard de Relatórios
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#666',
              fontWeight: 400,
              margin: 0
            }}>
              Visualize e gerencie seus relatórios de banco de dados
            </p>
          </div>
          <button
            disabled={isLoading}
            style={{
              backgroundColor: '#2ecc71',
              border: 'none',
              color: '#fff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              borderRadius: '48px',
              paddingTop: '16px',
              paddingRight: '32px',
              paddingBottom: '16px',
              paddingLeft: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isLoading ? 0.7 : 1,
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #f3f3f3',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Carregando...
              </>
            ) : (
              '+ Nova Consulta'
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              background: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,.08)',
              padding: '24px',
              borderRadius: '16px',
              flex: '1 1 200px',
              minWidth: 0
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <p style={{
                  fontSize: '18px',
                  color: '#666',
                  fontWeight: 500,
                  margin: 0
                }}>
                  {stat.label}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <span style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#1a1a1a'
                  }}>
                    {stat.value}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: '#2ecc71',
                    fontWeight: 600
                  }}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{
          display: 'flex',
          gap: '48px',
          flexWrap: 'wrap'
        }}>
          {/* Quick Actions */}
          <div style={{
            background: '#fff',
            boxShadow: '0 6px 16px rgba(0,0,0,.12)',
            padding: '32px',
            borderRadius: '16px',
            flex: '1 1 400px',
            minWidth: 0
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px'
            }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#1a1a1a',
                margin: 0
              }}>
                Ações Rápidas
              </h2>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                {quickActions.map((action, index) => (
                  <div 
                    key={index} 
                    style={{
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,.08)',
                      padding: '24px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
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
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px'
                    }}>
                      <span style={{
                        fontSize: '24px'
                      }}>
                        {action.icon}
                      </span>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        flex: 1
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#1a1a1a',
                          margin: 0
                        }}>
                          {action.title}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          color: '#666',
                          fontWeight: 400,
                          margin: 0
                        }}>
                          {action.description}
                        </p>
                      </div>
                      <button style={{
                        backgroundColor: action.variant === 'accept' ? '#2ecc71' : 
                                       action.variant === 'attention' ? '#e74c3c' : '#68c3b7',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        borderRadius: '32px',
                        paddingTop: '8px',
                        paddingRight: '16px',
                        paddingBottom: '8px',
                        paddingLeft: '16px',
                        fontSize: '16px'
                      }}>
                        →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div style={{
            background: '#fff',
            boxShadow: '0 6px 16px rgba(0,0,0,.12)',
            padding: '32px',
            borderRadius: '16px',
            flex: '1 1 500px',
            minWidth: 0
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  margin: 0
                }}>
                  Relatórios Recentes
                </h2>
                <button style={{
                  backgroundColor: '#68c3b7',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  borderRadius: '32px',
                  paddingTop: '8px',
                  paddingRight: '24px',
                  paddingBottom: '8px',
                  paddingLeft: '24px',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Ver Todos
                </button>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                {recentReports.map((report) => (
                  <div 
                    key={report.id} 
                    style={{
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,.08)',
                      padding: '24px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,.08)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#1a1a1a',
                          margin: 0
                        }}>
                          {report.name}
                        </h3>
                        <span style={{
                          background: '#d1ecf1',
                          color: '#0c5460',
                          fontWeight: 500,
                          display: 'inline-block',
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}>
                          {report.folder}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: 400,
                        margin: 0
                      }}>
                        Última execução: {formatDate(report.lastRun)}
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap'
                      }}>
                        {report.columns.slice(0, 3).map((col, index) => (
                          <span 
                            key={index} 
                            style={{
                              background: '#f0f0f0',
                              fontSize: '11px',
                              color: '#666',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}
                          >
                            {col}
                          </span>
                        ))}
                        {report.columns.length > 3 && (
                          <span style={{
                            background: '#f0f0f0',
                            fontSize: '11px',
                            color: '#666',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            +{report.columns.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          background: '#f8f9fa',
          boxShadow: '0 2px 6px rgba(0,0,0,.08)',
          padding: '32px',
          borderRadius: '16px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 600,
              color: '#1a1a1a',
              textAlign: 'center',
              margin: 0
            }}>
              Recursos Principais
            </h2>
            <div style={{
              display: 'flex',
              gap: '32px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flex: '1 1 200px',
                minWidth: 0
              }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#e8f5e8',
                  fontSize: '20px'
                }}>
                  🔍
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    margin: 0
                  }}>
                    Consultas SQL
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: 400,
                    margin: 0
                  }}>
                    Execute queries complexas
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flex: '1 1 200px',
                minWidth: 0
              }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#fff3cd',
                  fontSize: '20px'
                }}>
                  📊
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    margin: 0
                  }}>
                    Visualizações
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: 400,
                    margin: 0
                  }}>
                    Gráficos e tabelas
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flex: '1 1 200px',
                minWidth: 0
              }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#d1ecf1',
                  fontSize: '20px'
                }}>
                  💾
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    margin: 0
                  }}>
                    Exportação
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: 400,
                    margin: 0
                  }}>
                    Excel, CSV, PDF
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flex: '1 1 200px',
                minWidth: 0
              }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#f8d7da',
                  fontSize: '20px'
                }}>
                  🔄
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    margin: 0
                  }}>
                    Agendamento
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: 400,
                    margin: 0
                  }}>
                    Relatórios automáticos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
