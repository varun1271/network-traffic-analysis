import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import { Header } from './components/layout/Header';
import { ModuleBar } from './components/layout/ModuleBar';
import { Sidebar } from './components/layout/Sidebar';
import { ModulesOverview } from './components/modules/ModulesOverview';
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
      {/* Top Header Bar */}
      <Header />

      {/* Primary Module Switcher Navigation Bar */}
      <ModuleBar />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation grouped by Modules */}
        <Sidebar />

        {/* Dynamic View Panel with Animated Transitions */}
        <main className="flex-1 overflow-y-auto bg-[#0b0f19] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.995 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-full"
            >
              {activeTab === 'overview' && <ModulesOverview />}
              {activeTab === 'device-inventory' && <MonitoringDashboard defaultSection="devices" />}
              {activeTab === 'dashboard' && <MonitoringDashboard defaultSection="overview" />}
              {activeTab === 'topology' && <TopologyMap />}
              {activeTab === 'performance' && <PerformanceAnalytics />}
              {activeTab === 'alerts' && <AlertManager />}
              {activeTab === 'reports' && <ReportManagement />}
              {activeTab === 'settings' && <ThresholdSettings />}
            </motion.div>
          </AnimatePresence>
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
