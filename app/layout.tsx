import React from 'react';

export const metadata = {
  title: 'Traphouse Blog',
  description: 'Mein persönlicher Blog',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}