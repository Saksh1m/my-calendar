import { useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext';
import { api } from '../api/client';

const STORAGE_KEY = 'dh_notified_tasks';
const POLL_MS = 30 * 1000;

function loadNotified() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveNotified(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export default function useBrowserReminders() {
  const { tasks } = useTasks();
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    let leadMinutes = 60;
    let cancelled = false;

    api.getPreferences()
      .then((p) => {
        if (!cancelled && p?.reminderLeadMinutes) leadMinutes = p.reminderLeadMinutes;
      })
      .catch(() => {});

    const tick = () => {
      if (Notification.permission !== 'granted') return;

      const notified = loadNotified();
      const now = Date.now();
      const leadMs = leadMinutes * 60 * 1000;
      let changed = false;

      // prune entries for tasks that no longer exist or whose deadline changed
      const validIds = new Set(tasksRef.current.map((t) => `${t.id}:${new Date(t.deadline).getTime()}`));
      for (const key of Object.keys(notified)) {
        if (!validIds.has(key)) {
          delete notified[key];
          changed = true;
        }
      }

      for (const t of tasksRef.current) {
        if (t.completed) continue;
        const deadlineMs = new Date(t.deadline).getTime();
        if (Number.isNaN(deadlineMs)) continue;
        if (deadlineMs < now) continue;
        if (deadlineMs - now > leadMs) continue;

        const key = `${t.id}:${deadlineMs}`;
        if (notified[key]) continue;

        try {
          const minsLeft = Math.max(1, Math.round((deadlineMs - now) / 60000));
          new Notification(`⏰ ${t.title}`, {
            body: `Due in ${minsLeft} minute${minsLeft !== 1 ? 's' : ''} · ${t.source} · ${t.priority} priority`,
            tag: t.id,
          });
          notified[key] = now;
          changed = true;
        } catch {
          // ignore — some browsers throw if focus required
        }
      }

      if (changed) saveNotified(notified);
    };

    // run immediately, then poll
    tick();
    const id = setInterval(tick, POLL_MS);

    // re-check whenever tab regains focus
    const onFocus = () => tick();
    window.addEventListener('focus', onFocus);

    return () => {
      cancelled = true;
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, []);
}
