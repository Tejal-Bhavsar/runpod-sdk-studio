import React from 'react';
import { Cpu, HardDrive, DollarSign, Activity } from 'lucide-react';
import { ClusterMetrics } from '../types';

interface ClusterStatsProps {
  metrics: ClusterMetrics | null;
}

export const ClusterStats: React.FC<ClusterStatsProps> = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', margin: '0 1rem 1.5rem 1rem' }}>
      {/* Active Pods */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>ACTIVE GPU PODS</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.2rem', color: '#f8fafc' }}>
            {metrics.active_pods} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Pods</span>
          </h3>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(124, 58, 237, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Cpu size={20} color="var(--accent-purple)" />
        </div>
      </div>

      {/* VRAM Memory */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>VRAM ALLOCATED</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.2rem', color: '#f8fafc' }}>
            {metrics.vram_used_gb} / {metrics.total_vram_gb} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>GB</span>
          </h3>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HardDrive size={20} color="var(--accent-cyan)" />
        </div>
      </div>

      {/* GPU Utilization */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>GPU UTILIZATION</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.2rem', color: '#f8fafc' }}>
            {metrics.gpu_utilization_pct}%
          </h3>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={20} color="var(--accent-green)" />
        </div>
      </div>

      {/* Hourly Spend */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>RUNNING COST</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.2rem', color: '#f8fafc' }}>
            ${metrics.hourly_spend_usd}/hr <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(${metrics.daily_forecast_usd}/day)</span>
          </h3>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DollarSign size={20} color="var(--accent-pink)" />
        </div>
      </div>
    </div>
  );
};
