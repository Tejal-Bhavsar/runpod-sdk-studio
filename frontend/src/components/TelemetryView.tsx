import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Thermometer, HardDrive, ShieldCheck, RefreshCw } from 'lucide-react';
import { PodResponse, TelemetryResponse, TelemetryPoint } from '../types';

interface TelemetryViewProps {
  pods: PodResponse[];
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ pods }) => {
  const activePods = pods.filter(p => p.status === 'RUNNING');
  const [selectedPodId, setSelectedPodId] = useState<string>(activePods[0]?.id || '');
  const [telemetry, setTelemetry] = useState<TelemetryResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Set default selected pod if active pods list loads later
  useEffect(() => {
    if (activePods.length > 0 && !selectedPodId) {
      setSelectedPodId(activePods[0].id);
    }
  }, [pods]);

  useEffect(() => {
    if (selectedPodId) {
      fetchTelemetry();
      const interval = setInterval(fetchTelemetry, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedPodId]);

  const fetchTelemetry = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`/api/metrics/telemetry?pod_id=${selectedPodId}`);
      if (res.ok) {
        setTelemetry(await res.json());
      }
      setTimeout(() => setIsRefreshing(false), 500);
    } catch (e) {
      console.error(e);
      setIsRefreshing(false);
    }
  };

  if (activePods.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', margin: '0 1rem' }}>
        <Activity size={48} color="var(--accent-purple-light)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Active GPU Pods Running</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
          Real-time metrics, GPU core load, VRAM allocations, and thermal telemetry are only active when one or more GPU instances are running.
        </p>
      </div>
    );
  }

  const latest = telemetry?.history[telemetry.history.length - 1];

  // Helper to generate SVG polyline path for line charts
  const getSvgPathPoints = (points: TelemetryPoint[], metricKey: 'vram_used_gb' | 'compute_load_pct' | 'network_io_mbps', maxVal: number) => {
    const width = 450;
    const height = 150;
    const padding = 20;

    return points.map((p, idx) => {
      const x = padding + (idx * (width - padding * 2)) / (points.length - 1);
      const val = Number(p[metricKey]);
      const y = height - padding - (val / maxVal) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div style={{ padding: '0 1rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
      {/* Sidebar: Active Pod Picker */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Pod Telemetry</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select running instance to stream live metrics</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {activePods.map(pod => (
            <div
              key={pod.id}
              onClick={() => setSelectedPodId(pod.id)}
              style={{
                padding: '0.85rem 1rem', borderRadius: '10px', cursor: 'pointer',
                border: selectedPodId === pod.id ? '2px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                background: selectedPodId === pod.id ? 'rgba(123, 63, 228, 0.12)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s ease'
              }}
            >
              <strong style={{ fontSize: '0.85rem', display: 'block', color: '#fff' }}>{pod.name}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pod.gpu_type_id}</span>
            </div>
          ))}
        </div>

        {latest && (
          <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>HARDWARE SPEC SUMMARY</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span>Total VRAM:</span>
              <strong style={{ color: '#fff' }}>{latest.vram_total_gb} GB</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Max Capacity:</span>
              <span style={{ color: 'var(--accent-green)' }}>100% Guaranteed</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Board: Live Metric Dash */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Status Callout */}
        <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span>
            <strong style={{ fontSize: '0.9rem' }}>Streaming Live Telemetry (Update every 3s)</strong>
          </div>
          <button
            onClick={fetchTelemetry}
            disabled={isRefreshing}
            style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} /> Force Refresh
          </button>
        </div>

        {/* Numerical Indicators Grid */}
        {latest && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <HardDrive size={16} color="var(--accent-cyan)" style={{ marginBottom: '0.3rem' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>VRAM ALLOCATION</span>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>{latest.vram_used_gb} / {latest.vram_total_gb} GB</strong>
            </div>
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <Cpu size={16} color="var(--accent-purple-light)" style={{ marginBottom: '0.3rem' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>COMPUTE LOAD</span>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>{latest.compute_load_pct}%</strong>
            </div>
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <Thermometer size={16} color="var(--accent-pink)" style={{ marginBottom: '0.3rem' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>GPU TEMPERATURE</span>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>{latest.temperature_c}°C</strong>
            </div>
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <Activity size={16} color="var(--accent-green)" style={{ marginBottom: '0.3rem' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>NET I/O RATE</span>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>{latest.network_io_mbps} Mbps</strong>
            </div>
          </div>
        )}

        {/* Live SVG Graph Grid */}
        {telemetry && telemetry.history.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Chart 1: VRAM Allocation */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HardDrive size={15} color="var(--accent-cyan)" /> Live VRAM Allocation History
              </h4>
              <svg width="100%" height="150" viewBox="0 0 450 150" style={{ overflow: 'visible' }}>
                {/* Grid Lines */}
                <line x1="20" y1="20" x2="430" y2="20" stroke="rgba(255,255,255,0.06)" />
                <line x1="20" y1="75" x2="430" y2="75" stroke="rgba(255,255,255,0.06)" />
                <line x1="20" y1="130" x2="430" y2="130" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                {/* Glowing Sparkline */}
                <polyline
                  fill="none"
                  stroke="var(--accent-cyan)"
                  strokeWidth="3"
                  points={getSvgPathPoints(telemetry.history, 'vram_used_gb', latest?.vram_total_gb || 24)}
                />
              </svg>
            </div>

            {/* Chart 2: Compute Core Load */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Cpu size={15} color="var(--accent-purple-light)" /> GPU Compute Engine Core Load
              </h4>
              <svg width="100%" height="150" viewBox="0 0 450 150" style={{ overflow: 'visible' }}>
                {/* Grid Lines */}
                <line x1="20" y1="20" x2="430" y2="20" stroke="rgba(255,255,255,0.06)" />
                <line x1="20" y1="75" x2="430" y2="75" stroke="rgba(255,255,255,0.06)" />
                <line x1="20" y1="130" x2="430" y2="130" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                {/* Glowing Sparkline */}
                <polyline
                  fill="none"
                  stroke="var(--accent-purple)"
                  strokeWidth="3"
                  points={getSvgPathPoints(telemetry.history, 'compute_load_pct', 100)}
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
