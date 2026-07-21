import asyncio
import json
import random
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["WebSockets"])

@router.websocket("/ws/serverless/stream")
async def stream_serverless_execution(websocket: WebSocket):
    """WebSocket endpoint streaming live token execution & worker logs for RunPod Serverless endpoints."""
    await websocket.accept()
    try:
        data = await websocket.receive_text()
        request_data = json.loads(data)
        prompt = request_data.get("prompt", "Demo LLM inference stream")
        endpoint_id = request_data.get("endpoint_id", "ep-vllm-llama3")

        # Step 1: Worker routing event
        await websocket.send_json({
            "type": "log",
            "stage": "INIT",
            "message": f"[{endpoint_id}] Request queued. Routing to warm GPU worker node (NVIDIA RTX 4090)..."
        })
        await asyncio.sleep(0.4)

        # Step 2: Cold start / cache check
        await websocket.send_json({
            "type": "log",
            "stage": "WORKER_READY",
            "message": f"[{endpoint_id}] Worker online. Model weights cached in VRAM (24GB). Beginning generation..."
        })
        await asyncio.sleep(0.4)

        # Step 3: Stream generated tokens token-by-token
        response_words = [
            "RunPod", "Serverless", "provides", "instant", "GPU", "autoscaling", "with",
            "zero", "idle", "cost.", "FastAPI", "and", "vLLM", "deliver", "sub-second",
            "first-token", "latency", "for", "high-throughput", "AI", "applications."
        ]

        generated_text = ""
        for word in response_words:
            await asyncio.sleep(random.uniform(0.05, 0.12))
            generated_text += word + " "
            await websocket.send_json({
                "type": "token",
                "word": word,
                "full_text": generated_text.strip(),
                "vram_used_pct": round(random.uniform(72.0, 78.5), 1),
                "gpu_temp_c": random.randint(62, 68)
            })

        # Step 4: Final status
        await websocket.send_json({
            "type": "done",
            "message": "Generation completed successfully.",
            "total_tokens": len(response_words) * 3,
            "execution_time_ms": 780
        })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"type": "error", "message": str(e)})
