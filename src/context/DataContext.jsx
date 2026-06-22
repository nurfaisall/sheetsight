'use client';

import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import {
  validateFile,
  readFileAsArrayBuffer,
  parseWorkbook,
  readSheet,
} from '@/lib/parseSheet';

const DataContext = createContext(null);

const initial = {
  status: 'idle', // idle | loading | ready | error | empty
  error: null,
  file: null, // { name, size }
  wb: null, // workbook SheetJS (di memori)
  sheets: [],
  activeSheet: null,
  columns: [],
  rows: [], // baris bertipe (semua, sebelum filter)
  filters: {}, // { [columnName]: Set<string> } untuk kategori
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...initial, status: 'loading', file: action.file };
    case 'READY': {
      const empty = action.payload.rowCount === 0;
      return {
        ...state,
        status: empty ? 'empty' : 'ready',
        error: empty ? 'Data tidak cukup — file hanya berisi header atau kosong.' : null,
        wb: action.payload.wb,
        sheets: action.payload.sheets,
        activeSheet: action.payload.activeSheet,
        columns: action.payload.columns,
        rows: action.payload.rows,
        filters: {},
      };
    }
    case 'SHEET':
      return {
        ...state,
        status: action.payload.rowCount === 0 ? 'empty' : 'ready',
        activeSheet: action.payload.activeSheet,
        columns: action.payload.columns,
        rows: action.payload.rows,
        filters: {},
      };
    case 'ERROR':
      return { ...initial, status: 'error', error: action.error, file: state.file };
    case 'SET_FILTER': {
      const filters = { ...state.filters };
      if (!action.values || action.values.length === 0) delete filters[action.column];
      else filters[action.column] = new Set(action.values);
      return { ...state, filters };
    }
    case 'CLEAR_FILTERS':
      return { ...state, filters: {} };
    case 'RESET':
      return initial;
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const loadFile = useCallback(async (file) => {
    const invalid = validateFile(file);
    if (invalid) {
      dispatch({ type: 'LOADING', file: { name: file.name, size: file.size } });
      dispatch({ type: 'ERROR', error: invalid });
      return;
    }
    dispatch({ type: 'LOADING', file: { name: file.name, size: file.size } });
    try {
      const buf = await readFileAsArrayBuffer(file);
      const result = parseWorkbook(buf);
      dispatch({ type: 'READY', payload: result });
    } catch (e) {
      dispatch({
        type: 'ERROR',
        error: e?.message || 'Gagal memproses file. Pastikan file tidak rusak.',
      });
    }
  }, []);

  const selectSheet = useCallback(
    (name) => {
      if (!state.wb || name === state.activeSheet) return;
      try {
        const result = readSheet(state.wb, name);
        dispatch({ type: 'SHEET', payload: result });
      } catch (e) {
        dispatch({ type: 'ERROR', error: e?.message || 'Gagal membaca sheet.' });
      }
    },
    [state.wb, state.activeSheet]
  );

  const setFilter = useCallback((column, values) => {
    dispatch({ type: 'SET_FILTER', column, values });
  }, []);
  const clearFilters = useCallback(() => dispatch({ type: 'CLEAR_FILTERS' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  // Terapkan filter kategori ke baris
  const filteredRows = useMemo(() => {
    const entries = Object.entries(state.filters);
    if (!entries.length) return state.rows;
    return state.rows.filter((row) =>
      entries.every(([col, set]) => set.has(String(row[col])))
    );
  }, [state.rows, state.filters]);

  const value = useMemo(
    () => ({
      ...state,
      filteredRows,
      loadFile,
      selectSheet,
      setFilter,
      clearFilters,
      reset,
    }),
    [state, filteredRows, loadFile, selectSheet, setFilter, clearFilters, reset]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData harus di dalam <DataProvider>');
  return ctx;
}
