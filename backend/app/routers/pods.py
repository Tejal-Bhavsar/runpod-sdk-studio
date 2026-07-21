from typing import List
from fastapi import APIRouter, HTTPException, Path
from app.models.schemas import GPUInfo, PodResponse, PodCreateRequest
from app.services.runpod_service import runpod_service

router = APIRouter(prefix="/api", tags=["Pods"])

@router.get("/gpus", response_model=List[GPUInfo])
def list_available_gpus():
    """List all available GPU hardware types on RunPod catalog."""
    return runpod_service.get_gpus()

@router.get("/pods", response_model=List[PodResponse])
def list_pods():
    """List active and stopped GPU Pods."""
    return runpod_service.get_pods()

@router.post("/pods", response_model=PodResponse, status_code=201)
def create_pod(req: PodCreateRequest):
    """Deploy a new GPU Pod instance."""
    return runpod_service.create_pod(req)

@router.post("/pods/{pod_id}/{action}", response_model=PodResponse)
def pod_action(
    pod_id: str = Path(..., description="ID of the pod"),
    action: str = Path(..., description="Action: start | stop | terminate")
):
    """Trigger lifecycle action on a GPU Pod (start/stop/terminate)."""
    if action not in ["start", "stop", "terminate"]:
        raise HTTPException(status_code=400, detail="Action must be start, stop, or terminate")

    res = runpod_service.toggle_pod_status(pod_id, action)
    if res is None and action != "terminate":
        raise HTTPException(status_code=404, detail="Pod not found")
    return res if res else PodResponse(
        id=pod_id, name="Deleted", image_name="", gpu_type_id="", status="TERMINATED",
        cost_per_hour=0, vram_gb=0, container_disk_in_gb=0, volume_in_gb=0, ports="", created_at=""
    )
