import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import { FaBell, FaEnvelope, FaDesktop, FaClock, FaTrash, FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import { useTasks } from '../../context/TaskContext';
import { getUrgencyLevel, getUrgencyBadge } from '../../utils/helpers';

export default function ReminderSettings() {
  const { tasks } = useTasks();
  const [browserEnabled, setBrowserEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('60');
  const [notificationGranted, setNotificationGranted] = useState(false);

  const upcomingTasks = tasks
    .filter((t) => !t.completed && ['critical', 'approaching'].includes(getUrgencyLevel(t.deadline, t.completed)))
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const overdueTasks = tasks.filter((t) => getUrgencyLevel(t.deadline, t.completed) === 'overdue');

  const requestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        setNotificationGranted(perm === 'granted');
        if (perm === 'granted') {
          new Notification('DeadlineHub', { body: 'Browser notifications are now enabled!' });
        }
      });
    }
  };

  return (
    <Container fluid>
      <h4 className="fw-bold mb-1">Reminders & Notifications</h4>
      <p className="text-muted mb-3">Configure how you want to be reminded about upcoming deadlines</p>

      {overdueTasks.length > 0 && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <FaBell />
          <span>
            You have <strong>{overdueTasks.length}</strong> overdue task{overdueTasks.length > 1 ? 's' : ''}!
            Check your task list to update them.
          </span>
        </Alert>
      )}

      <Row className="g-3">
        <Col md={5}>
          <Card className="shadow-sm mb-3">
            <Card.Header className="bg-white fw-bold">Notification Settings</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <FaDesktop className="text-primary" />
                    <div>
                      <strong>Browser Notifications</strong>
                      <br />
                      <small className="text-muted">Get desktop push notifications</small>
                    </div>
                  </div>
                  <Form.Check
                    type="switch"
                    checked={browserEnabled}
                    onChange={(e) => setBrowserEnabled(e.target.checked)}
                  />
                </Form.Group>

                {browserEnabled && !notificationGranted && (
                  <Button variant="outline-primary" size="sm" className="mb-3" onClick={requestPermission}>
                    Enable Browser Permissions
                  </Button>
                )}

                <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <FaEnvelope className="text-success" />
                    <div>
                      <strong>Email Alerts</strong>
                      <br />
                      <small className="text-muted">Receive reminders via email</small>
                    </div>
                  </div>
                  <Form.Check
                    type="switch"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                  />
                </Form.Group>

                {emailEnabled && (
                  <Form.Group className="mb-3">
                    <Form.Label className="small">Email Address</Form.Label>
                    <Form.Control type="email" placeholder="your@email.com" size="sm" />
                  </Form.Group>
                )}

                <hr />

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center gap-2">
                    <FaClock /> Default Reminder Time
                  </Form.Label>
                  <Form.Select value={reminderTime} onChange={(e) => setReminderTime(e.target.value)}>
                    <option value="15">15 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                    <option value="180">3 hours before</option>
                    <option value="720">12 hours before</option>
                    <option value="1440">1 day before</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" className="w-100">Save Settings</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <span className="fw-bold">Upcoming Reminders</span>
              <Badge bg="primary" pill>{upcomingTasks.length}</Badge>
            </Card.Header>
            <ListGroup variant="flush">
              {upcomingTasks.length === 0 ? (
                <ListGroup.Item className="text-center text-muted py-4">
                  No upcoming reminders. You're all caught up!
                </ListGroup.Item>
              ) : (
                upcomingTasks.map((t) => {
                  const urgency = getUrgencyLevel(t.deadline, t.completed);
                  const badge = getUrgencyBadge(urgency);
                  return (
                    <ListGroup.Item key={t.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{t.title}</strong>
                        <br />
                        <small className="text-muted">
                          <FaClock className="me-1" />
                          {format(new Date(t.deadline), 'EEE, MMM dd — hh:mm a')}
                        </small>
                      </div>
                      <Badge bg={badge.bg}>{badge.label}</Badge>
                    </ListGroup.Item>
                  );
                })
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
