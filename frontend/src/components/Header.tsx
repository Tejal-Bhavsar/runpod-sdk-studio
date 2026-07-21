import React from 'react';
import { Cpu, Terminal, Zap, ShieldCheck, Github } from 'lucide-react';
import { ClusterMetrics } from '../types';

interface HeaderProps {
  metrics: ClusterMetrics | null;
  activeTab: 'pods' | 'serverless' | 'sdk';
  setActiveTab: (tab: 'pods' | 'serverless' | 'sdk') => void;
}

export const Header: React.FC<HeaderProps> = ({ metrics, activeTab, setActiveTab }) => {
  return (
    <header className="glass-panel" style={{ margin: '1rem', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)'
        }}>
          <Zap size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            RunPod SDK Studio <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#a855f7', background: 'rgba(168,85,247,0.15)', padding: '2px 8px', borderRadius: '12px' }}>Full-Stack Showcase</span>
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            GPU Infrastructure & Serverless Developer Workbench
          </p>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setActiveTab('pods')}
          style={{
            padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
            background: activeTab === 'pods' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'pods' ? '#fff' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          <Cpu size={16} /> GPU Pods
        </button>

        <button
          onClick={() => setActiveTab('serverless')}
          style={{
            padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
            background: activeTab === 'serverless' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'serverless' ? '#fff' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          <Zap size={16} /> Serverless Studio
        </button>

        <button
          onClick={() => setActiveTab('sdk')}
          style={{
            padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
            background: activeTab === 'sdk' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'sdk' ? '#fff' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          <Terminal size={16} /> SDK Generator
        </button>
      </nav>

      {/* Mode Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {metrics?.mock_mode ? (
          <span className="badge badge-mock">
            <ShieldCheck size={14} /> Mock Cloud Mode
          </span>
        ) : (
          <span className="badge badge-running">
            <ShieldCheck size={14} /> Live API Connected
          </span>
        )}
      </div>
    </header>
  );
};
