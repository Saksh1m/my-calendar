import { createContext, useContext, useReducer, useCallback } from 'react';
import { initialTasks } from '../data/mockData';
import { generateId } from '../utils/helpers';

const TaskContext = createContext();

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return [{ ...action.payload, id: generateId(), createdAt: new Date() }, ...state];
    case 'EDIT_TASK':
      return state.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload } : t));
    case 'DELETE_TASK':
      return state.filter((t) => t.id !== action.payload);
    case 'TOGGLE_COMPLETE':
      return state.map((t) => (t.id === action.payload ? { ...t, completed: !t.completed } : t));
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  const addTask = useCallback((task) => dispatch({ type: 'ADD_TASK', payload: task }), []);
  const editTask = useCallback((task) => dispatch({ type: 'EDIT_TASK', payload: task }), []);
  const deleteTask = useCallback((id) => dispatch({ type: 'DELETE_TASK', payload: id }), []);
  const toggleComplete = useCallback((id) => dispatch({ type: 'TOGGLE_COMPLETE', payload: id }), []);

  return (
    <TaskContext.Provider value={{ tasks, addTask, editTask, deleteTask, toggleComplete }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
}
