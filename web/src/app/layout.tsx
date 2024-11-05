import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar/Sidebar";

import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Simpli-Fi",
  description: "The simplest finance app for all your group transactions.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <TRPCReactProvider>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSidebar />
              <div className="my-auto h-full w-fit">
                <SidebarTrigger />
              </div>
              <main className="flex w-full px-4 py-2">
                <div className="w-full">{children}</div>
              </main>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </TRPCReactProvider>
    </html>
  );
}