import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image

app = FastAPI(title="VisionCraft AI Engine")

# CORS Setup: Allows your React frontend (port 5173) to securely communicate with this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/process")
async def process_image(
    file: UploadFile = File(...),
    operation: str = Form(...),
    threshold1: int = Form(100),
    threshold2: int = Form(200)
):
    # 1. Read the uploaded file bytes from the network request
    contents = await file.read()
    
    # 2. Convert binary bytes into a Pillow Image, then transform it into a NumPy matrix for OpenCV
    pil_image = Image.open(BytesIO(contents)).convert("RGB")
    open_cv_image = np.array(pil_image)
    
    # Convert RGB (Pillow format) to BGR (OpenCV standard format)
    open_cv_image = cv2.cvtColor(open_cv_image, cv2.COLOR_RGB2BGR)

    # 3. Apply your core Image Processing pixel matrix manipulations
    if operation == "grayscale":
        processed = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
        
    elif operation == "canny":
        gray = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
        processed = cv2.Canny(gray, threshold1, threshold2)
        
    elif operation == "sobel":
        gray = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
        sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        combined = cv2.magnitude(sobelx, sobely)
        # Convert matrix depth back to 8-bit image scale (0-255)
        processed = np.uint8(np.clip(combined, 0, 255))
        
    else:
        processed = open_cv_image # Fallback safety

    # 4. Encode the finished NumPy array matrix back into standard JPEG bytes
    is_success, buffer = cv2.imencode(".jpg", processed)
    io_buf = BytesIO(buffer)

    # 5. Stream the raw image binary bytes right back to the React UI
    return StreamingResponse(io_buf, media_type="image/jpeg")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
