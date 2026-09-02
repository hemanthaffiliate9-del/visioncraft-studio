# VisionCraft Studio 🚀 | Full-Stack Computer Vision & AI Analytics Platform

An enterprise-grade, decoupled full-stack web application designed for real-time digital image processing and neural network-based object detection. 

Rather than executing basic client-side image filter modifications, this architecture implements a high-performance decoupled pipeline: linking an asynchronous **React** user interface to a custom **Python (FastAPI)** matrix manipulation engine over independent network ports.

---

## 🎨 Core Layout & System User Experience
* **Interactive Control Grid:** Designed with a clean, responsive dark-themed workspace dashboard utilizing **Tailwind CSS (v4)** formatting metrics.
* **Reactive Parameter Toggles:** Leverages **React State Hooks (`useState`)** to inject context-specific controls (such as Canny edge coefficient sliders) dynamically based on the active user selection.
* **State-Tracked Canvas:** Features asynchronous loading placeholders and a dual-canvas render view to display live input-to-output asset streaming.

---

## 🏗️ Technical System Architecture & Network Flow

```text
[React UI Dashboard]  ---- (HTTP POST Multipart Payload) ---->  [FastAPI Engine: Port 8000]
 (Port 5173 - Client)                                                    |
         ^                                                      (Execute Model/Matrix)

         |                                                               |
  (Render Blob URL)  <---- (Binary Memory Byte Stream) <-----------------+
```

### The 4-Stage Core Processing Pipeline:
1. **Payload Marshal:** The client interfaces package file data streams and control coefficients natively into a unified `FormData` package.
2. **Asynchronous Request Pipe:** JavaScript initiates a non-blocking network payload pipeline across the local runtime machine directly hitting target API backend endpoints.
3. **In-Memory Transformation:** The Python backend intercepts the stream, passes the buffer down to a **Pillow Image conversion module**, and casts it instantly into a multi-dimensional **NumPy array matrix** for zero-latency **OpenCV execution**—negating disk-write bottlenecks.
4. **Binary Return Lifecycle:** The engine wraps the modified matrix arrays inside a high-speed `StreamingResponse` stream, which React intercepts as an active file object via `URL.createObjectURL(blob)`.

---

## 🛠️ Specialized Technical Stack

### Frontend Application
* **React Engine:** Modular component mapping featuring custom tracking hooks, event handlers, and strict conditional rendering states.
* **Tailwind CSS v4:** Optimized utility layout orchestration running via compilation-native styling layers.

### Backend Infrastructure
* **FastAPI:** Scalable, asynchronous Python gateway mapping high-efficiency Cross-Origin Resource Sharing (CORS) configurations.
* **OpenCV (cv2) & NumPy:** Server-side computational imaging algorithms handling channel remapping (RGB-to-BGR tracking) and derivative edge calculations.
* **Ultralytics YOLO:** Pre-trained Convolutional Neural Network (CNN) integration used to draw bounding boxes and overlay precision labels on real-world target assets.

---

## 🚦 Local Setup & Activation Roadmap

### 1. Initialize Engine (Backend)
Navigate to the backend system directory, install processing toolchains, and turn on the server:
```bash
cd visioncraft-backend
python -m pip install fastapi uvicorn python-multipart opencv-python numpy pillow ultralytics
python main.py
```
*Backend runs natively on: `http://localhost:8000`*

### 2. Initialize Studio Dashboard (Frontend)
Open a new console window, build package footprints, and start Vite:
```bash
cd visioncraft-frontend
npm install
npm run dev
```
*Frontend runs natively on: `http://localhost:5173`*
