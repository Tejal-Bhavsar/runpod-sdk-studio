import React from 'react';
import { Cpu, Terminal, Zap, ShieldCheck, Box, Search, BarChart3, DollarSign } from 'lucide-react';
import { ClusterMetrics } from '../types';

interface HeaderProps {
  metrics: ClusterMetrics | null;
  activeTab: 'home' | 'pods' | 'serverless' | 'sdk' | 'telemetry' | 'calculator';
  setActiveTab: (tab: 'home' | 'pods' | 'serverless' | 'sdk' | 'telemetry' | 'calculator') => void;
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

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`nav-pill-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
        >
          <BarChart3 size={15} /> Telemetry
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`nav-pill-btn ${activeTab === 'calculator' ? 'active' : ''}`}
        >
          <DollarSign size={15} /> Calculator
        </button>
      </nav>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div onClick={onSearchClick} className="runpod-search-button">
          <Search size={14} color="var(--accent-purple-light)" />
          <span>Search API & Docs</span>
          <span className="runpod-search-shortcut">⌘K</span>
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
