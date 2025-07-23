import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AppSidebar from './AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 pt-16">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;