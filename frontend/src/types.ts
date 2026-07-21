export interface GPUInfo {
  id: string;
  name: string;
  vram_gb: number;
  cost_per_hour: number;
  description: string;
  is_available: boolean;
}

export interface PodResponse {
  id: string;
  name: string;
  image_name: string;
  gpu_type_id: string;
  status: 'RUNNING' | 'STOPPED' | 'STARTING' | 'TERMINATED';
  cost_per_hour: number;
  vram_gb: number;
  container_disk_in_gb: number;
  volume_in_gb: number;
  ip?: string;
  ports: string;
  created_at: string;
  uptime_seconds: number;
}

export interface ServerlessEndpointInfo {
  id: string;
  name: string;
  template_type: string;
  gpu_type: string;
  workers_min: number;
  workers_max: number;
  active_workers: number;
  idle_timeout_seconds: number;
  cold_start_ms: number;
  total_requests: number;
}

export interface ServerlessRunResponse {
  job_id: string;
  endpoint_id: string;
  status: string;
  output: Record<string, any>;
  execution_time_ms: number;
  tokens_generated?: number;
  cold_start: boolean;
}

export interface SDKCodeResponse {
  action: string;
  language: string;
  code: string;
  description: string;
  curl_command: string;
}

export interface ClusterMetrics {
  active_pods: number;
  active_serverless_endpoints: number;
  total_gpus_allocated: number;
  total_vram_gb: number;
  vram_used_gb: number;
  gpu_utilization_pct: number;
  hourly_spend_usd: number;
  daily_forecast_usd: number;
  avg_serverless_latency_ms: number;
  mock_mode: boolean;
}
