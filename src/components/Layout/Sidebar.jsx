import { useState } from 'react';
import { Nav, Badge, Modal, Form, Button, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FaCalendarAlt, FaTasks, FaChartBar, FaMicrosoft, FaBell, FaFilter, FaPlus, FaTrash } from 'react-icons/fa';
import { useTasks } from '../../context/TaskContext';
import { useSources } from '../../context/SourceContext';
import { getUrgencyLevel } from '../../utils/helpers';

const COLOR_PRESETS = ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b', '#36b9cc', '#9b59b6', '#fd7e14', '#20c997'];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tasks } = useTasks();
  const { sources, addSource, removeSource } = useSources();

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(COLOR_PRESETS[0]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const pending = tasks.filter((t) => !t.completed).length;
  const overdue = tasks.filter((t) => getUrgencyLevel(t.deadline, t.completed) === 'overdue').length;

  const links = [
    { path: '/', label: 'Calendar', icon: <FaCalendarAlt /> },
    { path: '/tasks', label: 'Tasks', icon: <FaTasks />, badge: pending },
    { path: '/analytics', label: 'Analytics', icon: <FaChartBar /> },
    { path: '/teams', label: 'Teams Sync', icon: <FaMicrosoft /> },
    { path: '/reminders', label: 'Reminders', icon: <FaBell />, badge: overdue > 0 ? overdue : null, badgeBg: 'danger' },
  ];

  const activeSource = location.pathname === '/tasks' ? searchParams.get('source') : null;

  const handleSourceClick = (name) => {
    navigate(`/tasks?source=${encodeURIComponent(name)}`);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await addSource({ name: newName, color: newColor });
      setNewName('');
      setNewColor(COLOR_PRESETS[0]);
      setShowAdd(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete source "${name}"?`)) return;
    try {
      await removeSource(id);
      if (activeSource === name) navigate('/tasks');
    } catch (err) {
      window.alert(err.message);
    }
  };

  const pendingBySource = (name) =>
    tasks.filter((t) => t.source === name && !t.completed).length;

  return (
    <div className="sidebar bg-white border-end d-none d-lg-block" style={{ width: '240px', minHeight: 'calc(100vh - 56px)' }}>
      <div className="p-3">
        <small className="text-muted text-uppercase fw-bold">Navigation</small>
        <Nav className="flex-column mt-2">
          {links.map(({ path, label, icon, badge, badgeBg }) => (
            <Nav.Link
              key={path}
              as={Link}
              to={path}
              active={location.pathname === path && !activeSource}
              className="d-flex align-items-center justify-content-between rounded px-3 py-2 mb-1"
            >
              <span className="d-flex align-items-center gap-2">
                {icon} {label}
              </span>
              {badge != null && (
                <Badge bg={badgeBg || 'primary'} pill>{badge}</Badge>
              )}
            </Nav.Link>
          ))}
        </Nav>

        <hr />

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted text-uppercase fw-bold d-flex align-items-center gap-1">
            <FaFilter size={10} /> Sources
          </small>
          <Button
            size="sm"
            variant="link"
            className="p-0 text-primary"
            onClick={() => setShowAdd(true)}
            title="Add source"
          >
            <FaPlus size={12} />
          </Button>
        </div>

        <div className="mt-2">
          {sources.length === 0 && (
            <small className="text-muted px-3">No sources yet</small>
          )}
          {sources.map((s) => {
            const isActive = activeSource === s.name;
            const count = pendingBySource(s.name);
            return (
              <div
                key={s.id}
                className={`source-row d-flex align-items-center justify-content-between py-1 px-3 rounded ${isActive ? 'bg-light fw-bold' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSourceClick(s.name)}
              >
                <span className="d-flex align-items-center gap-2 text-capitalize">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: s.color, display: 'inline-block' }} />
                  <small>{s.name}</small>
                </span>
                <span className="d-flex align-items-center gap-2">
                  {count > 0 && <Badge bg="secondary" pill style={{ fontSize: '0.6rem' }}>{count}</Badge>}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-danger source-delete"
                    onClick={(e) => { e.stopPropagation(); handleDelete(s.id, s.name); }}
                    title="Delete source"
                    style={{ fontSize: '0.7rem', opacity: 0.4 }}
                  >
                    <FaTrash />
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Modal show={showAdd} onHide={() => { setShowAdd(false); setError(null); }} centered>
        <Form onSubmit={handleAdd}>
          <Modal.Header closeButton>
            <Modal.Title>Add Source</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. freelance, hobby, gym"
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: newColor === c ? '3px solid #333' : '2px solid #ddd',
                      cursor: 'pointer',
                    }}
                    aria-label={c}
                  />
                ))}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Source'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
