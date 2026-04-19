import { useState, useMemo } from 'react';
import { Container, Row, Col, Card, ButtonGroup, Button, Badge } from 'react-bootstrap';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addHours } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { useTasks } from '../../context/TaskContext';
import { useSources } from '../../context/SourceContext';
import { getUrgencyLevel, getUrgencyBadge } from '../../utils/helpers';
import TaskQuickView from './TaskQuickView';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function CalendarDashboard() {
  const { tasks } = useTasks();
  const { getSourceColor } = useSources();
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);

  const events = useMemo(
    () =>
      tasks.map((t) => ({
        ...t,
        start: new Date(t.deadline),
        end: addHours(new Date(t.deadline), 1),
      })),
    [tasks]
  );

  const eventStyleGetter = (event) => {
    const urgency = getUrgencyLevel(event.deadline, event.completed);
    const colorMap = {
      overdue: '#dc3545',
      critical: '#e74a3b',
      approaching: '#f6c23e',
      safe: '#1cc88a',
      completed: '#858796',
    };
    return {
      style: {
        backgroundColor: colorMap[urgency],
        border: 'none',
        borderRadius: '4px',
        color: urgency === 'approaching' ? '#333' : '#fff',
        fontSize: '0.8rem',
      },
    };
  };

  const handleSelectEvent = (event) => setSelectedTask(event);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const criticalCount = pendingTasks.filter((t) => ['critical', 'overdue'].includes(getUrgencyLevel(t.deadline, t.completed))).length;
  const approachingCount = pendingTasks.filter((t) => getUrgencyLevel(t.deadline, t.completed) === 'approaching').length;
  const safeCount = pendingTasks.filter((t) => getUrgencyLevel(t.deadline, t.completed) === 'safe').length;

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h4 className="fw-bold mb-1">Calendar Dashboard</h4>
          <p className="text-muted mb-0">Track all your deadlines in one place</p>
        </Col>
      </Row>

      <Row className="mb-3 g-3">
        {[
          { label: 'Pending', count: pendingTasks.length, bg: 'primary' },
          { label: 'Critical / Overdue', count: criticalCount, bg: 'danger' },
          { label: 'Approaching', count: approachingCount, bg: 'warning' },
          { label: 'Safe', count: safeCount, bg: 'success' },
        ].map(({ label, count, bg }) => (
          <Col xs={6} md={3} key={label}>
            <Card className={`border-start border-4 border-${bg} shadow-sm h-100`}>
              <Card.Body className="py-2">
                <small className="text-muted">{label}</small>
                <h4 className="fw-bold mb-0">{count}</h4>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <span className="fw-bold">Schedule</span>
          <ButtonGroup size="sm">
            {['month', 'week', 'day', 'agenda'].map((v) => (
              <Button
                key={v}
                variant={view === v ? 'primary' : 'outline-primary'}
                onClick={() => setView(v)}
                className="text-capitalize"
              >
                {v}
              </Button>
            ))}
          </ButtonGroup>
        </Card.Header>
        <Card.Body style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            popup
          />
        </Card.Body>
      </Card>

      {selectedTask && (
        <TaskQuickView task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

      <Row className="mt-3">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white fw-bold">Upcoming Deadlines</Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                {pendingTasks
                  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                  .slice(0, 5)
                  .map((t) => {
                    const urgency = getUrgencyLevel(t.deadline, t.completed);
                    const uBadge = getUrgencyBadge(urgency);
                    return (
                      <div key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{t.title}</strong>
                          <br />
                          <small className="text-muted">{format(new Date(t.deadline), 'MMM dd, yyyy hh:mm a')}</small>
                        </div>
                        <div className="d-flex gap-1">
                          <Badge style={{ backgroundColor: getSourceColor(t.source) }} className="text-capitalize">{t.source}</Badge>
                          <Badge bg={uBadge.bg}>{uBadge.label}</Badge>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
