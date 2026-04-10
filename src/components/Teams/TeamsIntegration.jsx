import { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Alert } from 'react-bootstrap';
import { FaMicrosoft, FaVideo, FaTasks, FaCalendarAlt, FaSync, FaCheck, FaClock, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';
import { teamsMeetings, teamsPlanner } from '../../data/mockData';

export default function TeamsIntegration() {
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleConnect = () => {
    setSyncing(true);
    setTimeout(() => {
      setConnected(true);
      setSyncing(false);
    }, 1500);
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200);
  };

  if (!connected) {
    return (
      <Container fluid>
        <h4 className="fw-bold mb-1">Microsoft Teams Integration</h4>
        <p className="text-muted mb-4">Sync your Teams meetings, planner tasks, and calendar events</p>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-sm text-center p-5">
              <Card.Body>
                <FaMicrosoft size={64} className="text-primary mb-4" />
                <h5 className="fw-bold mb-3">Connect Microsoft Teams</h5>
                <p className="text-muted mb-4">
                  Sign in with your Microsoft account to automatically import meetings, planner tasks, and calendar events from your Teams workspace.
                </p>
                <Button variant="primary" size="lg" onClick={handleConnect} disabled={syncing}>
                  {syncing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FaMicrosoft className="me-2" />
                      Sign in with Microsoft
                    </>
                  )}
                </Button>
                <div className="mt-4">
                  <small className="text-muted">Uses Microsoft Graph API for secure access</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Microsoft Teams Integration</h4>
          <p className="text-muted mb-0">
            <Badge bg="success" className="me-2">Connected</Badge>
            Syncing from your organization workspace
          </p>
        </div>
        <Button variant="outline-primary" onClick={handleSync} disabled={syncing}>
          {syncing ? (
            <><span className="spinner-border spinner-border-sm me-1" /> Syncing...</>
          ) : (
            <><FaSync className="me-1" /> Sync Now</>
          )}
        </Button>
      </div>

      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white d-flex align-items-center gap-2 fw-bold">
              <FaVideo className="text-primary" /> Upcoming Meetings
            </Card.Header>
            <ListGroup variant="flush">
              {teamsMeetings.map((m) => (
                <ListGroup.Item key={m.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{m.title}</strong>
                    <br />
                    <small className="text-muted">
                      <FaClock className="me-1" />
                      {format(new Date(m.time), 'EEE, MMM dd — hh:mm a')}
                      <span className="ms-2">({m.duration})</span>
                    </small>
                    <br />
                    <small className="text-muted">
                      <FaUser className="me-1" />
                      {m.organizer} &middot; {m.channel}
                    </small>
                  </div>
                  <div>
                    {m.recurring && <Badge bg="info">Recurring</Badge>}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white d-flex align-items-center gap-2 fw-bold">
              <FaTasks className="text-success" /> Planner Tasks
            </Card.Header>
            <ListGroup variant="flush">
              {teamsPlanner.map((p) => (
                <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{p.title}</strong>
                    <br />
                    <small className="text-muted">
                      Due: {format(new Date(p.dueDate), 'MMM dd, yyyy')}
                    </small>
                  </div>
                  <Badge bg={p.bucket === 'In Progress' ? 'warning' : 'secondary'}>{p.bucket}</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Alert variant="info" className="d-flex align-items-center gap-2">
            <FaCalendarAlt />
            <span>
              Teams events are automatically synced to your calendar dashboard. Last synced: just now.
            </span>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}
