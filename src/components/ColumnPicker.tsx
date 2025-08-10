import type { ViewMeta } from '../types';

type Props = {
  view?: ViewMeta;
  selected: string[];
  onToggle: (key: string, checked: boolean) => void;
};

export function ColumnPicker({ view, selected, onToggle }: Props) {
  if (!view) return null;
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 4 }}>Colunas</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, maxHeight: 180, overflow: 'auto' }}>
        {view.columns.map(c => {
          const checked = selected.includes(c.key);
          return (
            <label key={c.key} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onToggle(c.key, e.target.checked)}
              />
              {c.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
