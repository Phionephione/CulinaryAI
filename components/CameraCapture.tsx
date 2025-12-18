
import React, { useRef, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      onCapture(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
        dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:bg-white'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-camera text-3xl"></i>
        </div>
        <div>
          <h4 className="text-xl font-bold text-slate-700">Snap a Photo</h4>
          <p className="text-slate-500 mt-2">Click to take a picture or drag and drop your fridge photo here</p>
        </div>
        <div className="flex justify-center space-x-4 pt-4">
          <div className="flex items-center text-xs text-slate-400 font-bold uppercase">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
            Vision Pro Enabled
          </div>
          <div className="flex items-center text-xs text-slate-400 font-bold uppercase">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
            OCR Active
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
