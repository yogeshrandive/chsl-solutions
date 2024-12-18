import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import { MainSidebar } from '@/components/main-sidebar';
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getUserDetails } from '@/lib/dal';
import { Toaster } from '@/components/ui/toaster';
// import { HeaderContent } from '@/components/header-content';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Society ManagementApp',
  description: 'A modern application with shadcn/ui',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getUserDetails();

  return (
    <html lang="en">
      <body className={`${inter.className} flex h-full`}>
        <Toaster />
        {userData != null ? (
          <div className="flex flex-col flex-1  w-full">
            <main>{children}</main>
          </div>
        ) : (
          <div className="flex flex-col min-h-screen w-full">{children}</div>
        )}
      </body>
    </html>
  );
}
