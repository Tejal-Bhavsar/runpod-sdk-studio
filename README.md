# ⚡ RunPod SDK Studio & Serverless Playground

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A full-stack developer workbench and SDK playground engineered specifically for **RunPod’s AI cloud platform**. This application provides an interactive control plane for GPU Pod management, real-time serverless inference token streaming via WebSockets, and a visual code generator for the `runpod-python` & TypeScript SDKs.

---

## 🎯 Full-Stack Role Alignment Highlights (RunPod Engineering)

This repository directly demonstrates key responsibilities outlined in the **Software Engineer (Full-Stack)** role at **RunPod**:

1. **Python & FastAPI Backend Architecture**: Clean REST APIs, strict Pydantic v2 schemas, and async WebSocket streaming for low-latency telemetry.
2. **TypeScript & React Frontend Experience**: High-performance dark glassmorphic UI matching RunPod's design aesthetic, responsive GPU cards, and live metric feeds.
3. **SDK Support & Open-Source Tools**: Includes an interactive **SDK Code Generator** and an extended open-source Python utility package (`runpod_plus`) with auto-retries, batching, and cost calculators.
4. **Dual Engine (Mock & Live API)**: Evaluators can run the full platform out-of-the-box in **Mock Cloud Mode** without needing API credits, or connect a live `RUNPOD_API_KEY`.

---

## 🚀 Key Features

### 1. 🖥️ GPU Pod Configurator & Lifecycle Control
- Interactive hardware selector across **NVIDIA H100 PCIe, A100 80GB, RTX 4090, and L40S**.
- Real-time VRAM allocation calculations and hourly spend forecasting.
- One-click pod lifecycle actions (`Start`, `Stop`, `Terminate`).

### 2. ⚡ Serverless Endpoint Studio & WebSocket Log Streamer
- Real-time token streaming over WebSockets simulating vLLM and SDXL inference output.
- Telemetry timeline displaying worker cold-start latency (`ms`) and VRAM thermal metrics.

### 3. 🛠️ Interactive RunPod SDK Code Generator
- Visually configure pod deployments or serverless requests and instantly receive copy-paste ready code in:
  - 🐍 **Python (`runpod-python`)**
  - 🔷 **TypeScript (`runpod-sdk`)**
  - 🌐 **cURL API Request**

### 4. 📦 Extended Open-Source SDK (`sdk_extension/runpod_plus`)
- `batch_run_serverless()`: Concurrently dispatches inference prompts with semaphore concurrency limits.
- `calculate_cost()`: Computes GPU compute cost estimates across hardware tiers.
- `wait_for_pod_ready()`: Polls RunPod API until GPU pods reach active status.

---

## 🛠️ Tech Stack & Architecture

```
runpod-sdk-studio/
├── backend/                  # Python 3.11 + FastAPI + Pydantic v2
│   ├── app/
│   │   ├── main.py           # Application entrypoint & CORS middleware
│   │   ├── config.py         # Settings & Environment bindings
│   │   ├── models/           # Pydantic schemas (Pods, Endpoints, Metrics)
│   │   ├── services/         # RunPod SDK wrapper & Mock Cloud Engine
│   │   ├── routers/          # REST Endpoints (/api/pods, /api/serverless, /api/sdk)
│   │   └── websockets/       # WebSocket streamer for serverless logs
│   ├── tests/                # Pytest unit test suite
│   └── Dockerfile
├── frontend/                 # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # Header, ClusterStats, PodManager, ServerlessStudio, SDKPlayground
│   │   ├── index.css         # RunPod Dark Glassmorphism Design System
│   │   ├── types.ts          # TypeScript interfaces
│   │   └── App.tsx
│   └── Dockerfile
├── sdk_extension/            # Python utility package (runpod_plus)
└── docker-compose.yml        # Orchestration
```

---

## 🏁 Quick Start Guide

### Option 1: Running with Python & Node (Local Development)

#### 1. Backend Setup (FastAPI)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Run server (starts on http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install

# Run Vite dev server (starts on http://localhost:5173)
npm run dev
```

---

### Option 2: Running with Docker Compose
```bash
docker-compose up --build
```
Access the application at `http://localhost:5173`.

---

## 🧪 Running Unit Tests

```bash
cd backend
pytest
```

---

## 📄 License & Attribution
Designed and built by **Tejal Bhavsar** for the RunPod Software Engineer (Full-Stack) application.
