type Props = {
  canRun: boolean;
  canExport: boolean;
  onRun: () => void;
  onSave: () => void;
  onExport: () => void;
};

export function ActionsBar({ canRun, canExport, onRun, onSave, onExport }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button disabled={!canRun} onClick={onRun}>Pré-visualizar</button>
      <button disabled={!canExport} onClick={onExport}>Exportar</button>
      <button disabled={!canRun} onClick={onSave}>Salvar relatório</button>
    </div>
  );
}
