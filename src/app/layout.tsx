"use client";

import { Suspense } from "react";

import "./globals.css";

import { Poppins, Inter } from "next/font/google";
import Box from "@mui/material/Box";

import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";

import { AuthProvider } from "@/contexts/AuthContext";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { Toaster } from "react-hot-toast";
import NAVIGATION from "./_utils/navigation";
import theme from "../theme";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable}`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <AppRouterCacheProvider>
            <Suspense
              fallback={
                <Box
                  sx={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Helix size="45" speed="2.5" color="#007BFF" />
                </Box>
              }
            >
              <NextAppProvider navigation={NAVIGATION} theme={theme}>
                <Suspense
                  fallback={
                    <Box
                      sx={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Helix size="45" speed="2.5" color="#007BFF" />
                    </Box>
                  }
                >
                  {children}
                </Suspense>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#fff",
                      color: "#333",
                      border: "1px solid rgba(0, 123, 255, 0.2)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                    success: {
                      style: {
                        border: "1px solid rgba(40, 167, 69, 0.2)",
                      },
                    },
                    error: {
                      style: {
                        border: "1px solid rgba(244, 67, 54, 0.2)",
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
