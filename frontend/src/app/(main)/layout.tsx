"use client";

import * as React from 'react';
import { ReactNode } from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import CustomToolbarActions from '../_components/main/CustomToolbarActions';
import CustomAppTitle from '../_components/main/CustomAppTitle';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
