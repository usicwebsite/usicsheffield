"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminTimeoutProvider from './AdminTimeoutProvider';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isRestrictedPage = pathname === '/restricted';

  return (
    <AdminTimeoutProvider>
      {!isAdminPage && !isRestrictedPage && <Navbar />}
      <main className="flex-grow overflow-x-hidden">
        {children}
      </main>
      {!isAdminPage && !isRestrictedPage && <Footer />}
    </AdminTimeoutProvider>
  );
} 