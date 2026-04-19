import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Card className="shadow-sm" style={{ width: '100%', maxWidth: 420 }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <FaCalendarAlt size={40} className="text-primary mb-2" />
            <h4 className="fw-bold mb-0">DeadlineHub</h4>
            <small className="text-muted">Create your account</small>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Form.Text className="text-muted">At least 6 characters</Form.Text>
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <small className="text-muted">
              Already have an account? <Link to="/login">Sign in</Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
