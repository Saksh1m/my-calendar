import { Navbar, Nav, Container, Badge, Dropdown, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBell, FaCalendarAlt, FaTasks, FaChartBar, FaMicrosoft, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { getUrgencyLevel } from '../../utils/helpers';

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const urgentCount = tasks.filter(
    (t) => !t.completed && ['critical', 'overdue'].includes(getUrgencyLevel(t.deadline, t.completed))
  ).length;

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: <FaCalendarAlt className="me-1" /> },
    { path: '/tasks', label: 'Tasks', icon: <FaTasks className="me-1" /> },
    { path: '/analytics', label: 'Analytics', icon: <FaChartBar className="me-1" /> },
    { path: '/teams', label: 'Teams', icon: <FaMicrosoft className="me-1" /> },
  ];

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <FaCalendarAlt className="me-2 text-info" />
          DeadlineHub
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {navLinks.map(({ path, label, icon }) => (
              <Nav.Link
                key={path}
                as={Link}
                to={path}
                active={location.pathname === path}
                className="d-flex align-items-center"
              >
                {icon}
                {label}
              </Nav.Link>
            ))}
          </Nav>
          <Nav className="align-items-center gap-2">
            {user && (
              <span className="text-light small d-flex align-items-center">
                <FaUserCircle className="me-1" /> {user.name}
              </span>
            )}
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-light" size="sm" className="position-relative">
                <FaBell />
                {urgentCount > 0 && (
                  <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.65rem' }}>
                    {urgentCount}
                  </Badge>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow" style={{ minWidth: '280px' }}>
                <Dropdown.Header>Urgent Deadlines</Dropdown.Header>
                {tasks
                  .filter((t) => !t.completed && ['critical', 'overdue'].includes(getUrgencyLevel(t.deadline, t.completed)))
                  .slice(0, 5)
                  .map((t) => (
                    <Dropdown.Item key={t.id} as={Link} to="/tasks" className="text-wrap">
                      <small className="text-danger fw-bold">{t.title}</small>
                    </Dropdown.Item>
                  ))}
                {urgentCount === 0 && (
                  <Dropdown.Item disabled>No urgent deadlines</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="outline-light" size="sm" onClick={handleLogout} title="Logout">
              <FaSignOutAlt />
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
