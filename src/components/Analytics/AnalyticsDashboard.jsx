import { Container, Row, Col, Card } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from 'recharts';
import { FaCheckCircle, FaTimesCircle, FaClipboardList, FaTrophy } from 'react-icons/fa';
import { useTasks } from '../../context/TaskContext';
import { analyticsData } from '../../data/mockData';
import { getUrgencyLevel } from '../../utils/helpers';

export default function AnalyticsDashboard() {
  const { tasks } = useTasks();

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
                <BarChart data={analyticsData.weeklyProgress}>
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
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.sourceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.sourceDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white fw-bold">Monthly Trend</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="completed" stroke="#1cc88a" fill="#1cc88a" fillOpacity={0.2} name="Completed" />
                  <Area type="monotone" dataKey="missed" stroke="#e74a3b" fill="#e74a3b" fillOpacity={0.2} name="Missed" />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white fw-bold">By Priority</Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.priorityDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.priorityDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
