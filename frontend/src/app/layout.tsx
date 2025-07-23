import type { Metadata } from "next";
import "./globals.css";

import theme from "../theme";
import { Suspense } from "react";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Toaster } from 'react-hot-toast';
import { Inter, Poppins } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';

import LinearProgress from "@mui/material/LinearProgress";
import NAVIGATION from "./_utils/navigation";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "SkillForge - Master Skills. Teach Others. Forge Your Future.",
  description: "Connect with peer mentors, exchange skills, and accelerate your learning journey through AI-powered matching and hands-on experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable}`}>
        <AuthProvider>
          <AppRouterCacheProvider>
            <Suspense fallback={<LinearProgress />}>
              <NextAppProvider theme={theme} navigation={NAVIGATION}>
                {children}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#fff',
                      color: '#333',
                      border: '1px solid rgba(0, 123, 255, 0.2)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                    success: {
                      style: {
                        border: '1px solid rgba(40, 167, 69, 0.2)',
                      },
                    },
                    error: {
                      style: {
                        border: '1px solid rgba(244, 67, 54, 0.2)',
                      },
                    },
                  }}
                />
              </NextAppProvider>
            </Suspense>
          </AppRouterCacheProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
