import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminShellLayout } from '../layouts/AdminShellLayout';
import { CitizenLayout } from '../layouts/CitizenLayout';

// Demo & Design System Showcase
import { DemoOverviewPage } from '../pages/demo/DemoOverviewPage';
import { DesignSystemShowcase } from '../design-system/showcase/DesignSystemShowcase';

// Citizen Onboarding Pages
import { CitizenOtpLoginPage } from '../pages/citizen/CitizenOtpLoginPage';
import { CitizenProfileSetupPage } from '../pages/citizen/CitizenProfileSetupPage';
import { CitizenConsentPage } from '../pages/citizen/CitizenConsentPage';

// Citizen Main App Pages
import { CitizenHomePage } from '../pages/citizen/CitizenHomePage';
import { ReportProblemPage } from '../pages/citizen/ReportProblemPage';
import { VoiceReportingPage } from '../pages/citizen/VoiceReportingPage';
import { CitizenCasesPage } from '../pages/citizen/CitizenCasesPage';
import { TrackCasesPage } from '../pages/citizen/TrackCasesPage';
import { CaseDetailPage } from '../pages/citizen/CaseDetailPage';
import { EvidenceVaultPage } from '../pages/citizen/EvidenceVaultPage';
import { SchemesDiscoveryPage } from '../pages/citizen/SchemesDiscoveryPage';
import { CitizenProfilePage } from '../pages/citizen/CitizenProfilePage';
import { CitizenNotificationsPage } from '../pages/citizen/CitizenNotificationsPage';

// Officer & Case Manager pages
import { CaseManagerDashboardPage } from '../pages/case-manager/CaseManagerDashboardPage';
import { CaseManagerCasesPage } from '../pages/case-manager/CaseManagerCasesPage';
import { CaseManagerCaseDetailPage } from '../pages/case-manager/CaseManagerCaseDetailPage';
import { CaseManagerEvidencePage } from '../pages/case-manager/CaseManagerEvidencePage';
import { CaseManagerProfilePage } from '../pages/case-manager/CaseManagerProfilePage';
import { CaseManagerDepartmentsPage } from '../pages/case-manager/CaseManagerDepartmentsPage';
import { VerificationDeskPage } from '../pages/case-manager/VerificationDeskPage';
import { CaseQueuePage } from '../pages/case-manager/CaseQueuePage';
import { FieldInspectionPage } from '../pages/case-manager/FieldInspectionPage';

// Admin pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminRolesPage } from '../pages/admin/AdminRolesPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminDepartmentsPage } from '../pages/admin/AdminDepartmentsPage';
import { AdminServicesPage } from '../pages/admin/AdminServicesPage';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage';
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { SlaMonitorPage } from '../pages/admin/SlaMonitorPage';

export const router = createBrowserRouter([
  // 1. Standalone Onboarding Workflows (Clean Full-Screen Views)
  {
    path: '/citizen/login',
    element: <CitizenOtpLoginPage />,
  },
  {
    path: '/citizen/profile',
    element: <CitizenProfileSetupPage />,
  },
  {
    path: '/citizen/consent',
    element: <CitizenConsentPage />,
  },

  // 2. Demo Hub & Design System (Unified Clean Light Shell)
  {
    path: '/',
    element: <AdminShellLayout />,
    children: [
      {
        index: true,
        element: <DemoOverviewPage />,
      },
      {
        path: 'demo',
        element: <DemoOverviewPage />,
      },
      {
        path: 'design-system',
        element: <DesignSystemShowcase />,
      },
    ],
  },

  // 3. Citizen Application (Unified Clean Light Shell)
  {
    path: '/citizen',
    element: <AdminShellLayout />,
    children: [
      {
        index: true,
        element: <CitizenHomePage />,
      },
      {
        path: 'home',
        element: <CitizenHomePage />,
      },
      {
        path: 'report',
        element: <ReportProblemPage />,
      },
      {
        path: 'report/voice',
        element: <VoiceReportingPage />,
      },
      {
        path: 'new',
        element: <ReportProblemPage />,
      },
      {
        path: 'cases',
        element: <CitizenCasesPage />,
      },
      {
        path: 'cases/:caseId',
        element: <CaseDetailPage />,
      },
      {
        path: 'cases/:id',
        element: <CaseDetailPage />,
      },
      {
        path: 'track',
        element: <CitizenCasesPage />,
      },
      {
        path: 'vault',
        element: <EvidenceVaultPage />,
      },
      {
        path: 'schemes',
        element: <SchemesDiscoveryPage />,
      },
      {
        path: 'my-profile',
        element: <CitizenProfilePage />,
      },
      {
        path: 'notifications',
        element: <CitizenNotificationsPage />,
      },
    ],
  },

  // 4. Case Manager Application (Unified Clean Light Shell)
  {
    path: '/case-manager',
    element: <AdminShellLayout />,
    children: [
      {
        index: true,
        element: <CaseManagerDashboardPage />,
      },
      {
        path: 'dashboard',
        element: <CaseManagerDashboardPage />,
      },
      {
        path: 'cases',
        element: <CaseManagerCasesPage />,
      },
      {
        path: 'cases/:caseId',
        element: <CaseManagerCaseDetailPage />,
      },
      {
        path: 'cases/:id',
        element: <CaseManagerCaseDetailPage />,
      },
      {
        path: 'assignments',
        element: <VerificationDeskPage />,
      },
      {
        path: 'departments',
        element: <CaseManagerDepartmentsPage />,
      },
      {
        path: 'evidence',
        element: <CaseManagerEvidencePage />,
      },
      {
        path: 'notifications',
        element: <CitizenNotificationsPage />,
      },
      {
        path: 'reports',
        element: <SlaMonitorPage />,
      },
      {
        path: 'queue',
        element: <CaseQueuePage />,
      },
      {
        path: 'field-inspection',
        element: <FieldInspectionPage />,
      },
      {
        path: 'profile',
        element: <CaseManagerProfilePage />,
      },
    ],
  },

  // 5. Officer Legacy Routes Redirect
  {
    path: '/officer',
    element: <AdminShellLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/case-manager/dashboard" replace />,
      },
      {
        path: 'queue',
        element: <CaseQueuePage />,
      },
      {
        path: 'cases/:id',
        element: <CaseManagerCaseDetailPage />,
      },
      {
        path: 'verification',
        element: <VerificationDeskPage />,
      },
      {
        path: 'field-inspections',
        element: <FieldInspectionPage />,
      },
    ],
  },

  // 6. Administrator Application (Unified Clean Light Shell)
  {
    path: '/admin',
    element: <AdminShellLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'cases',
        element: <CaseManagerCasesPage />,
      },
      {
        path: 'cases/:id',
        element: <CaseManagerCaseDetailPage />,
      },
      {
        path: 'cases/:caseId',
        element: <CaseManagerCaseDetailPage />,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
      {
        path: 'roles',
        element: <AdminRolesPage />,
      },
      {
        path: 'categories',
        element: <AdminCategoriesPage />,
      },
      {
        path: 'departments',
        element: <AdminDepartmentsPage />,
      },
      {
        path: 'services',
        element: <AdminServicesPage />,
      },
      {
        path: 'reports',
        element: <SlaMonitorPage />,
      },
      {
        path: 'sla-monitor',
        element: <SlaMonitorPage />,
      },
      {
        path: 'analytics',
        element: <AdminAnalyticsPage />,
      },
      {
        path: 'audit',
        element: <AdminAuditLogsPage />,
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />,
      },
    ],
  },

  // 7. Global Fallback
  {
    path: '*',
    element: <Navigate to="/demo" replace />,
  },
]);
