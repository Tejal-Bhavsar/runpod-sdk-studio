from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class GPUInfo(BaseModel):
    id: str
    name: str
    vram_gb: int
    cost_per_hour: float
    description: str
    is_available: bool = True

class PodCreateRequest(BaseModel):
    name: str = Field(..., example="vllm-llama3-worker")
    image_name: str = Field(default="runpod/vllm:latest", example="runpod/vllm:latest")
    gpu_type_id: str = Field(default="NVIDIA RTX 4090", example="NVIDIA RTX 4090")
    container_disk_in_gb: int = Field(default=50, ge=10, le=500)
    volume_in_gb: int = Field(default=20, ge=0, le=1000)
    env_vars: Dict[str, str] = Field(default_factory=dict)
    ports: str = Field(default="8000/http,22/tcp")

class PodResponse(BaseModel):
    id: str
    name: str
    image_name: str
    gpu_type_id: str
    status: str  # "RUNNING", "STOPPED", "STARTING", "TERMINATED"
    cost_per_hour: float
    vram_gb: int
    container_disk_in_gb: int
    volume_in_gb: int
    ip: Optional[str] = None
    ports: str
    created_at: str
    uptime_seconds: int = 0

class ServerlessEndpointInfo(BaseModel):
    id: str
    name: str
    template_type: str  # "vLLM (Llama-3 8B)", "SDXL Image Gen", "Whisper Audio Transcribe", "Custom PyTorch"
    gpu_type: str
    workers_min: int
    workers_max: int
    active_workers: int
    idle_timeout_seconds: int
    cold_start_ms: int
    total_requests: int

class ServerlessRunRequest(BaseModel):
    endpoint_id: str
    input_payload: Dict[str, Any]
    stream_logs: bool = True

class ServerlessRunResponse(BaseModel):
    job_id: str
    endpoint_id: str
    status: str  # "COMPLETED", "IN_QUEUE", "RUNNING", "FAILED"
    output: Dict[str, Any]
    execution_time_ms: int
    tokens_generated: Optional[int] = None
    cold_start: bool = False

class SDKCodeGenerateRequest(BaseModel):
    action: str  # "create_pod", "run_serverless", "get_pod_status", "terminate_pod"
    parameters: Dict[str, Any]
    language: str  # "python" or "typescript"

class SDKCodeGenerateResponse(BaseModel):
    action: str
    language: str
    code: str
    description: str
    curl_command: str

class ClusterMetrics(BaseModel):
    active_pods: int
    active_serverless_endpoints: int
    total_gpus_allocated: int
    total_vram_gb: int
    vram_used_gb: float
    gpu_utilization_pct: float
    hourly_spend_usd: float
    daily_forecast_usd: float
    avg_serverless_latency_ms: int
    mock_mode: bool

# Telemetry Models
class TelemetryPoint(BaseModel):
    timestamp: str
    vram_used_gb: float
    vram_total_gb: float
    compute_load_pct: float
    temperature_c: int
    fan_speed_pct: int
    network_io_mbps: float

class TelemetryResponse(BaseModel):
    pod_id: str
    pod_name: str
    gpu_type: str
    history: List[TelemetryPoint]

# Cost Calculator Models
class CostCalculatorRequest(BaseModel):
    gpu_type_id: str = "NVIDIA RTX 4090"
    gpu_count: int = 1
    hours_per_day: int = 24
    duration_days: int = 30

class CostCalculatorResponse(BaseModel):
    gpu_type_id: str
    gpu_count: int
    hours_per_day: int
    duration_days: int
    total_hours: int
    hourly_rate_on_demand: float
    hourly_rate_spot: float
    total_on_demand_usd: float
    total_spot_usd: float
    savings_usd: float
    savings_pct: float
