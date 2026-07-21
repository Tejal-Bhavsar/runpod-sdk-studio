from typing import List
from fastapi import APIRouter
from app.models.schemas import ServerlessEndpointInfo, ServerlessRunRequest, ServerlessRunResponse
from app.services.runpod_service import runpod_service

router = APIRouter(prefix="/api/serverless", tags=["Serverless"])

@router.get("/endpoints", response_model=List[ServerlessEndpointInfo])
def list_serverless_endpoints():
    """List active serverless GPU endpoints."""
    return runpod_service.get_serverless_endpoints()

@router.post("/run", response_model=ServerlessRunResponse)
async def run_serverless_endpoint(req: ServerlessRunRequest):
    """Execute synchronous inference request on RunPod Serverless GPU endpoint."""
    return await runpod_service.run_serverless_job(req)
