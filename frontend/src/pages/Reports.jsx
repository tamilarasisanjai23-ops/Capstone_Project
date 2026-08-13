import React, { useState, useEffect } from 'react';
import { BarChart3, Download, RefreshCw, CheckCircle, Clock, AlertTriangle, Users, Package, Home } from 'lucide-react';
import { apiService } from '../services/apiService';
import StatCard from '../components/StatCard';

export const Reports = () => {
  const [metrics, setMetrics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);

  const loadData = async () => {
    const summary = await apiService.getReportsSummary();
    const tList = await apiService.getTasks();
    const rList = await apiService.getResources();
    setMetrics(summary);
    setTasks(tList);
    setResources(rList);
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('vdr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('vdr-storage-update', handleStorageUpdate);
  }, []);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ metrics, tasks, resources }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Disaster_Relief_Report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const taskCompletionRate = metrics?.totalTasks ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) : 0;
  const resourceFulfillmentRate = metrics?.totalResources ? Math.round((metrics.deliveredResources / metrics.totalResources) * 100) : 0;
  const shelterOccupancyRate = metrics?.totalCapacity ? Math.round((metrics.totalOccupancy / metrics.totalCapacity) * 100) : 0;

  return (
    <div className="reports-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>System Analytics & Executive Reports</h1>
          <p>Statistical visual breakdown of volunteer deployment, task completion, and resource fulfillment.</p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={loadData}>
            <RefreshCw size={16} /> Refresh Data
          </button>
          <button className="btn btn-primary" onClick={handleExportJSON}>
            <Download size={16} /> Export Report (JSON)
          </button>
        </div>
      </div>

      {/* Top Metric Overview Cards */}
      <div className="stat-grid">
        <StatCard
          icon={CheckCircle}
          value={`${taskCompletionRate}%`}
          label="Task Completion Rate"
          subtext={`${metrics?.completedTasks || 0} of ${metrics?.totalTasks || 0} Tasks Resolved`}
          color="emerald"
        />
        <StatCard
          icon={Package}
          value={`${resourceFulfillmentRate}%`}
          label="Resource Delivery Rate"
          subtext={`${metrics?.deliveredResources || 0} of ${metrics?.totalResources || 0} Supplies Delivered`}
          color="sky"
        />
        <StatCard
          icon={Home}
          value={`${shelterOccupancyRate}%`}
          label="Shelter Capacity Used"
          subtext={`${metrics?.totalOccupancy || 0} / ${metrics?.totalCapacity || 0} Occupancy`}
          color="purple"
        />
        <StatCard
          icon={Users}
          value={metrics?.activeVolunteers || 0}
          label="Active Duty Responders"
          subtext={`Out of ${metrics?.totalVolunteers || 0} Total Registered`}
          color="indigo"
        />
      </div>

      {/* Visual Analytics Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        
        {/* Task Lifecycle Breakdown */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="var(--accent-sky)" />
            Task Progress Lifecycle
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Completed Tasks</span>
                <strong style={{ color: 'var(--accent-emerald)' }}>{metrics?.completedTasks || 0} ({taskCompletionRate}%)</strong>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${taskCompletionRate}%`, background: 'var(--accent-emerald)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pending & Assigned Tasks</span>
                <strong style={{ color: 'var(--accent-amber)' }}>{metrics?.pendingTasks || 0} ({100 - taskCompletionRate}%)</strong>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${100 - taskCompletionRate}%`, background: 'var(--accent-amber)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Resource Fulfillment Split */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={18} color="var(--accent-emerald)" />
            Emergency Supply Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivered Supplies</span>
                <strong style={{ color: 'var(--accent-emerald)' }}>{metrics?.deliveredResources || 0}</strong>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${resourceFulfillmentRate}%`, background: 'var(--accent-emerald)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Dispatched / In-Transit</span>
                <strong style={{ color: 'var(--accent-sky)' }}>{(metrics?.totalResources || 0) - (metrics?.deliveredResources || 0)}</strong>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${100 - resourceFulfillmentRate}%`, background: 'var(--accent-sky)' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
