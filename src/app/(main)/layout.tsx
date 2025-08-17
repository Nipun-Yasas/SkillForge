"use client";

import * as React from "react";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useAuth } from "@/contexts/AuthContext";
import CustomToolbarActions from "../_components/main/CustomToolbarActions";
import CustomAppTitle from "../_components/main/CustomAppTitle";
import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";
import { Typography, Box } from "@mui/material";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Helix size="45" speed="2.5" color="#007BFF" />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout
      slots={{
        appTitle: CustomAppTitle,
        toolbarActions: CustomToolbarActions,
      }}
    >
      <PageContainer>{children}</PageContainer>
    </DashboardLayout>
  );
}
