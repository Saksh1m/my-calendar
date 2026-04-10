import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Layout from './components/Layout/Layout';
import CalendarDashboard from './components/Calendar/CalendarDashboard';
import TaskList from './components/Tasks/TaskList';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import TeamsIntegration from './components/Teams/TeamsIntegration';
import ReminderSettings from './components/Reminders/ReminderSettings';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

export default function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<CalendarDashboard />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/teams" element={<TeamsIntegration />} />
            <Route path="/reminders" element={<ReminderSettings />} />
          </Routes>
        </Layout>
      </TaskProvider>
    </BrowserRouter>
  );
}
