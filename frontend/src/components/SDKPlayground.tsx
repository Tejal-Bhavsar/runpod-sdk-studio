import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Code2 } from 'lucide-react';
import { SDKCodeResponse } from '../types';

interface SDKPlaygroundProps {
  onGenerateCode: (action: string, params: any, language: string) => Promise<SDKCodeResponse>;
}

export const SDKPlayground: React.FC<SDKPlaygroundProps> = ({ onGenerateCode }) => {
  const [action, setAction] = useState('create_pod');
  const [language, setLanguage] = useState<'python' | 'typescript'>('python');
  const [podName, setPodName] = useState('my-vllm-pod');
  const [gpuType, setGpuType] = useState('NVIDIA RTX 4090');
  const [copied, setCopied] = useState(false);
  const [codeResponse, setCodeResponse] = useState<SDKCodeResponse | null>(null);

  useEffect(() => {
    onGenerateCode(action, { name: podName, gpu_type_id: gpuType, endpoint_id: 'ep-vllm-llama3' }, language)
      .then(res => setCodeResponse(res));
  }, [action, language, podName, gpuType]);

  const handleCopy = () => {
    if (codeResponse) {
      navigator.clipboard.writeText(codeResponse.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Configuration Controls */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code2 color="var(--accent-purple)" /> RunPod SDK Code Generator
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Visually configure parameters to generate production-ready RunPod SDK code
        </p>

        {/* Action Toggle */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>SDK Operation</label>
          <select value={action} onChange={e => setAction(e.target.value)} style={{ width: '100%' }}>
            <option value="create_pod">deploy_pod() — Provision On-Demand GPU Pod</option>
            <option value="run_serverless">Endpoint.run_sync() — Invoke Serverless Endpoint</option>
          </select>
        </div>

        {/* Language Selection */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Target SDK Language</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setLanguage('python')}
              style={{
                flex: 1,
                padding: '0.75rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: language === 'python' ? '2px solid #7b3fe4' : '1px solid rgba(255, 255, 255, 0.15)',
                background: language === 'python' ? 'linear-gradient(135deg, #7b3fe4, #6366f1)' : 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                boxShadow: language === 'python' ? '0 0 16px rgba(123, 63, 228, 0.5)' : 'none'
              }}
            >
              🐍 Python SDK (runpod-python)
            </button>
            <button
              onClick={() => setLanguage('typescript')}
              style={{
                flex: 1,
                padding: '0.75rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: language === 'typescript' ? '2px solid #7b3fe4' : '1px solid rgba(255, 255, 255, 0.15)',
                background: language === 'typescript' ? 'linear-gradient(135deg, #7b3fe4, #6366f1)' : 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                boxShadow: language === 'typescript' ? '0 0 16px rgba(123, 63, 228, 0.5)' : 'none'
              }}
            >
              🔷 TypeScript SDK (runpod-ts)
            </button>
          </div>
        </div>

        {/* Custom Inputs */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Pod / Endpoint Name</label>
          <input type="text" value={podName} onChange={e => setPodName(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Target GPU Hardware</label>
          <select value={gpuType} onChange={e => setGpuType(e.target.value)} style={{ width: '100%' }}>
            <option value="NVIDIA RTX 4090">NVIDIA RTX 4090 (24GB VRAM)</option>
            <option value="NVIDIA A100 80GB SXM">NVIDIA A100 80GB SXM (80GB VRAM)</option>
            <option value="NVIDIA H100 PCIe">NVIDIA H100 PCIe (80GB VRAM)</option>
          </select>
        </div>
      </div>

      {/* Code Snippet Display */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
            Generated {language} Code
          </span>
          <button className="btn-secondary" onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <div className="code-block" style={{ flex: 1, minHeight: '260px', marginBottom: '1rem' }}>
          {codeResponse?.code}
        </div>

        {/* cURL Equivalent */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            EQUIVALENT cURL API REQUEST
          </span>
          <div className="code-block" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {codeResponse?.curl_command}
          </div>
        </div>
      </div>
    </div>
  );
};
