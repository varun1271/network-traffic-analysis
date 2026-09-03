import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { DeviceInventory } from './DeviceInventory';
import { ExecutiveDashboard } from './ExecutiveDashboard';

export const MonitoringDashboard = () => {
  const { activeTab } = useNetwork();

  if (activeTab === 'device-inventory') {
    return <DeviceInventory />;
  }

  return <ExecutiveDashboard />;
};
