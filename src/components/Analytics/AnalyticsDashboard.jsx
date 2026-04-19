import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { FaCheckCircle, FaTimesCircle, FaClipboardList, FaTrophy } from 'react-icons/fa';
import { useTasks } from '../../context/TaskContext';
import { api } from '../../api/client';
import { getUrgencyLevel } from '../../utils/helpers';

const SOURCE_COLORS = {
  college: '#4e73df',
  internship: '#1cc88a',
  personal: '#f6c23e',
  other: '#858796',
};

const PRIORITY_COLORS = {
  high: '#e74a3b',
  medium: '#f6c23e',
  low: '#1cc88a',
};

export default function AnalyticsDashboard() {
  const { tasks } = useTasks();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.analytics()
      .then((data) => setAnalytics(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tasks]);

  if (loading && !analytics) {
    return (
      <Container fluid className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <Alert variant="danger">Failed to load analytics: {error}</Alert>
      </Container>
    );
  }

  const completed = tasks.filter((t) => t.completed).length;
  const missed = tasks.filter((t) => getUrgencyLevel(t.deadline, t.completed) === 'overdue').length;
  const total = tasks.length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statCards = [
    { label: 'Total Tasks', value: total, icon: <FaClipboardList />, color: 'primary' },
    { label: 'Completed', value: completed, icon: <FaCheckCircle />, color: 'success' },
    { label: 'Missed', value: missed, icon: <FaTimesCircle />, color: 'danger' },
    { label: 'Completion Rate', value: `${rate}%`, icon: <FaTrophy />, color: 'warning' },
  ];

  const sourceData = (analytics?.sourceDistribution || []).filter((s) => s.value > 0);
  const priorityData = (analytics?.priorityDistribution || []).filter((p) => p.value > 0);
  const weeklyData = analytics?.weeklyProgress || [];

  return (
    <Container fluid>
      <h4 className="fw-bold mb-1">Productivity Analytics</h4>
      <p className="text-muted mb-3">Insights into your deadline management performance</p>

      <Row className="mb-4 g-3">
        {statCards.map(({ label, value, icon, color }) => (
          <Col xs={6} md={3} key={label}>
            <Card className={`border-start border-4 border-${color} shadow-sm h-100`}>
              <Card.Body className="d-flex align-items-center gap-3">
                <div className={`text-${color} fs-3`}>{icon}</div>
                <div>
                  <small className="text-muted">{label}</small>
                  <h4 className="fw-bold mb-0">{value}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3 mb-4">
        <Col md={8}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white fw-bold">Weekly Activity</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#1cc88a" name="Completed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="added" fill="#4e73df" name="Added" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white fw-bold">By Source</Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              {sourceData.length === 0 ? (
                <p className="text-muted mb-0">No data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sourceData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color || SOURCE_COLORS[entry.name] || '#858796'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col md={12}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white fw-bold">By Priority</Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              {priorityData.length === 0 ? (
                <p className="text-muted mb-0">No data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {priorityData.map((entry) => (
                        <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] || '#858796'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
