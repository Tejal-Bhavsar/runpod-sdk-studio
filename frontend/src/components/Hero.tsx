import React from 'react';
import { Zap, Box, Cpu, BarChart3, DollarSign, ArrowRight } from 'lucide-react';

interface HeroProps {
  onDeployClick: () => void;
  onExploreServerless: () => void;
  onSelectTab: (tab: 'pods' | 'serverless' | 'sdk' | 'telemetry' | 'calculator') => void;
}

export const Hero: React.FC<HeroProps> = ({ onDeployClick, onExploreServerless, onSelectTab }) => {
  return (
    <div style={{ maxWidth: '1350px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      <section style={{
        textAlign: 'left',
        padding: '3.5rem 2.5rem 2.5rem 2.5rem',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <div>
          {/* Enterprise Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(123, 63, 228, 0.15)', border: '1px solid rgba(123, 63, 228, 0.35)',
            padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', color: '#c084fc',
            fontWeight: 600, marginBottom: '1.5rem'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7b3fe4' }}></span>
            Enterprise & Developer AI Platform
          </div>

          {/* Hero Title */}
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            background: 'linear-gradient(180deg, #ffffff 30%, #a7b0cf 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Ship AI products.<br />Not infrastructure.
          </h1>

          {/* Hero Description */}
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '580px',
            marginBottom: '2rem'
          }}>
            Run production AI on guaranteed GPU capacity, with security that passes enterprise review and pricing that rewards commitment. One platform, one unified SDK.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn-primary-glow" onClick={onDeployClick} style={{ fontSize: '0.95rem', padding: '0.8rem 1.6rem' }}>
              Launch GPU Pod <ArrowRight size={16} />
            </button>
            <button className="btn-secondary-pill" onClick={onExploreServerless} style={{ fontSize: '0.95rem', padding: '0.8rem 1.6rem' }}>
              <Zap size={16} color="#7b3fe4" /> Test Serverless vLLM
            </button>
          </div>
        </div>

        {/* Hero Visual Graphic (RunPod Hexagon Cluster Diagram) */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div className="glass-panel" style={{
            width: '100%', maxWidth: '440px', padding: '2rem',
            border: '1px solid rgba(123, 63, 228, 0.4)',
            boxShadow: '0 0 50px rgba(123, 63, 228, 0.25)',
            background: 'radial-gradient(circle, rgba(28, 17, 72, 0.8) 0%, rgba(13, 7, 34, 0.9) 100%)',
            textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}>
            {/* Center Hexagon Logo */}
            <div style={{
              width: '90px', height: '90px', margin: '0 auto 1.25rem auto',
              borderRadius: '22px', background: 'linear-gradient(135deg, #7b3fe4, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(123, 63, 228, 0.8)', transform: 'rotate(45deg)'
            }}>
              <Box size={44} color="#ffffff" style={{ transform: 'rotate(-45deg)' }} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>RunPod Global Cloud</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Instant On-Demand Pods & Serverless Autoscaling
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.75rem', textAlign: 'left' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--text-muted)' }}>/// PODS</span><br />
                <strong style={{ color: '#fff' }}>H100 & A100 SXM</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--text-muted)' }}>••• SERVERLESS</span><br />
                <strong style={{ color: '#fff' }}>vLLM & SDXL</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--text-muted)' }}>:: STORAGE</span><br />
                <strong style={{ color: '#fff' }}>Network Volumes</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--text-muted)' }}>• CLUSTERS</span><br />
                <strong style={{ color: '#fff' }}>Global Regions</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Catalog Grid */}
      <div style={{ padding: '0 2.5rem', marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Explore RunPod Studio Capabilities
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {/* Card 1: GPU Pod Console */}
          <div
            onClick={() => onSelectTab('pods')}
            className="glass-panel glass-panel-hover"
            style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.50rem' }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(123, 63, 228, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={20} color="var(--accent-purple-light)" />
            </div>
            <strong style={{ fontSize: '0.95rem' }}>GPU Pod Console</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Launch and configure dedicated GPU containers with custom templates.</p>
          </div>

          {/* Card 2: Serverless Studio */}
          <div
            onClick={() => onSelectTab('serverless')}
            className="glass-panel glass-panel-hover"
            style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.50rem' }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="var(--accent-cyan)" />
            </div>
            <strong style={{ fontSize: '0.95rem' }}>Serverless Studio</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Trigger serverless inference jobs and view live token streaming outputs.</p>
          </div>

          {/* Card 3: Live Telemetry */}
          <div
            onClick={() => onSelectTab('telemetry')}
            className="glass-panel glass-panel-hover"
            style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.50rem' }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={20} color="var(--accent-green)" />
            </div>
            <strong style={{ fontSize: '0.95rem' }}>Live Telemetry</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monitor real-time core load, memory metrics, and GPU temperature graphs.</p>
          </div>

          {/* Card 4: Savings Calculator */}
          <div
            onClick={() => onSelectTab('calculator')}
            className="glass-panel glass-panel-hover"
            style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.50rem' }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} color="var(--accent-pink)" />
            </div>
            <strong style={{ fontSize: '0.95rem' }}>Savings Calculator</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compare On-Demand vs Spot pricing discounts and estimate monthly spend.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
