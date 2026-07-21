import React from 'react';
import { Cpu, Terminal, Zap, ShieldCheck, Box, Search, ArrowRight } from 'lucide-react';
import { ClusterMetrics } from '../types';

interface HeaderProps {
  metrics: ClusterMetrics | null;
  activeTab: 'pods' | 'serverless' | 'sdk';
  setActiveTab: (tab: 'pods' | 'serverless' | 'sdk') => void;
  onDeployClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ metrics, activeTab, setActiveTab, onDeployClick }) => {
  return (
    <>
      {/* Top RunPod Announcement Bar */}
      <div className="top-announcement-bar">
        <span>📰 We raised a Series A! Read a post from our CEO: 1M devs and the cloud we're building next.</span>
        <a href="https://www.runpod.io/blog" target="_blank" rel="noreferrer">
          Read post <ArrowRight size={12} style={{ display: 'inline', marginLeft: '2px' }} />
        </a>
      </div>

      {/* Main Navbar */}
      <header className="runpod-navbar">
        {/* Brand Logo */}
        <div className="runpod-logo-group" onClick={() => setActiveTab('pods')}>
          <div className="runpod-logo-icon">
            <Box size={22} color="#ffffff" />
          </div>
          <span className="runpod-logo-text">runpod</span>
          <span className="badge-tag">STUDIO</span>
        </div>

        {/* Pill Nav Bar */}
        <nav className="nav-pill-container">
          <button
            onClick={() => setActiveTab('pods')}
            className={`nav-pill-btn ${activeTab === 'pods' ? 'active' : ''}`}
          >
            <Cpu size={15} /> GPU Pods
          </button>

          <button
            onClick={() => setActiveTab('serverless')}
            className={`nav-pill-btn ${activeTab === 'serverless' ? 'active' : ''}`}
          >
            <Zap size={15} /> Serverless Studio
          </button>

          <button
            onClick={() => setActiveTab('sdk')}
            className={`nav-pill-btn ${activeTab === 'sdk' ? 'active' : ''}`}
          >
            <Terminal size={15} /> SDK Generator
          </button>
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)',
            borderRadius: '20px', padding: '0.45rem 0.9rem', fontSize: '0.8rem', color: 'var(--text-secondary)'
          }}>
            <Search size={14} /> Search API & Docs
          </div>

          {metrics?.mock_mode ? (
            <span className="badge badge-mock">
              <ShieldCheck size={13} /> Mock Mode
            </span>
          ) : (
            <span className="badge badge-running">
              <ShieldCheck size={13} /> Live API
            </span>
          )}

          <button className="btn-primary-glow" onClick={onDeployClick}>
            <Zap size={16} /> Deploy Pod
          </button>
        </div>
      </header>
    </>
  );
};
