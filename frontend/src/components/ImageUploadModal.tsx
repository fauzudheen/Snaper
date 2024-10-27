import React, { useState } from 'react';
import axiosInstance from '../utils/api/axiosInstance';
import { API_BASE_URL } from '../utils/api/urls';
import { Upload } from 'lucide-react';

interface ImageUpload {
  file: File;
  title: string;
}

interface ImageUploadModalProps {
  onUploadSuccess: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ onUploadSuccess, isOpen, onClose }) => {
  const [uploads, setUploads] = useState<ImageUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newUploads: ImageUpload[] = Array.from(files).map(file => ({ file, title: '' }));
      setUploads([...uploads, ...newUploads]);
    }
  };

  const handleTitleChange = (index: number, title: string) => {
    setUploads(prev =>
      prev.map((upload, i) => (i === index ? { ...upload, title } : upload))
    );
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      uploads.forEach((upload) => {
        formData.append('files', upload.file); // simpler structure
        formData.append('titles', upload.title);
      });
      await axiosInstance.post(`${API_BASE_URL}/images/upload-multiple/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploads([]);
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
    <div className="bg-white/95 backdrop-blur-md shadow-2xl w-full max-w-md flex flex-col h-[90vh] my-auto">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Upload Images</h2>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-6">
        <div className="relative mb-6">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileSelect} 
            className="hidden" 
            id="file-upload"
          />
          <label 
            htmlFor="file-upload" 
            className="cursor-pointer flex items-center justify-center w-full border-2 border-dashed border-gray-300 p-6 hover:border-snaper-red-500 transition-colors duration-300"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <span className="text-gray-600">Click to select images</span>
            </div>
          </label>
        </div>

        <div className="space-y-4 overflow-y-auto flex-1">
          {uploads.map((upload, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50">
              <img 
                src={URL.createObjectURL(upload.file)} 
                alt="Preview" 
                className="w-24 h-24 object-cover" 
              />
              <input
                type="text"
                placeholder="Enter image title"
                value={upload.title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                className="flex-1 border border-gray-300 p-2 focus:ring-2 focus:ring-snaper-red-500 focus:border-transparent outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-6">
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-100 border-2"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload} 
            disabled={isUploading} 
            className="bg-snaper-red-500 hover:bg-snaper-red-600 text-white px-6 py-2 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="animate-spin">↻</span>
                Uploading...
              </>
            ) : (
              'Upload All Images'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default ImageUploadModal;
