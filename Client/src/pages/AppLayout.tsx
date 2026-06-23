import { Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar.js';
import Header from '../components/ui/Header.js';

const AppLayout = () => {
  return (
    <>
      <main className="flex min-h-screen  "  >
        <Sidebar />
        <section className="flex-1 flex flex-col">
          <Header />
          <Outlet />
        </section>
      </main>
    </>
  );
};

export default AppLayout;
