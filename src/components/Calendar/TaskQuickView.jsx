import { Modal, Badge, Button } from 'react-bootstrap';
import { FaClock, FaLink } from 'react-icons/fa';
import { format } from 'date-fns';
import { getUrgencyLevel, getUrgencyBadge, getPriorityBadge } from '../../utils/helpers';
import { useTasks } from '../../context/TaskContext';
import { useSources } from '../../context/SourceContext';

export default function TaskQuickView({ task, onClose }) {
  const { toggleComplete } = useTasks();
  const { getSourceColor } = useSources();
  const urgency = getUrgencyLevel(task.deadline, task.completed);
  const uBadge = getUrgencyBadge(urgency);
  const pBadge = getPriorityBadge(task.priority);
  const sourceColor = getSourceColor(task.source);

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">{task.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex gap-2 mb-3">
          <Badge style={{ backgroundColor: sourceColor }} className="text-capitalize">{task.source}</Badge>
          <Badge bg={pBadge.bg}>{pBadge.label} Priority</Badge>
          <Badge bg={uBadge.bg}>{uBadge.label}</Badge>
        </div>
        {task.description && <p className="text-muted">{task.description}</p>}
        <div className="d-flex align-items-center gap-2 mb-2">
          <FaClock className="text-muted" />
          <span>{format(new Date(task.deadline), 'EEEE, MMM dd yyyy — hh:mm a')}</span>
        </div>
        {task.link && (
          <div className="d-flex align-items-center gap-2 mb-2">
            <FaLink className="text-muted" />
            <a href={task.link} target="_blank" rel="noreferrer">{task.link}</a>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={task.completed ? 'outline-secondary' : 'success'}
          onClick={() => { toggleComplete(task.id); onClose(); }}
        >
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </Button>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
