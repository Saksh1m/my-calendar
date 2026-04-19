import { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import { useTasks } from '../../context/TaskContext';
import { useSources } from '../../context/SourceContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

export default function TaskList() {
  const { tasks, addTask, editTask, deleteTask, toggleComplete } = useTasks();
  const { sources } = useSources();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSource = searchParams.get('source') || 'all';

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState(urlSource);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');

  // sync filterSource with URL when sidebar navigation changes ?source=
  useEffect(() => {
    setFilterSource(urlSource);
  }, [urlSource]);

  const updateSourceFilter = (value) => {
    setFilterSource(value);
    if (value === 'all') {
      searchParams.delete('source');
    } else {
      searchParams.set('source', value);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const filtered = useMemo(() => {
    let result = [...tasks];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
    }
    if (filterSource !== 'all') result = result.filter((t) => t.source === filterSource);
    if (filterPriority !== 'all') result = result.filter((t) => t.priority === filterPriority);
    if (filterStatus === 'completed') result = result.filter((t) => t.completed);
    else if (filterStatus === 'pending') result = result.filter((t) => !t.completed);

    result.sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [tasks, search, filterSource, filterPriority, filterStatus, sortBy]);

  const handleSubmit = (formData) => {
    if (editingTask) {
      editTask({ ...editingTask, ...formData });
    } else {
      addTask(formData);
    }
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Task Manager</h4>
          <p className="text-muted mb-0">
            {filtered.length} task{filtered.length !== 1 ? 's' : ''} shown
            {filterSource !== 'all' && (
              <>
                {' '}in <span className="fw-bold text-capitalize">{filterSource}</span>
                <Button
                  size="sm"
                  variant="link"
                  className="p-0 ms-2 text-muted"
                  onClick={() => updateSourceFilter('all')}
                  title="Clear source filter"
                >
                  <FaTimes />
                </Button>
              </>
            )}
          </p>
        </div>
        <Button variant="primary" onClick={() => { setEditingTask(null); setShowForm(true); }}>
          <FaPlus className="me-1" /> Add Task
        </Button>
      </div>

      <Row className="mb-3 g-2">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Form.Select value={filterSource} onChange={(e) => updateSourceFilter(e.target.value)}>
            <option value="all">All Sources</option>
            {sources.map((s) => (
              <option key={s.id} value={s.name} className="text-capitalize">{s.name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="deadline">Sort: Deadline</option>
            <option value="priority">Sort: Priority</option>
            <option value="title">Sort: Title</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {filtered.length === 0 ? (
          <Col className="text-center py-5 text-muted">
            <p className="fs-5">No tasks found.</p>
            <Button variant="outline-primary" onClick={() => { setEditingTask(null); setShowForm(true); }}>
              <FaPlus className="me-1" /> Create your first task
            </Button>
          </Col>
        ) : (
          filtered.map((task) => (
            <Col md={6} xl={4} key={task.id}>
              <TaskCard task={task} onToggle={toggleComplete} onEdit={handleEdit} onDelete={deleteTask} />
            </Col>
          ))
        )}
      </Row>

      <TaskForm
        show={showForm}
        onHide={() => { setShowForm(false); setEditingTask(null); }}
        onSubmit={handleSubmit}
        editingTask={editingTask}
      />
    </Container>
  );
}
