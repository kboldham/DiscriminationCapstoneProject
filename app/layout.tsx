import "./globals.css";
import Header from "./components/Header";
import { Providers } from "./providers";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-slate-900 antialiased">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-72px)]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
