import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
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
