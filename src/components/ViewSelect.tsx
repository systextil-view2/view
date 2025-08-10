import type { ViewMeta } from '../types';

type Props = {
  views: ViewMeta[];
  value: string;
  onChange: (id: string) => void;
};

export function ViewSelect({ views, value, onChange }: Props) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 4 }}>View</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Selecione…</option>
        {views.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
      </select>
    </div>
  );
}
