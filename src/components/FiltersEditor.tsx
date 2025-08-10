import type { Filter } from '../types';
import { useState, useEffect } from 'react';

type Props = {
  value?: Filter[];
  onChange: (f: Filter[]) => void;
};

export function FiltersEditor({ value = [], onChange }: Props) {
  const [raw, setRaw] = useState<string>(JSON.stringify(value, null, 2));

  useEffect(() => { setRaw(JSON.stringify(value, null, 2)); }, [value]);

  const tryParse = (txt: string) => {
    setRaw(txt);
    try {
      const parsed = JSON.parse(txt);
      if (Array.isArray(parsed)) onChange(parsed as Filter[]);
    } catch {
      // mantém texto até ficar válido
    }
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: 4 }}>Filtros (JSON)</label>
      <textarea rows={6} style={{ width: 360 }} value={raw} onChange={(e) => tryParse(e.target.value)} />
    </div>
  );
}
