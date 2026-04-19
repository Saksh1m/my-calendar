const TOKEN_KEY = 'dh_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const normalize = (doc) => {
  if (!doc || typeof doc !== 'object') return doc;
  if (Array.isArray(doc)) return doc.map(normalize);
  const { _id, __v, ...rest } = doc;
  return _id ? { id: _id, ...rest } : doc;
};

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return normalize(data);
}

export const api = {
  // auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me'),
  getPreferences: () => request('/auth/preferences'),
  updatePreferences: (payload) => request('/auth/preferences', { method: 'PUT', body: payload }),

  // tasks
  listTasks: () => request('/tasks'),
  createTask: (payload) => request('/tasks', { method: 'POST', body: payload }),
  updateTask: (id, payload) => request(`/tasks/${id}`, { method: 'PUT', body: payload }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  toggleTask: (id) => request(`/tasks/${id}/toggle`, { method: 'PATCH' }),

  // meetings
  listMeetings: () => request('/meetings'),
  createMeeting: (payload) => request('/meetings', { method: 'POST', body: payload }),
  deleteMeeting: (id) => request(`/meetings/${id}`, { method: 'DELETE' }),

  // planner
  listPlanner: () => request('/planner'),
  createPlanner: (payload) => request('/planner', { method: 'POST', body: payload }),
  deletePlanner: (id) => request(`/planner/${id}`, { method: 'DELETE' }),

  // analytics
  analytics: () => request('/analytics'),

  // sources
  listSources: () => request('/sources'),
  createSource: (payload) => request('/sources', { method: 'POST', body: payload }),
  deleteSource: (id) => request(`/sources/${id}`, { method: 'DELETE' }),
};
