import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setTasks([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.listTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTask = useCallback(async (task) => {
    const created = await api.createTask(task);
    setTasks((prev) => [created, ...prev]);
  }, []);

  const editTask = useCallback(async (task) => {
    const { id, ...payload } = task;
    const updated = await api.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const deleteTask = useCallback(async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback(async (id) => {
    const updated = await api.toggleTask(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, loading, error, refresh, addTask, editTask, deleteTask, toggleComplete }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
}
