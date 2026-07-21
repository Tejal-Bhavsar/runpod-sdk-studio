from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_get_gpus():
    response = client.get("/api/gpus")
    assert response.status_code == 200
    gpus = response.json()
    assert len(gpus) > 0
    assert "NVIDIA RTX 4090" in [g["name"] for g in gpus]

def test_get_pods():
    response = client.get("/api/pods")
    assert response.status_code == 200
    pods = response.json()
    assert isinstance(pods, list)

def test_create_pod():
    payload = {
        "name": "test-vllm-pod",
        "image_name": "runpod/vllm:latest",
        "gpu_type_id": "NVIDIA RTX 4090",
        "container_disk_in_gb": 50,
        "volume_in_gb": 20,
        "ports": "8000/http,22/tcp"
    }
    response = client.post("/api/pods", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "test-vllm-pod"
    assert data["status"] == "RUNNING"

def test_generate_sdk_code():
    payload = {
        "action": "create_pod",
        "parameters": {"name": "demo-pod", "gpu_type_id": "NVIDIA RTX 4090"},
        "language": "python"
    }
    response = client.post("/api/sdk/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "import runpod" in data["code"]
