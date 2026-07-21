from fastapi import APIRouter
from app.models.schemas import SDKCodeGenerateRequest, SDKCodeGenerateResponse
from app.services.runpod_service import runpod_service

router = APIRouter(prefix="/api/sdk", tags=["SDK Studio"])

@router.post("/generate", response_model=SDKCodeGenerateResponse)
def generate_sdk_code_snippet(req: SDKCodeGenerateRequest):
    """Generate production-ready Python & TypeScript RunPod SDK code snippets dynamically."""
    return runpod_service.generate_sdk_code(req)
