from fastapi import APIRouter
from app.models.schemas import ClusterMetrics
from app.services.runpod_service import runpod_service

router = APIRouter(prefix="/api/metrics", tags=["Telemetry & Observability"])

@router.get("", response_model=ClusterMetrics)
def get_metrics():
    """Retrieve aggregate cluster GPU metrics, active spend, and serverless latency stats."""
    return runpod_service.get_cluster_metrics()
