import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "EAN Label MVP",
  description: "Interner Label Composer fuer EAN-basierte Produktetiketten."
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="de">
    <body>{children}</body>
  </html>
);

export default RootLayout;
