import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Cpu, Plus, Play, Square, Trash2, ExternalLink } from 'lucide-react';
import { GPUInfo, PodResponse } from '../types';

interface PodManagerProps {
  gpus: GPUInfo[];
  pods: PodResponse[];
  onDeployPod: (podData: any) => void;
  onPodAction: (podId: string, action: 'start' | 'stop' | 'terminate') => void;
}

export const PodManager = forwardRef((props: PodManagerProps, ref) => {
  const { gpus, pods, onDeployPod, onPodAction } = props;
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [podName, setPodName] = useState('vllm-llama3-worker');
  const [imageName, setImageName] = useState('runpod/vllm:latest');
  const [selectedGpu, setSelectedGpu] = useState(gpus[0]?.id || 'NVIDIA RTX 4090');
  const [diskSize, setDiskSize] = useState(50);

  useImperativeHandle(ref, () => ({
    openModal: () => setShowDeployModal(true)
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDeployPod({
      name: podName,
      image_name: imageName,
      gpu_type_id: selectedGpu,
      container_disk_in_gb: diskSize,
      volume_in_gb: 20,
      ports: '8000/http,22/tcp'
    });
    setShowDeployModal(false);
  };

  const selectedGpuObj = gpus.find(g => g.id === selectedGpu);

  return (
    <div style={{ padding: '0 1rem' }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Active GPU Pods</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>On-demand GPU compute instances for deep learning & LLM serving</p>
        </div>
        <button className="btn-primary-glow" onClick={() => setShowDeployModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Deploy On-Demand Pod
        </button>
      </div>

      {/* Pods Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {pods.map(pod => (
          <div key={pod.id} className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cpu size={18} color="var(--accent-purple-light)" /> {pod.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ID: {pod.id}
                </span>
              </div>
              <span className={pod.status === 'RUNNING' ? 'badge badge-running' : 'badge badge-stopped'}>
                {pod.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', margin: '0.75rem 0', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GPU Hardware:</span>
                <strong style={{ color: '#fff' }}>{pod.gpu_type_id} ({pod.vram_gb}GB VRAM)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Container Image:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{pod.image_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Public IP / Ports:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{pod.ip || 'Provisioning...'} ({pod.ports})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Hourly Rate:</span>
                <strong style={{ color: 'var(--accent-green)' }}>${pod.cost_per_hour}/hr</strong>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              {pod.status === 'RUNNING' ? (
                <button
                  className="btn-secondary-pill"
                  title="Stop Pod"
                  onClick={() => onPodAction(pod.id, 'stop')}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.5rem 0.8rem' }}
                >
                  <Square size={14} color="#ef4444" /> Stop
                </button>
              ) : (
                <button
                  className="btn-secondary-pill"
                  title="Start Pod"
                  onClick={() => onPodAction(pod.id, 'start')}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.5rem 0.8rem' }}
                >
                  <Play size={14} color="#10b981" /> Start
                </button>
              )}

              {pod.ip && (
                <button
                  className="btn-secondary-pill"
                  title={`Open Pod Endpoint (${pod.ip}:8000)`}
                  onClick={() => {
                    alert(`🔗 Connected to Pod Endpoint (${pod.name})\nPublic IP: ${pod.ip}\nPorts: ${pod.ports}\n\nRedirecting to FastAPI Docs for API testing...`);
                    window.open('/docs', '_blank');
                  }}
                  style={{ padding: '0.5rem 0.75rem' }}
                >
                  <ExternalLink size={16} />
                </button>
              )}

              <button
                className="btn-secondary-pill"
                title="Terminate Pod"
                onClick={() => {
                  if (confirm(`Are you sure you want to terminate pod "${pod.name}"?`)) {
                    onPodAction(pod.id, 'terminate');
                  }
                }}
                style={{ padding: '0.5rem 0.75rem', color: '#ef4444' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 4, 18, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', border: '1px solid var(--accent-purple)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu color="var(--accent-purple-light)" /> Configure & Deploy GPU Pod
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Pod Name</label>
                <input type="text" value={podName} onChange={e => setPodName(e.target.value)} style={{ width: '100%' }} required />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Docker Image</label>
                <input type="text" value={imageName} onChange={e => setImageName(e.target.value)} style={{ width: '100%' }} required />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Select GPU Hardware</label>
                <select value={selectedGpu} onChange={e => setSelectedGpu(e.target.value)} style={{ width: '100%' }}>
                  {gpus.map(gpu => (
                    <option key={gpu.id} value={gpu.id}>
                      {gpu.name} ({gpu.vram_gb}GB VRAM) - ${gpu.cost_per_hour}/hr
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Container Disk (GB)</label>
                <input type="number" value={diskSize} onChange={e => setDiskSize(Number(e.target.value))} min={10} max={500} style={{ width: '100%' }} />
              </div>

              {selectedGpuObj && (
                <div style={{ background: 'rgba(123, 63, 228, 0.12)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(123, 63, 228, 0.3)', fontSize: '0.85rem' }}>
                  <strong>Estimated Cost:</strong> ${selectedGpuObj.cost_per_hour}/hr (~${(selectedGpuObj.cost_per_hour * 24).toFixed(2)}/day)
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary-glow" style={{ flex: 1, justifyContent: 'center' }}>Deploy Now</button>
                <button type="button" className="btn-secondary-pill" onClick={() => setShowDeployModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});
