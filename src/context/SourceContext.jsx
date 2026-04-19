import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const SourceContext = createContext();

export function SourceProvider({ children }) {
  const { user } = useAuth();
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setSources([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.listSources();
      setSources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addSource = useCallback(async (payload) => {
    const created = await api.createSource(payload);
    setSources((prev) => [...prev, created]);
    return created;
  }, []);

  const removeSource = useCallback(async (id) => {
    await api.deleteSource(id);
    setSources((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getSourceColor = useCallback(
    (name) => sources.find((s) => s.name === name)?.color || '#858796',
    [sources]
  );

  return (
    <SourceContext.Provider
      value={{ sources, loading, error, refresh, addSource, removeSource, getSourceColor }}
    >
      {children}
    </SourceContext.Provider>
  );
}

export function useSources() {
  const ctx = useContext(SourceContext);
  if (!ctx) throw new Error('useSources must be used within SourceProvider');
  return ctx;
}
