"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";

import Box from "@mui/material/Box";

import { useAuth } from "@/contexts/AuthContext";
import CustomToolbarActions from "../_components/main/CustomToolbarActions";
import CustomAppTitle from "../_components/main/CustomAppTitle";


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

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: '#f8f9fa',
          padding: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Image 
          src="/loader.gif" 
          alt="Loading..." 
          width={0}
          height={0}
          style={{ 
            width: 'auto',
            height: 'auto',
            maxWidth: '80vw',
            maxHeight: '30vh',
            borderRadius: '10px',
          }}
          unoptimized
        />
        
      </Box>
    );
  }

  return (
    <DashboardLayout
      slots={{
        appTitle: CustomAppTitle,
        toolbarActions: CustomToolbarActions,
      }}
    >
      <PageContainer>
       
          {children}
      </PageContainer>
    </DashboardLayout>
  );
}
