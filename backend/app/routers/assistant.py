import time
import random
from typing import List, Optional, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/assistant", tags=["Ask RunPod AI"])

class AssistantRequest(BaseModel):
    question: str = Field(..., example="How do I deploy vLLM on RunPod serverless?")

class AssistantResponse(BaseModel):
    answer: str
    code_snippet: Optional[str] = None
    language: Optional[str] = "python"
    suggested_actions: List[str] = []
    gpu_recommendation: Optional[str] = None

RUNPOD_KNOWLEDGE_BASE = [
    {
        "keywords": ["vllm", "serverless", "llm", "llama", "deepseek", "inference"],
        "answer": "RunPod Serverless allows you to host open-source LLMs (like Llama-3, DeepSeek, or Mistral) using vLLM containers with instant autoscaling and zero idle cost. You can dispatch requests via sync or async API calls using the `runpod-python` SDK.",
        "code_snippet": """import runpod

runpod.api_key = "YOUR_RUNPOD_API_KEY"
endpoint = runpod.Endpoint("ep-vllm-llama3")

# Dispatch serverless inference job
job = endpoint.run_sync({
    "input": {
        "prompt": "Explain RAG architecture on RunPod",
        "max_tokens": 256
    }
})

print("Output:", job)""",
        "language": "python",
        "suggested_actions": ["Test Serverless Endpoint", "View vLLM Templates"],
        "gpu_recommendation": "NVIDIA RTX 4090 (24GB) or NVIDIA L40S (48GB)"
    },
    {
        "keywords": ["cost", "price", "pricing", "gpu", "h100", "a100", "4090", "cheap"],
        "answer": "RunPod offers competitive hourly rates across On-Demand and Spot instances. Here is a quick breakdown:\n\n• NVIDIA RTX 4090 (24GB VRAM): $0.44/hr\n• NVIDIA RTX 3090 (24GB VRAM): $0.29/hr\n• NVIDIA L40S (48GB VRAM): $0.99/hr\n• NVIDIA A100 80GB SXM: $1.89/hr\n• NVIDIA H100 PCIe (80GB VRAM): $2.69/hr\n\nSpot instances offer up to 60% savings for fault-tolerant workloads.",
        "code_snippet": None,
        "language": "python",
        "suggested_actions": ["Deploy On-Demand Pod", "Calculate Monthly Spend"],
        "gpu_recommendation": "NVIDIA RTX 3090 for budget; NVIDIA H100 for enterprise throughput."
    },
    {
        "keywords": ["sdk", "python", "typescript", "api", "client", "install"],
        "answer": "You can integrate with RunPod's platform using our official open-source SDKs:\n\n🐍 Python SDK: `pip install runpod`\n🔷 TypeScript SDK: `npm install runpod-sdk`\n\nOur SDKs provide high-level abstractions for Pod provisioning, Serverless job execution, volume management, and telemetry.",
        "code_snippet": """import runpod

# Initialize RunPod Client
runpod.api_key = "YOUR_RUNPOD_API_KEY"

# Create On-Demand Pod
pod = runpod.create_pod(
    name="my-ai-worker",
    image_name="runpod/vllm:latest",
    gpu_type_id="NVIDIA RTX 4090",
    container_disk_in_gb=50
)""",
        "language": "python",
        "suggested_actions": ["Open SDK Generator", "View GitHub SDK Repo"],
        "gpu_recommendation": None
    },
    {
        "keywords": ["volume", "storage", "disk", "network", "checkpoint", "dataset"],
        "answer": "RunPod Network Volumes are persistent storage volumes mounted directly to your GPU Pods. They persist across pod restarts, allowing you to cache model weights (e.g. HuggingFace models), dataset files, and LoRA checkpoints without re-downloading.",
        "code_snippet": None,
        "language": "python",
        "suggested_actions": ["Mount Network Volume", "View Pod Manager"],
        "gpu_recommendation": None
    }
]

@router.post("/ask", response_model=AssistantResponse)
def ask_runpod_ai(req: AssistantRequest):
    """AI Assistant endpoint for answering RunPod cloud & SDK queries."""
    q_lower = req.question.lower()

    for kb in RUNPOD_KNOWLEDGE_BASE:
        if any(kw in q_lower for kw in kb["keywords"]):
            return AssistantResponse(
                answer=kb["answer"],
                code_snippet=kb["code_snippet"],
                language=kb["language"],
                suggested_actions=kb["suggested_actions"],
                gpu_recommendation=kb.get("gpu_recommendation")
            )

    # General Fallback Response
    return AssistantResponse(
        answer=f"I can help you deploy GPU Pods, optimize Serverless cold-starts, calculate compute costs, or generate Python/TypeScript SDK snippets!\n\nYou asked: '{req.question}'. What specifically would you like to build or configure on RunPod?",
        code_snippet="""import runpod

runpod.api_key = "YOUR_RUNPOD_API_KEY"
print("RunPod AI Assistant Ready!")""",
        language="python",
        suggested_actions=["Deploy On-Demand Pod", "Test Serverless Endpoint", "Generate SDK Code"],
        gpu_recommendation="NVIDIA RTX 4090 (24GB VRAM)"
    )
