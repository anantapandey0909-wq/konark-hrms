import React from "react";

export interface AuthRootLayoutProps {
  children: React.ReactNode;
}

export default function AuthRootLayout({ children }: AuthRootLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 antialiased dark:bg-zinc-950 overflow-x-hidden">
      <section aria-label="Authentication" className="w-full">
        {children}
      </section>
    </div>
  );
}