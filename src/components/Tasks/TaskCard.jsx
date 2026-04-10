import { Card, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { FaCheck, FaEdit, FaTrash, FaClock, FaExternalLinkAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { getUrgencyLevel, getUrgencyBadge, getSourceBadge, getPriorityBadge } from '../../utils/helpers';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const urgency = getUrgencyLevel(task.deadline, task.completed);
  const uBadge = getUrgencyBadge(urgency);
  const sBadge = getSourceBadge(task.source);
  const pBadge = getPriorityBadge(task.priority);

  return (
    <Card className={`shadow-sm mb-3 ${task.completed ? 'opacity-75' : ''}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex gap-2 flex-wrap">
            <Badge bg={sBadge.bg}>{sBadge.label}</Badge>
            <Badge bg={pBadge.bg}>{pBadge.label}</Badge>
            <Badge bg={uBadge.bg}>{uBadge.label}</Badge>
          </div>
          <ButtonGroup size="sm">
            <Button variant="outline-success" onClick={() => onToggle(task.id)} title={task.completed ? 'Undo' : 'Complete'}>
              <FaCheck />
            </Button>
            <Button variant="outline-primary" onClick={() => onEdit(task)} title="Edit">
              <FaEdit />
            </Button>
            <Button variant="outline-danger" onClick={() => onDelete(task.id)} title="Delete">
              <FaTrash />
            </Button>
          </ButtonGroup>
        </div>
        <h6 className={`fw-bold ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
          {task.title}
        </h6>
        {task.description && <p className="text-muted small mb-2">{task.description}</p>}
        <div className="d-flex align-items-center gap-2 text-muted small">
          <FaClock />
          <span>{format(new Date(task.deadline), 'MMM dd, yyyy — hh:mm a')}</span>
          {task.link && (
            <a href={task.link} target="_blank" rel="noreferrer" className="ms-auto">
              <FaExternalLinkAlt />
            </a>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
