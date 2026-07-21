import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ClusterStats } from './components/ClusterStats';
import { PodManager } from './components/PodManager';
import { ServerlessStudio } from './components/ServerlessStudio';
import { SDKPlayground } from './components/SDKPlayground';
import { GPUInfo, PodResponse, ServerlessEndpointInfo, ServerlessRunResponse, SDKCodeResponse, ClusterMetrics } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'pods' | 'serverless' | 'sdk'>('pods');
  const [metrics, setMetrics] = useState<ClusterMetrics | null>(null);
  const [gpus, setGpus] = useState<GPUInfo[]>([]);
  const [pods, setPods] = useState<PodResponse[]>([]);
  const [endpoints, setEndpoints] = useState<ServerlessEndpointInfo[]>([]);

  // Initial Data Fetch
  useEffect(() => {
    fetchMetrics();
    fetchGpus();
    fetchPods();
    fetchEndpoints();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/metrics');
      if (res.ok) setMetrics(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchGpus = async () => {
    try {
      const res = await fetch('/api/gpus');
      if (res.ok) setGpus(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPods = async () => {
    try {
      const res = await fetch('/api/pods');
      if (res.ok) setPods(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEndpoints = async () => {
    try {
      const res = await fetch('/api/serverless/endpoints');
      if (res.ok) setEndpoints(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeployPod = async (podData: any) => {
    try {
      const res = await fetch('/api/pods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(podData)
      });
      if (res.ok) {
        await fetchPods();
        await fetchMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePodAction = async (podId: string, action: 'start' | 'stop' | 'terminate') => {
    try {
      const res = await fetch(`/api/pods/${podId}/${action}`, { method: 'POST' });
      if (res.ok) {
        await fetchPods();
        await fetchMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunSync = async (endpointId: string, payload: any): Promise<ServerlessRunResponse> => {
    const res = await fetch('/api/serverless/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint_id: endpointId, input_payload: payload })
    });
    return await res.json();
  };

  const handleGenerateCode = async (action: string, params: any, language: string): Promise<SDKCodeResponse> => {
    const res = await fetch('/api/sdk/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, parameters: params, language })
    });
    return await res.json();
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>
      <Header metrics={metrics} activeTab={activeTab} setActiveTab={setActiveTab} />
      <ClusterStats metrics={metrics} />

      <main>
        {activeTab === 'pods' && (
          <PodManager
            gpus={gpus}
            pods={pods}
            onDeployPod={handleDeployPod}
            onPodAction={handlePodAction}
          />
        )}

        {activeTab === 'serverless' && (
          <ServerlessStudio
            endpoints={endpoints}
            onRunSync={handleRunSync}
          />
        )}

        {activeTab === 'sdk' && (
          <SDKPlayground
            onGenerateCode={handleGenerateCode}
          />
        )}
      </main>
    </div>
  );
}
