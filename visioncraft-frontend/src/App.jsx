import React, { useState } from 'react';

export default function App() {
  // --- STATE HOOKS: Tracks user data inputs and reactive processing states ---
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [operation, setOperation] = useState('grayscale');
  const [thresh1, setThresh1] = useState(100);
  const [thresh2, setThresh2] = useState(200);
  const [isLoading, setIsLoading] = useState(false);

  // --- EVENT HANDLER: Captures the local image file upload ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Creates a temporary, local browser URL to display the input image immediately
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null); // Reset previous outputs
    }
  };

  // --- THE FULL-STACK GLUE: Packs and sends data across local network ports ---
  const processImageOnBackend = async () => {
    if (!imageFile) return alert("Please upload an image first!");

    setIsLoading(true); // Triggers loading spinner state

    try {
      // Create a multipart form payload (simulating an HTML form data bundle)
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("operation", operation);
      formData.append("threshold1", thresh1);
      formData.append("threshold2", thresh2);

      // Fetch across to your active FastAPI port
      const response = await fetch("http://localhost:8000/api/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Server processing matrix error.");

      // Read response directly as raw binary blob data (not JSON)
      const blob = await response.blob();
      // Translate the incoming byte stream into an active viewable image URL string
      const outputUrl = URL.createObjectURL(blob);
      
      setResultUrl(outputUrl); // Render output string to state
    } catch (error) {
      console.error(error);
      alert("Cannot connect to Python backend! Check if main.py terminal is running on port 8000.");
    } finally {
      setIsLoading(false); // Shuts off loading states
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6">
      
      {/* Header Container Layout */}
      <header className="max-w-6xl mx-auto border-b border-slate-800 pb-4 mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          VisionCraft Studio
        </h1>
        <p className="text-slate-400 text-sm mt-1">Full-Stack Computer Vision Platform</p>
      </header>

      {/* Main Studio Interactive Grid Dashboard */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* SIDEBAR: Configuration Control Panel Component */}
        <section className="md:col-span-1 bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Studio Controls</h2>
          
          {/* File input handler selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Upload Source</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
            />
          </div>

          {/* Filtering selection layout mapping */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Filter</label>
            <select 
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="grayscale">Grayscale Conversion</option>
              <option value="canny">Canny Edge Detection</option>
              <option value="sobel">Sobel Gradient Filter</option>
            </select>
          </div>

          {/* CONDITIONAL RENDERING HOOK: Edge detector parameters reveal exclusively for Canny */}
          {operation === 'canny' && (
            <div className="space-y-4 pt-2 border-t border-slate-700/50">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Low Threshold</span>
                  <span>{thresh1}</span>
                </div>
                <input type="range" min="0" max="255" value={thresh1} onChange={(e) => setThresh1(Number(e.target.value))} className="w-full accent-cyan-400" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>High Threshold</span>
                  <span>{thresh2}</span>
                </div>
                <input type="range" min="0" max="255" value={thresh2} onChange={(e) => setThresh2(Number(e.target.value))} className="w-full accent-cyan-400" />
              </div>
            </div>
          )}

          {/* Core Pipeline Network Action Activation Button */}
          <button 
            onClick={processImageOnBackend}
            disabled={isLoading || !imageFile}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing Matrix..." : "Apply Processing"}
          </button>
        </section>

        {/* WORKSPACE CANVAS VIEWS CONTAINER */}
        <section className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Input Source Visualizer Area */}
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[350px]">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Original Input</span>
            {previewUrl ? (
              <img src={previewUrl} alt="Original Input Display" className="max-h-[300px] object-contain rounded-lg border border-slate-700" />
            ) : (
              <p className="text-slate-500 text-sm">No source image selected</p>
            )}
          </div>

          {/* Processed Matrix Response Canvas Visualizer Area */}
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[350px] relative">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">AI / CV Output</span>
            
            {/* Condition 1: Fetching network pipeline is active */}
            {isLoading && (
              <div className="flex flex-col items-center space-y-2 animate-pulse">
                <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-cyan-400 text-xs font-medium">Running OpenCV on Server...</p>
              </div>
            )}

            {/* Condition 2: Server mapping output loop loaded */}
            {!isLoading && resultUrl && (
              <img src={resultUrl} alt="Processed Server Output Display" className="max-h-[300px] object-contain rounded-lg border border-slate-700" />
            )}

            {/* Condition 3: Idle starting state */}
            {!isLoading && !resultUrl && (
              <p className="text-slate-500 text-sm">Click "Apply Processing" to view filter</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
