import time
import random
from datetime import datetime, timedelta, timezone
from typing import List
from fastapi import APIRouter, Query, HTTPException

from app.models.schemas import (
    ClusterMetrics, TelemetryPoint, TelemetryResponse,
    CostCalculatorRequest, CostCalculatorResponse
)
from app.services.runpod_service import runpod_service

router = APIRouter(prefix="/api/metrics", tags=["Telemetry & Observability"])

@router.get("", response_model=ClusterMetrics)
def get_metrics():
    """Retrieve aggregate cluster GPU metrics, active spend, and serverless latency stats."""
    return runpod_service.get_cluster_metrics()

@router.get("/telemetry", response_model=TelemetryResponse)
def get_pod_telemetry(pod_id: str = Query(..., description="ID of the pod to fetch telemetry for")):
    """Generates 10 historic time-series data points + latest metric updates for live charting."""
    pods = runpod_service.get_pods()
    pod = next((p for p in pods if p.id == pod_id), None)
    
    if not pod:
        raise HTTPException(status_code=404, detail="Pod not found")

    history = []
    base_time = datetime.now(timezone.utc)
    
    # Generate 10 consecutive ticks of telemetry history
    for i in range(10, 0, -1):
        tick_time = base_time - timedelta(seconds=i * 5)
        # Add slight variations to simulate active GPU workloads
        vram_used = round(pod.vram_gb * random.uniform(0.68, 0.88), 1) if pod.status == "RUNNING" else 0.0
        compute = round(random.uniform(65.0, 95.0), 1) if pod.status == "RUNNING" else 0.0
        temp = random.randint(60, 72) if pod.status == "RUNNING" else 35
        fan = random.randint(45, 65) if pod.status == "RUNNING" else 0
        net = round(random.uniform(5.5, 45.8), 1) if pod.status == "RUNNING" else 0.0

        history.append(TelemetryPoint(
            timestamp=tick_time.isoformat(),
            vram_used_gb=vram_used,
            vram_total_gb=float(pod.vram_gb),
            compute_load_pct=compute,
            temperature_c=temp,
            fan_speed_pct=fan,
            network_io_mbps=net
        ))

    return TelemetryResponse(
        pod_id=pod_id,
        pod_name=pod.name,
        gpu_type=pod.gpu_type_id,
        history=history
    )

@router.post("/calculator", response_model=CostCalculatorResponse)
def calculate_cost_savings(req: CostCalculatorRequest):
    """Calculates On-Demand vs Spot GPU cost breakdown & dollar savings percentage."""
    rates = {
        "NVIDIA RTX 4090": {"on_demand": 0.44, "spot": 0.19},
        "NVIDIA RTX 3090": {"on_demand": 0.29, "spot": 0.12},
        "NVIDIA A100 80GB SXM": {"on_demand": 1.89, "spot": 0.79},
        "NVIDIA H100 PCIe": {"on_demand": 2.69, "spot": 1.19},
        "NVIDIA L40S": {"on_demand": 0.99, "spot": 0.39}
    }
    
    selected_gpu = req.gpu_type_id if req.gpu_type_id in rates else "NVIDIA RTX 4090"
    rate_info = rates[selected_gpu]
    
    total_hours = req.gpu_count * req.hours_per_day * req.duration_days
    on_demand_total = round(total_hours * rate_info["on_demand"], 2)
    spot_total = round(total_hours * rate_info["spot"], 2)
    savings = round(on_demand_total - spot_total, 2)
    savings_pct = round((savings / on_demand_total) * 100, 1) if on_demand_total > 0 else 0.0
    
    return CostCalculatorResponse(
        gpu_type_id=selected_gpu,
        gpu_count=req.gpu_count,
        hours_per_day=req.hours_per_day,
        duration_days=req.duration_days,
        total_hours=total_hours,
        hourly_rate_on_demand=rate_info["on_demand"],
        hourly_rate_spot=rate_info["spot"],
        total_on_demand_usd=on_demand_total,
        total_spot_usd=spot_total,
        savings_usd=savings,
        savings_pct=savings_pct
    )
