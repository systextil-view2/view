import {useReports} from '../store/useReports';

type Props = { onNew: () => void };

export default function Sidebar({onNew}: Props){
    const { savedReports } = useReports();


     return (
    <aside style={{ borderRight: '1px solid #e5e7eb', padding: 16, overflow: 'auto' }}>
      <h2 style={{ margin: '8px 0 16px' }}>Relatórios</h2>
      <button onClick={onNew} style={{ padding: '8px 12px', marginBottom: 16 }}>
        + Nova consulta
      </button>

      {savedReports.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Nenhum relatório salvo ainda.</p>
      ) : (
        <ul style={{ display: 'grid', gap: 8 }}>
          {savedReports.map(r => (
            <li key={r.id} title={r.name} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 14 }}>
                {r.folder ? `${r.folder} / ` : ''}{r.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );

}

