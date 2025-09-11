import { Outlet } from 'react-router-dom';
import Footer from './shared/Footer';
import Header from './shared/Header';

const Layout = () => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 pt-24">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;