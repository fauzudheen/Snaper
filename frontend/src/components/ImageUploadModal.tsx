import React, { useState } from 'react';
import axiosInstance from '../utils/api/axiosInstance';
import { API_BASE_URL } from '../utils/api/urls';

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
      uploads.forEach((upload, index) => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Upload Images</h2>
        <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="mb-4" />
        {uploads.map((upload, index) => (
          <div key={index} className="flex items-center gap-4">
            <img src={URL.createObjectURL(upload.file)} alt="Preview" className="w-24 h-24" />
            <input
              type="text"
              placeholder="Enter image title"
              value={upload.title}
              onChange={(e) => handleTitleChange(index, e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        ))}
        <button onClick={handleUpload} disabled={isUploading} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
          {isUploading ? 'Uploading...' : 'Upload All Images'}
        </button>
        <button onClick={onClose} className="ml-2 text-gray-500">Cancel</button>
      </div>
    </div>
  );
};

export default ImageUploadModal;
