import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ClusterStats } from './components/ClusterStats';
import { PodManager } from './components/PodManager';
import { ServerlessStudio } from './components/ServerlessStudio';
import { SDKPlayground } from './components/SDKPlayground';
import { TelemetryView } from './components/TelemetryView';
import { CostCalculator } from './components/CostCalculator';
import { AskRunpodModal } from './components/AskRunpodModal';
import { SearchModal } from './components/SearchModal';
import { MessageSquare } from 'lucide-react';
import { GPUInfo, PodResponse, ServerlessEndpointInfo, ServerlessRunResponse, SDKCodeResponse, ClusterMetrics } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'pods' | 'serverless' | 'sdk' | 'telemetry' | 'calculator'>('pods');
  const [metrics, setMetrics] = useState<ClusterMetrics | null>(null);
  const [gpus, setGpus] = useState<GPUInfo[]>([]);
  const [pods, setPods] = useState<PodResponse[]>([]);
  const [endpoints, setEndpoints] = useState<ServerlessEndpointInfo[]>([]);
  const [isAskRunpodOpen, setIsAskRunpodOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const podManagerRef = useRef<any>(null);

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

  const triggerDeployModal = () => {
    setActiveTab('pods');
    setTimeout(() => {
      if (podManagerRef.current) {
        podManagerRef.current.openModal();
      }
    }, 100);
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <Header
        metrics={metrics}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDeployClick={triggerDeployModal}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <div style={{ maxWidth: '1350px', margin: '1.5rem auto 0 auto' }}>
        <ClusterStats metrics={metrics} />

        <main>
          {activeTab === 'pods' && (
            <PodManager
              ref={podManagerRef}
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

          {activeTab === 'telemetry' && (
            <TelemetryView
              pods={pods}
            />
          )}

          {activeTab === 'calculator' && (
            <CostCalculator />
          )}
        </main>
      </div>

      {/* Floating Ask Runpod Widget & Drawer */}
      <div className="ask-runpod-widget" onClick={() => setIsAskRunpodOpen(!isAskRunpodOpen)}>
        <MessageSquare size={16} /> Ask RunPod
      </div>

      <AskRunpodModal
        isOpen={isAskRunpodOpen}
        onClose={() => setIsAskRunpodOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
