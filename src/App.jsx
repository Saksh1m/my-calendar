import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SourceProvider } from './context/SourceContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
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
      <AuthProvider>
        <SourceProvider>
        <TaskProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<CalendarDashboard />} />
                      <Route path="/tasks" element={<TaskList />} />
                      <Route path="/analytics" element={<AnalyticsDashboard />} />
                      <Route path="/teams" element={<TeamsIntegration />} />
                      <Route path="/reminders" element={<ReminderSettings />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </TaskProvider>
        </SourceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
