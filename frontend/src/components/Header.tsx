import React from 'react';
import { Cpu, Terminal, Zap, ShieldCheck, Box, Search, Home } from 'lucide-react';
import { ClusterMetrics } from '../types';

interface HeaderProps {
  metrics: ClusterMetrics | null;
  activeTab: 'home' | 'pods' | 'serverless' | 'sdk';
  setActiveTab: (tab: 'home' | 'pods' | 'serverless' | 'sdk') => void;
  onDeployClick: () => void;
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ metrics, activeTab, setActiveTab, onDeployClick, onSearchClick }) => {
  return (
    <header className="runpod-navbar">
      {/* Brand Logo - Clicking logo goes to Landing Page Home */}
      <div className="runpod-logo-group" onClick={() => setActiveTab('home')}>
        <div className="runpod-logo-icon">
          <Box size={22} color="#ffffff" />
        </div>
        <span className="runpod-logo-text">runpod</span>
        <span className="badge-tag">STUDIO</span>
      </div>

      {/* Navigation Pill Menu */}
      <nav className="nav-pill-container">
        <button
          onClick={() => setActiveTab('home')}
          className={`nav-pill-btn ${activeTab === 'home' ? 'active' : ''}`}
        >
          <Home size={15} /> Overview
        </button>

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
        <div
          onClick={onSearchClick}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)',
            borderRadius: '20px', padding: '0.45rem 0.9rem', fontSize: '0.8rem', color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <Search size={14} /> Search API & Docs
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px' }}>⌘K</span>
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
  );
};
