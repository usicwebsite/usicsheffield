import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile - USIC Sheffield',
  description: 'Manage your USIC account settings, profile information, and password.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
