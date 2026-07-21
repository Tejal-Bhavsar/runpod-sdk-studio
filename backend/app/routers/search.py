from typing import List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter(prefix="/api/search", tags=["Search API & Docs"])

class SearchResultItem(BaseModel):
    id: str
    title: str
    category: str  # "API Endpoint" | "SDK Method" | "GPU Hardware" | "Documentation"
    description: str
    badge: Optional[str] = None
    target_tab: Optional[str] = None  # "pods" | "serverless" | "sdk" | "docs"
    direct_url: Optional[str] = None
    snippet: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[SearchResultItem]

SEARCH_INDEX: List[SearchResultItem] = [
    # API Endpoints (Deep linked directly to OpenAPI /docs anchors)
    SearchResultItem(
        id="api-get-pods",
        title="GET /api/pods",
        category="API Endpoint",
        description="Retrieve all active, stopped, and terminating GPU Pod instances.",
        badge="REST API",
        target_tab="pods",
        direct_url="/docs#/Pods/list_pods_api_pods_get",
        snippet="curl -X GET http://localhost:8000/api/pods"
    ),
    SearchResultItem(
        id="api-post-pods",
        title="POST /api/pods",
        category="API Endpoint",
        description="Deploy a new on-demand GPU Pod instance with custom Docker image.",
        badge="REST API",
        target_tab="pods",
        direct_url="/docs#/Pods/create_pod_api_pods_post",
        snippet="curl -X POST http://localhost:8000/api/pods -H 'Content-Type: application/json' -d '{\"name\":\"worker\"}'"
    ),
    SearchResultItem(
        id="api-serverless-run",
        title="POST /api/serverless/run",
        category="API Endpoint",
        description="Execute synchronous inference requests against RunPod Serverless GPU endpoints.",
        badge="REST API",
        target_tab="serverless",
        direct_url="/docs#/Serverless/run_serverless_endpoint_api_serverless_run_post",
        snippet="curl -X POST http://localhost:8000/api/serverless/run"
    ),
    SearchResultItem(
        id="api-ws-stream",
        title="WS /ws/serverless/stream",
        category="API Endpoint",
        description="WebSocket endpoint streaming token generation logs & worker telemetry.",
        badge="WebSocket",
        target_tab="serverless",
        direct_url="/docs#/WebSockets/stream_serverless_execution_ws_serverless_stream_get",
        snippet="ws://localhost:8000/ws/serverless/stream"
    ),

    # SDK Methods
    SearchResultItem(
        id="sdk-create-pod",
        title="runpod.create_pod()",
        category="SDK Method",
        description="Python SDK helper to deploy on-demand or spot GPU container instances.",
        badge="Python SDK",
        target_tab="sdk",
        direct_url="https://docs.runpod.io/sdks/python/overview",
        snippet="runpod.create_pod(name='my-pod', gpu_type_id='NVIDIA RTX 4090')"
    ),
    SearchResultItem(
        id="sdk-endpoint-run",
        title="endpoint.run_sync()",
        category="SDK Method",
        description="Python SDK method to trigger serverless LLM/SDXL inference execution.",
        badge="Python SDK",
        target_tab="sdk",
        direct_url="https://docs.runpod.io/serverless/endpoints/manage-endpoints",
        snippet="endpoint = runpod.Endpoint('ep-vllm')\nres = endpoint.run_sync({'input': {'prompt': 'hello'}})"
    ),
    SearchResultItem(
        id="sdk-ts-create-pod",
        title="runpod.createPod()",
        category="SDK Method",
        description="TypeScript SDK method to manage cloud GPU infrastructure.",
        badge="TypeScript SDK",
        target_tab="sdk",
        direct_url="https://docs.runpod.io/sdks/typescript/overview",
        snippet="const pod = await runpod.createPod({ name: 'my-pod' });"
    ),

    # GPU Hardware Specs
    SearchResultItem(
        id="gpu-h100",
        title="NVIDIA H100 PCIe (80GB VRAM)",
        category="GPU Hardware",
        description="Ultra high-throughput Hopper architecture GPU for large model inference & fine-tuning ($2.69/hr).",
        badge="80GB VRAM",
        target_tab="pods",
        direct_url="https://www.runpod.io/gpu-instance/pricing",
        snippet="Cost: $2.69/hr (~$64.56/day)"
    ),
    SearchResultItem(
        id="gpu-a100",
        title="NVIDIA A100 80GB SXM",
        category="GPU Hardware",
        description="Enterprise standard GPU for distributed AI training and high-concurrency serverless ($1.89/hr).",
        badge="80GB VRAM",
        target_tab="pods",
        direct_url="https://www.runpod.io/gpu-instance/pricing",
        snippet="Cost: $1.89/hr (~$45.36/day)"
    ),
    SearchResultItem(
        id="gpu-4090",
        title="NVIDIA RTX 4090 (24GB VRAM)",
        category="GPU Hardware",
        description="High single-card efficiency for vLLM serverless workers and medium model serving ($0.44/hr).",
        badge="24GB VRAM",
        target_tab="pods",
        direct_url="https://www.runpod.io/gpu-instance/pricing",
        snippet="Cost: $0.44/hr (~$10.56/day)"
    ),

    # Documentation & Guides
    SearchResultItem(
        id="doc-openapi-swagger",
        title="Interactive OpenAPI / Swagger Specification",
        category="Documentation",
        description="Full REST & WebSocket API specification with interactive endpoint testing UI.",
        badge="API Specs",
        target_tab="docs",
        direct_url="/docs",
        snippet="URL: http://localhost:8000/docs"
    ),
    SearchResultItem(
        id="doc-vllm-autoscaling",
        title="vLLM Serverless Autoscaling & Cold-Starts Guide",
        category="Documentation",
        description="Best practices for optimizing model weight caching, worker idle timeouts, and sub-second cold starts.",
        badge="Guide",
        target_tab="serverless",
        direct_url="https://docs.runpod.io/serverless/vllm",
        snippet="Learn how RunPod pre-warms containers using persistent Network Volumes."
    )
]

@router.get("", response_model=SearchResponse)
def search_api_and_docs(q: str = Query("", description="Query text to search across API, SDK, GPUs, and Docs")):
    """Fast search endpoint indexing REST APIs, WebSockets, Python/TS SDKs, and GPU hardware."""
    if not q or not q.strip():
        return SearchResponse(query="", total_results=len(SEARCH_INDEX), results=SEARCH_INDEX[:6])

    q_lower = q.lower().strip()
    matches = []

    for item in SEARCH_INDEX:
        if (
            q_lower in item.title.lower() or
            q_lower in item.description.lower() or
            q_lower in item.category.lower() or
            (item.badge and q_lower in item.badge.lower()) or
            (item.snippet and q_lower in item.snippet.lower())
        ):
            matches.append(item)

    return SearchResponse(query=q, total_results=len(matches), results=matches)
