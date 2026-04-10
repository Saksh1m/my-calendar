import { Nav, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaTasks, FaChartBar, FaMicrosoft, FaBell, FaFilter } from 'react-icons/fa';
import { useTasks } from '../../context/TaskContext';
import { getUrgencyLevel } from '../../utils/helpers';

export default function Sidebar() {
  const location = useLocation();
  const { tasks } = useTasks();

  const pending = tasks.filter((t) => !t.completed).length;
  const overdue = tasks.filter((t) => getUrgencyLevel(t.deadline, t.completed) === 'overdue').length;

  const links = [
    { path: '/', label: 'Calendar', icon: <FaCalendarAlt /> },
    { path: '/tasks', label: 'Tasks', icon: <FaTasks />, badge: pending },
    { path: '/analytics', label: 'Analytics', icon: <FaChartBar /> },
    { path: '/teams', label: 'Teams Sync', icon: <FaMicrosoft /> },
    { path: '/reminders', label: 'Reminders', icon: <FaBell />, badge: overdue > 0 ? overdue : null, badgeBg: 'danger' },
  ];

  const sources = [
    { label: 'College', color: '#4e73df' },
    { label: 'Internship', color: '#1cc88a' },
    { label: 'Personal', color: '#f6c23e' },
  ];

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
              active={location.pathname === path}
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

        <small className="text-muted text-uppercase fw-bold d-flex align-items-center gap-1">
          <FaFilter size={10} /> Sources
        </small>
        <div className="mt-2">
          {sources.map(({ label, color }) => (
            <div key={label} className="d-flex align-items-center gap-2 py-1 px-3">
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, display: 'inline-block' }} />
              <small>{label}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
