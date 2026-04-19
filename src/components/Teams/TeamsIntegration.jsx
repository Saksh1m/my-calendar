import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { FaMicrosoft, FaVideo, FaTasks, FaSync, FaClock, FaUser, FaPlus, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { api } from '../../api/client';

const emptyMeeting = { title: '', organizer: '', time: '', duration: '30 min', recurring: false, channel: '' };
const emptyPlanner = { title: '', bucket: 'To Do', assignedTo: '', dueDate: '' };

export default function TeamsIntegration() {
  const [meetings, setMeetings] = useState([]);
  const [planner, setPlanner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showPlannerForm, setShowPlannerForm] = useState(false);
  const [meetingForm, setMeetingForm] = useState(emptyMeeting);
  const [plannerForm, setPlannerForm] = useState(emptyPlanner);

  const load = () => {
    setLoading(true);
    Promise.all([api.listMeetings(), api.listPlanner()])
      .then(([m, p]) => {
        setMeetings(m);
        setPlanner(p);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createMeeting({ ...meetingForm, time: new Date(meetingForm.time) });
      setMeetings((prev) => [...prev, created]);
      setMeetingForm(emptyMeeting);
      setShowMeetingForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMeeting = async (id) => {
    await api.deleteMeeting(id);
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCreatePlanner = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createPlanner({ ...plannerForm, dueDate: plannerForm.dueDate ? new Date(plannerForm.dueDate) : undefined });
      setPlanner((prev) => [...prev, created]);
      setPlannerForm(emptyPlanner);
      setShowPlannerForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePlanner = async (id) => {
    await api.deletePlanner(id);
    setPlanner((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <Container fluid className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Teams &amp; Planner</h4>
          <p className="text-muted mb-0">
            <FaMicrosoft className="me-2 text-primary" />
            Manage your meetings and planner tasks
          </p>
        </div>
        <Button variant="outline-primary" onClick={load}>
          <FaSync className="me-1" /> Refresh
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <span className="fw-bold"><FaVideo className="text-primary me-2" /> Meetings</span>
              <Button size="sm" variant="primary" onClick={() => setShowMeetingForm(true)}>
                <FaPlus className="me-1" /> Add
              </Button>
            </Card.Header>
            <ListGroup variant="flush">
              {meetings.length === 0 ? (
                <ListGroup.Item className="text-center text-muted py-4">No meetings yet</ListGroup.Item>
              ) : (
                meetings.map((m) => (
                  <ListGroup.Item key={m.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{m.title}</strong>
                      <br />
                      <small className="text-muted">
                        <FaClock className="me-1" />
                        {format(new Date(m.time), 'EEE, MMM dd — hh:mm a')}
                        <span className="ms-2">({m.duration})</span>
                      </small>
                      {(m.organizer || m.channel) && (
                        <>
                          <br />
                          <small className="text-muted">
                            <FaUser className="me-1" />
                            {m.organizer}{m.organizer && m.channel ? ' · ' : ''}{m.channel}
                          </small>
                        </>
                      )}
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      {m.recurring && <Badge bg="info">Recurring</Badge>}
                      <Button size="sm" variant="outline-danger" onClick={() => handleDeleteMeeting(m.id)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <span className="fw-bold"><FaTasks className="text-success me-2" /> Planner Tasks</span>
              <Button size="sm" variant="primary" onClick={() => setShowPlannerForm(true)}>
                <FaPlus className="me-1" /> Add
              </Button>
            </Card.Header>
            <ListGroup variant="flush">
              {planner.length === 0 ? (
                <ListGroup.Item className="text-center text-muted py-4">No planner tasks yet</ListGroup.Item>
              ) : (
                planner.map((p) => (
                  <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{p.title}</strong>
                      <br />
                      {p.dueDate && (
                        <small className="text-muted">Due: {format(new Date(p.dueDate), 'MMM dd, yyyy')}</small>
                      )}
                      {p.assignedTo && (
                        <small className="text-muted ms-2">· {p.assignedTo}</small>
                      )}
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <Badge bg={p.bucket === 'In Progress' ? 'warning' : p.bucket === 'Done' ? 'success' : 'secondary'}>
                        {p.bucket}
                      </Badge>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDeletePlanner(p.id)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Modal show={showMeetingForm} onHide={() => setShowMeetingForm(false)} centered>
        <Form onSubmit={handleCreateMeeting}>
          <Modal.Header closeButton><Modal.Title>Add Meeting</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control required value={meetingForm.title} onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Organizer</Form.Label>
              <Form.Control value={meetingForm.organizer} onChange={(e) => setMeetingForm({ ...meetingForm, organizer: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time *</Form.Label>
              <Form.Control type="datetime-local" required value={meetingForm.time} onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control value={meetingForm.duration} onChange={(e) => setMeetingForm({ ...meetingForm, duration: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Channel</Form.Label>
              <Form.Control value={meetingForm.channel} onChange={(e) => setMeetingForm({ ...meetingForm, channel: e.target.value })} />
            </Form.Group>
            <Form.Check
              type="switch"
              label="Recurring"
              checked={meetingForm.recurring}
              onChange={(e) => setMeetingForm({ ...meetingForm, recurring: e.target.checked })}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMeetingForm(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showPlannerForm} onHide={() => setShowPlannerForm(false)} centered>
        <Form onSubmit={handleCreatePlanner}>
          <Modal.Header closeButton><Modal.Title>Add Planner Task</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control required value={plannerForm.title} onChange={(e) => setPlannerForm({ ...plannerForm, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bucket</Form.Label>
              <Form.Select value={plannerForm.bucket} onChange={(e) => setPlannerForm({ ...plannerForm, bucket: e.target.value })}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assigned To</Form.Label>
              <Form.Control value={plannerForm.assignedTo} onChange={(e) => setPlannerForm({ ...plannerForm, assignedTo: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control type="date" value={plannerForm.dueDate} onChange={(e) => setPlannerForm({ ...plannerForm, dueDate: e.target.value })} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPlannerForm(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
