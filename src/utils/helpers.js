import { differenceInHours, isPast, format } from 'date-fns';

export function getUrgencyLevel(deadline, completed) {
  if (completed) return 'completed';
  if (isPast(new Date(deadline))) return 'overdue';
  const hoursLeft = differenceInHours(new Date(deadline), new Date());
  if (hoursLeft <= 24) return 'critical';
  if (hoursLeft <= 72) return 'approaching';
  return 'safe';
}

export function getUrgencyBadge(urgency) {
  const map = {
    overdue: { bg: 'danger', label: 'Overdue' },
    critical: { bg: 'danger', label: 'Critical' },
    approaching: { bg: 'warning', label: 'Approaching' },
    safe: { bg: 'success', label: 'Safe' },
    completed: { bg: 'secondary', label: 'Done' },
  };
  return map[urgency] || map.safe;
}

export function getSourceBadge(source) {
  const map = {
    college: { bg: 'primary', label: 'College' },
    internship: { bg: 'success', label: 'Internship' },
    personal: { bg: 'warning', label: 'Personal' },
  };
  return map[source] || { bg: 'secondary', label: source };
}

export function getPriorityBadge(priority) {
  const map = {
    high: { bg: 'danger', label: 'High' },
    medium: { bg: 'warning', label: 'Medium' },
    low: { bg: 'info', label: 'Low' },
  };
  return map[priority] || map.low;
}

export function formatDeadline(date) {
  return format(new Date(date), 'MMM dd, yyyy hh:mm a');
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
