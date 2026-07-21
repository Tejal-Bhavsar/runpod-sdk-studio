import React, { useState } from 'react';
import { Zap, Play, Terminal, Cpu, CheckCircle2, Clock } from 'lucide-react';
import { ServerlessEndpointInfo, ServerlessRunResponse } from '../types';

interface ServerlessStudioProps {
  endpoints: ServerlessEndpointInfo[];
  onRunSync: (endpointId: string, payload: any) => Promise<ServerlessRunResponse>;
}

export const ServerlessStudio: React.FC<ServerlessStudioProps> = ({ endpoints, onRunSync }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]?.id || 'ep-vllm-llama3');
  const [prompt, setPrompt] = useState('Explain how RunPod Serverless GPU autoscaling handles cold starts efficiently.');
  const [isStreaming, setIsStreaming] = useState(false);
  const [logs, setLogs] = useState<Array<{ stage: string; message: string }>>([]);
  const [streamedText, setStreamedText] = useState('');
  const [runResult, setRunResult] = useState<ServerlessRunResponse | null>(null);

  const activeEp = endpoints.find(e => e.id === selectedEndpoint);

  const handleRunStream = () => {
    setIsStreaming(true);
    setLogs([]);
    setStreamedText('');
    setRunResult(null);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/serverless/stream`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ endpoint_id: selectedEndpoint, prompt }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'log') {
        setLogs(prev => [...prev, { stage: data.stage, message: data.message }]);
      } else if (data.type === 'token') {
        setStreamedText(data.full_text);
      } else if (data.type === 'done') {
        setIsStreaming(false);
        ws.close();
      }
    };

    ws.onerror = () => {
      setIsStreaming(false);
      // Fallback to REST sync run if WebSocket fails
      onRunSync(selectedEndpoint, { prompt }).then(res => {
        setRunResult(res);
        setStreamedText(res.output.response || JSON.stringify(res.output, null, 2));
      });
    };
  };

  return (
    <div style={{ padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Left: Endpoint Selector & Test Inputs */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap color="var(--accent-purple)" /> Serverless Endpoint Studio
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Execute synchronous requests or stream real-time worker output
          </p>
        </div>

        {/* Endpoint Pick Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Serverless Endpoint</label>
          {endpoints.map(ep => (
            <div
              key={ep.id}
              onClick={() => setSelectedEndpoint(ep.id)}
              style={{
                padding: '1rem', borderRadius: '10px', cursor: 'pointer',
                border: selectedEndpoint === ep.id ? '2px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                background: selectedEndpoint === ep.id ? 'rgba(124, 58, 237, 0.12)' : 'rgba(15, 23, 42, 0.5)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem' }}>{ep.name}</strong>
                <span className="badge badge-running" style={{ fontSize: '0.7rem' }}>{ep.active_workers} Workers Active</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                <span><Cpu size={12} /> {ep.gpu_type}</span>
                <span><Clock size={12} /> Avg Cold Start: {ep.cold_start_ms}ms</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Prompt */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
            Inference Prompt Payload
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            style={{ width: '100%', resize: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleRunStream}
          disabled={isStreaming}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isStreaming ? 0.7 : 1 }}
        >
          <Play size={16} /> {isStreaming ? 'Streaming Inference...' : 'Run Endpoint Stream'}
        </button>
      </div>

      {/* Right: Live Execution Stream Feed & Terminal Output */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={18} color="var(--accent-cyan)" /> Live Token Stream & Worker Telemetry
        </h3>

        {/* Worker Log Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
          {logs.map((log, idx) => (
            <div key={idx} style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.08)', padding: '0.35rem 0.6rem', borderRadius: '4px' }}>
              ⚡ [{log.stage}] {log.message}
            </div>
          ))}
        </div>

        {/* Streamed Result Output */}
        <div className="code-block" style={{ flex: 1, minHeight: '220px', whiteSpace: 'pre-wrap' }}>
          {streamedText || (isStreaming ? 'Waiting for first token...' : 'Click "Run Endpoint Stream" to test serverless execution.')}
        </div>
      </div>
    </div>
  );
};
