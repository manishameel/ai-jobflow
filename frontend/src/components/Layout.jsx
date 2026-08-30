import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="ml-60 p-8">
        {children}
      </div>
    </div>
  );
}