import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { useLocation } from 'react-router-dom';

import { useReports } from '../store/useReports';
import type { ViewMeta, QueryResponse, ReportConfig, Filter } from '../types';

import DataGrid from '../ui/DataGrid';
import { ViewSelect } from '../components/ViewSelect';
import { ColumnPicker } from '../components/ColumnPicker';
import { FiltersEditor } from '../components/FiltersEditor';
import { ActionsBar } from '../components/ActionsBar';
import { exportToXlsx } from '../utils/exportToXlsx';

export default function NovaConsulta() {
  const { views, setViews, addReport, setCurrentResult, currentResult, savedReports } = useReports();

  const [viewId, setViewId] = useState<string>('');
  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);

  const location = useLocation() as any;
  const editId: string | undefined = location?.state?.editReportId;

  // carregar views
  useEffect(() => {
    (async () => {
      const { data } = await axios.get<ViewMeta[]>('/api/views');
      setViews(data);
    })().catch(console.error);
  }, [setViews]);

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

  const toggleCol = (key: string, checked: boolean) => {
    setSelectedCols(prev => checked ? [...prev, key] : prev.filter(k => k !== key));
  };

  const canRun = !!viewId && selectedCols.length > 0;

  const runQuery = async () => {
    const { data } = await axios.post<QueryResponse>('/api/reports/run', {
      viewId,
      columns: selectedCols,
      filters,
    });
    setCurrentResult(data);
  };

  const onSave = () => {
    if (!view) return;
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
  };

  const onExport = () => {
    if (!currentResult) return;
    exportToXlsx(currentResult, view?.label || 'relatorio');
  };

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <ViewSelect views={views} value={viewId} onChange={setViewId} />
        <ColumnPicker view={view} selected={selectedCols} onToggle={toggleCol} />
        <FiltersEditor value={filters} onChange={setFilters} />
        <ActionsBar
          canRun={canRun}
          canExport={!!currentResult}
          onRun={runQuery}
          onSave={onSave}
          onExport={onExport}
        />
      </div>

      <div>
        {currentResult && <DataGrid rows={currentResult.rows} columns={selectedCols} />}
      </div>
    </section>
  );
}
