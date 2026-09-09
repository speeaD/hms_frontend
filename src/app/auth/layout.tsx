"use client"

import { Analytics } from "@vercel/analytics/next";

// export const metadata = {
//   title: "Hotelier Admin",
//   description: "Hotelier Admin Dashboard",
// };
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}