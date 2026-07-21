import uuid
import time
import random
import asyncio
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from app.config import settings
from app.models.schemas import (
    GPUInfo, PodCreateRequest, PodResponse,
    ServerlessEndpointInfo, ServerlessRunRequest, ServerlessRunResponse,
    SDKCodeGenerateRequest, SDKCodeGenerateResponse, ClusterMetrics
)

# Available GPU catalog on RunPod
GPU_CATALOG: List[GPUInfo] = [
    GPUInfo(id="NVIDIA RTX 4090", name="NVIDIA RTX 4090", vram_gb=24, cost_per_hour=0.44, description="High single-card performance for inference & medium fine-tuning."),
    GPUInfo(id="NVIDIA RTX 3090", name="NVIDIA RTX 3090", vram_gb=24, cost_per_hour=0.29, description="Budget-friendly 24GB VRAM GPU for light LLM inference."),
    GPUInfo(id="NVIDIA A100 80GB SXM", name="NVIDIA A100 80GB SXM", vram_gb=80, cost_per_hour=1.89, description="Enterprise-grade GPU for multi-billion parameter model inference & training."),
    GPUInfo(id="NVIDIA H100 PCIe", name="NVIDIA H100 80GB PCIe", vram_gb=80, cost_per_hour=2.69, description="Ultra high performance for modern LLM architectures (vLLM / DeepSeek)."),
    GPUInfo(id="NVIDIA L40S", name="NVIDIA L40S 48GB", vram_gb=48, cost_per_hour=0.99, description="Balanced VRAM & compute for high-concurrency serverless inference.")
]

class RunPodService:
    def __init__(self):
        self.mock_mode = settings.MOCK_MODE
        self._mock_pods: Dict[str, PodResponse] = {}
        self._mock_endpoints: Dict[str, ServerlessEndpointInfo] = {}
        self._seed_mock_data()

    def _seed_mock_data(self):
        """Seed realistic mock RunPod instances & serverless endpoints for instant testing."""
        pod1_id = f"pod-{uuid.uuid4().hex[:8]}"
        self._mock_pods[pod1_id] = PodResponse(
            id=pod1_id,
            name="vllm-llama3-8b-worker",
            image_name="runpod/vllm:v0.4.2",
            gpu_type_id="NVIDIA RTX 4090",
            status="RUNNING",
            cost_per_hour=0.44,
            vram_gb=24,
            container_disk_in_gb=50,
            volume_in_gb=20,
            ip="194.26.196.42",
            ports="8000/http, 22/tcp",
            created_at=datetime.now(timezone.utc).isoformat(),
            uptime_seconds=3600
        )

        pod2_id = f"pod-{uuid.uuid4().hex[:8]}"
        self._mock_pods[pod2_id] = PodResponse(
            id=pod2_id,
            name="sdxl-comfyui-studio",
            image_name="runpod/comfyui:latest",
            gpu_type_id="NVIDIA A100 80GB SXM",
            status="RUNNING",
            cost_per_hour=1.89,
            vram_gb=80,
            container_disk_in_gb=100,
            volume_in_gb=50,
            ip="194.26.196.88",
            ports="8188/http, 22/tcp",
            created_at=datetime.now(timezone.utc).isoformat(),
            uptime_seconds=7200
        )

        # Seed Serverless Endpoints
        ep1_id = "ep-vllm-llama3"
        self._mock_endpoints[ep1_id] = ServerlessEndpointInfo(
            id=ep1_id,
            name="vLLM Llama-3-8B Instruct Endpoint",
            template_type="vLLM (Llama-3 8B)",
            gpu_type="NVIDIA RTX 4090",
            workers_min=1,
            workers_max=5,
            active_workers=2,
            idle_timeout_seconds=300,
            cold_start_ms=1200,
            total_requests=1420
        )

        ep2_id = "ep-sdxl-turbo"
        self._mock_endpoints[ep2_id] = ServerlessEndpointInfo(
            id=ep2_id,
            name="SDXL Turbo Image Generation",
            template_type="SDXL Image Gen",
            gpu_type="NVIDIA L40S 48GB",
            workers_min=0,
            workers_max=3,
            active_workers=1,
            idle_timeout_seconds=120,
            cold_start_ms=1800,
            total_requests=890
        )

    # ------------------- Pod Operations -------------------

    def get_gpus(self) -> List[GPUInfo]:
        return GPU_CATALOG

    def get_pods(self) -> List[PodResponse]:
        if not self.mock_mode and settings.RUNPOD_API_KEY:
            try:
                import runpod
                runpod.api_key = settings.RUNPOD_API_KEY
                live_pods = runpod.get_pods()
                return [
                    PodResponse(
                        id=p.get("id"),
                        name=p.get("name", "RunPod Instance"),
                        image_name=p.get("imageName", "custom/image"),
                        gpu_type_id=p.get("gpuName", "NVIDIA GPU"),
                        status="RUNNING" if p.get("desiredStatus") == "RUNNING" else "STOPPED",
                        cost_per_hour=p.get("costPerHr", 0.44),
                        vram_gb=p.get("vramInGb", 24),
                        container_disk_in_gb=p.get("containerDiskInGb", 50),
                        volume_in_gb=p.get("volumeInGb", 20),
                        ip=p.get("runtime", {}).get("ports", [{}])[0].get("ip") if p.get("runtime") else None,
                        ports=str(p.get("port", "8000/http")),
                        created_at=datetime.now(timezone.utc).isoformat(),
                        uptime_seconds=3600
                    ) for p in live_pods
                ]
            except Exception:
                pass
        return list(self._mock_pods.values())

    def create_pod(self, req: PodCreateRequest) -> PodResponse:
        gpu_info = next((g for g in GPU_CATALOG if g.id == req.gpu_type_id), GPU_CATALOG[0])
        pod_id = f"pod-{uuid.uuid4().hex[:8]}"

        new_pod = PodResponse(
            id=pod_id,
            name=req.name,
            image_name=req.image_name,
            gpu_type_id=gpu_info.name,
            status="RUNNING",
            cost_per_hour=gpu_info.cost_per_hour,
            vram_gb=gpu_info.vram_gb,
            container_disk_in_gb=req.container_disk_in_gb,
            volume_in_gb=req.volume_in_gb,
            ip=f"194.26.{random.randint(10,250)}.{random.randint(10,250)}",
            ports=req.ports,
            created_at=datetime.now(timezone.utc).isoformat(),
            uptime_seconds=10
        )
        self._mock_pods[pod_id] = new_pod
        return new_pod

    def toggle_pod_status(self, pod_id: str, action: str) -> Optional[PodResponse]:
        if pod_id in self._mock_pods:
            pod = self._mock_pods[pod_id]
            if action == "stop":
                pod.status = "STOPPED"
            elif action == "start":
                pod.status = "RUNNING"
            elif action == "terminate":
                del self._mock_pods[pod_id]
                return None
            return pod
        return None

    # ------------------- Serverless Operations -------------------

    def get_serverless_endpoints(self) -> List[ServerlessEndpointInfo]:
        return list(self._mock_endpoints.values())

    async def run_serverless_job(self, req: ServerlessRunRequest) -> ServerlessRunResponse:
        endpoint = self._mock_endpoints.get(req.endpoint_id)
        endpoint_name = endpoint.name if endpoint else "Custom Serverless Handler"

        # Simulate execution delay
        await asyncio.sleep(0.8)

        job_id = f"job-{uuid.uuid4().hex[:10]}"
        prompt = req.input_payload.get("prompt", "Explain RAG architecture with FastAPI & RunPod")

        if "sdxl" in req.endpoint_id.lower() or "image" in str(req.input_payload).lower():
            output = {
                "message": "Image generated successfully!",
                "image_url": "https://raw.githubusercontent.com/runpod/runpod-python/main/docs/assets/runpod-banner.png",
                "seed": random.randint(100000, 999999),
                "resolution": "1024x1024",
                "sampler": "euler_a"
            }
            tokens = 1
        else:
            output = {
                "response": f"Processed via RunPod Serverless ({endpoint_name}).\n\nPrompt: '{prompt}'\n\nResult: RunPod Serverless auto-scaled across active workers seamlessly with low latency.",
                "model": "meta-llama/Meta-Llama-3-8B-Instruct",
                "finish_reason": "stop"
            }
            tokens = len(prompt.split()) * 4 + 48

        return ServerlessRunResponse(
            job_id=job_id,
            endpoint_id=req.endpoint_id,
            status="COMPLETED",
            output=output,
            execution_time_ms=850,
            tokens_generated=tokens,
            cold_start=False
        )

    # ------------------- SDK Code Generator -------------------

    def generate_sdk_code(self, req: SDKCodeGenerateRequest) -> SDKCodeGenerateResponse:
        action = req.action
        params = req.parameters
        lang = req.language.lower()

        if action == "create_pod":
            name = params.get("name", "my-gpu-pod")
            image = params.get("image_name", "runpod/vllm:latest")
            gpu = params.get("gpu_type_id", "NVIDIA RTX 4090")
            disk = params.get("container_disk_in_gb", 50)

            if lang == "python":
                code = f"""import runpod

runpod.api_key = "YOUR_RUNPOD_API_KEY"

# Create GPU Pod using RunPod Python SDK
pod = runpod.create_pod(
    name="{name}",
    image_name="{image}",
    gpu_type_id="{gpu}",
    container_disk_in_gb={disk},
    volume_in_gb=20,
    ports="8000/http,22/tcp"
)

print(f"Pod Launched Successfully! Pod ID: {{pod['id']}}")
"""
            else:
                code = f"""import RunPod from 'runpod-sdk';

const runpod = new RunPod({{ apiKey: process.env.RUNPOD_API_KEY }});

async function launchPod() {{
  const pod = await runpod.createPod({{
    name: "{name}",
    imageName: "{image}",
    gpuTypeId: "{gpu}",
    containerDiskInGb: {disk},
    volumeInGb: 20,
    ports: "8000/http,22/tcp"
  }});

  console.log(`Pod Launched! ID: ${{pod.id}}`);
}}

launchPod();
"""
            curl = f"""curl -X POST https://api.runpod.io/graphql \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_RUNPOD_API_KEY" \\
  -d '{{"query": "mutation {{ podFindAndDeployOnDemand(input: {{ name: \\"{name}\\", imageName: \\"{image}\\", gpuTypeId: \\"{gpu}\\" }}) {{ id status }} }}"}}'"""

            description = "Deploys an on-demand GPU container pod with persistent volume and specified environment."

        elif action == "run_serverless":
            endpoint_id = params.get("endpoint_id", "ep-vllm-llama3")
            prompt = params.get("prompt", "Hello RunPod AI Serverless!")

            if lang == "python":
                code = f"""import runpod

runpod.api_key = "YOUR_RUNPOD_API_KEY"

endpoint = runpod.Endpoint("{endpoint_id}")

# Synchronous execution against serverless GPU cluster
run_request = endpoint.run_sync({{
    "input": {{
        "prompt": "{prompt}",
        "max_tokens": 256,
        "temperature": 0.7
    }}
}})

print("Result:", run_request)
"""
            else:
                code = f"""import RunPod from 'runpod-sdk';

const runpod = new RunPod({{ apiKey: process.env.RUNPOD_API_KEY }});
const endpoint = runpod.endpoint('{endpoint_id}');

async function runInference() {{
  const result = await endpoint.runSync({{
    input: {{
      prompt: "{prompt}",
      maxTokens: 256,
      temperature: 0.7
    }}
  }});

  console.log('Serverless Output:', result);
}}

runInference();
"""
            curl = f"""curl -X POST https://api.runpod.ai/v2/{endpoint_id}/runsync \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_RUNPOD_API_KEY" \\
  -d '{{"input": {{"prompt": "{prompt}"}}}}'"""

            description = "Executes an async or sync inference job against an autoscaling RunPod Serverless GPU endpoint."

        else:
            code = "# RunPod SDK Snippet Generator"
            curl = "curl https://api.runpod.io"
            description = "RunPod API operation snippet."

        return SDKCodeGenerateResponse(
            action=action,
            language=lang,
            code=code.strip(),
            description=description,
            curl_command=curl
        )

    # ------------------- Telemetry & Metrics -------------------

    def get_cluster_metrics(self) -> ClusterMetrics:
        pods = list(self._mock_pods.values())
        active_pods = [p for p in pods if p.status == "RUNNING"]
        total_vram = sum(p.vram_gb for p in active_pods)
        hourly_spend = sum(p.cost_per_hour for p in active_pods)

        return ClusterMetrics(
            active_pods=len(active_pods),
            active_serverless_endpoints=len(self._mock_endpoints),
            total_gpus_allocated=len(active_pods),
            total_vram_gb=total_vram if total_vram > 0 else 48,
            vram_used_gb=round(total_vram * 0.76, 1) if total_vram > 0 else 34.2,
            gpu_utilization_pct=78.5,
            hourly_spend_usd=round(hourly_spend, 2) if hourly_spend > 0 else 0.73,
            daily_forecast_usd=round(hourly_spend * 24, 2) if hourly_spend > 0 else 17.52,
            avg_serverless_latency_ms=850,
            mock_mode=self.mock_mode
        )

# Global singleton service
runpod_service = RunPodService()
