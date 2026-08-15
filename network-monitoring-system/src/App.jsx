import React from 'react';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MonitoringDashboard } from './components/dashboard/MonitoringDashboard';
import { TopologyMap } from './components/topology/TopologyMap';
import { PerformanceAnalytics } from './components/performance/PerformanceAnalytics';
import { AlertManager } from './components/alerts/AlertManager';
import { ReportManagement } from './components/reports/ReportManagement';
import { ThresholdSettings } from './components/settings/ThresholdSettings';
import { DeviceDetailsDrawer } from './components/common/DeviceDetailsDrawer';

const AppContent = () => {
  const { activeTab } = useNetwork();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased selection:bg-blue-500 selection:text-white">
      {/* Header Bar */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Dynamic View Panel */}
        <main className="flex-1 overflow-y-auto bg-[#0b0f19] relative">
          {activeTab === 'dashboard' && <MonitoringDashboard />}
          {activeTab === 'topology' && <TopologyMap />}
          {activeTab === 'performance' && <PerformanceAnalytics />}
          {activeTab === 'alerts' && <AlertManager />}
          {activeTab === 'reports' && <ReportManagement />}
          {activeTab === 'settings' && <ThresholdSettings />}
        </main>
      </div>

      {/* Global Device Drawer Inspection Modal */}
      <DeviceDetailsDrawer />
    </div>
  );
};

export default function App() {
  return (
    <NetworkProvider>
      <AppContent />
    </NetworkProvider>
  );
}
