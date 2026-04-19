import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import useBrowserReminders from '../../hooks/useBrowserReminders';

export default function Layout({ children }) {
  useBrowserReminders();

  return (
    <div className="d-flex flex-column min-vh-100">
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 bg-light p-4" style={{ overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
