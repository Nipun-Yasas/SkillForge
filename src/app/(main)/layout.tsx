"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";

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
