import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { format } from 'date-fns';

const defaultForm = {
  title: '',
  description: '',
  source: 'college',
  deadline: '',
  priority: 'medium',
  link: '',
};

export default function TaskForm({ show, onHide, onSubmit, editingTask }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (editingTask) {
      setForm({
        ...editingTask,
        deadline: format(new Date(editingTask.deadline), "yyyy-MM-dd'T'HH:mm"),
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingTask, show]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, deadline: new Date(form.deadline) });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editingTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control name="title" value={form.title} onChange={handleChange} required placeholder="Task title" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={2} name="description" value={form.description} onChange={handleChange} placeholder="Brief description..." />
          </Form.Group>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Source *</Form.Label>
                <Form.Select name="source" value={form.source} onChange={handleChange}>
                  <option value="college">College</option>
                  <option value="internship">Internship</option>
                  <option value="personal">Personal</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Priority *</Form.Label>
                <Form.Select name="priority" value={form.priority} onChange={handleChange}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Deadline *</Form.Label>
                <Form.Control type="datetime-local" name="deadline" value={form.deadline} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Link (optional)</Form.Label>
            <Form.Control type="url" name="link" value={form.link} onChange={handleChange} placeholder="https://..." />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">{editingTask ? 'Save Changes' : 'Add Task'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
