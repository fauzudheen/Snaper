import { Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Image } from '../types/types';
import axiosInstance from '../utils/api/axiosInstance';
import { API_BASE_URL } from '../utils/api/urls';

interface EditImageModalProps {
        image?: Image;
        isOpen: boolean;
        onClose: () => void;
        onSuccess: () => void;
    }

const EditImageModal: React.FC<EditImageModalProps> = ({isOpen, onClose, onSuccess: onEditSuccess, image}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
  
    useEffect(() => {
        if (image) {
          setTitle(image.title);
          setPreviewUrl(image.image_file);
        }
      }, [image]);

      useEffect(() => {
        if (file) {
          const objectUrl = URL.createObjectURL(file);
          setPreviewUrl(objectUrl);
    
          // Clean up the URL when component unmounts or file changes
          return () => URL.revokeObjectURL(objectUrl);
        }
      }, [file]);
    
      if (!isOpen || !image) return null;
    
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
          setFile(selectedFile);
        }
      };

    const handleSubmit = async () => {
      setIsEditing(true);
      try {
        const formData = new FormData();
        
        if (title !== image.title) {
            formData.append('title', title);
          }

        if (file) {
          formData.append('image_file', file);
        }
        
        if (formData.has('title') || formData.has('image_file')) {
            await axiosInstance.patch(`${API_BASE_URL}/images/${image.id}/`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            onEditSuccess();
          }
          onClose();
          
      } catch (error) {
        console.error('Error uploading images:', error);
      } finally {
        setIsEditing(false);
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div className="bg-white/95 backdrop-blur-md p-8 shadow-2xl w-full max-w-md mx-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Image</h2>
      
      <div className="relative mb-6">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="hidden" 
          id="file-upload"
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer flex items-center justify-center w-full border-2 border-dashed border-gray-300 p-6 hover:border-snaper-red-500 transition-colors duration-300"
        >
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <span className="text-gray-600">Click to select new image</span>
          </div>
        </label>
      </div>
  
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
          <div className="flex items-center gap-4 p-4 bg-gray-50">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-24 h-24 object-cover" 
            />
            <input
              type="text"
              placeholder="Enter image title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border border-gray-300 p-2 focus:ring-2 focus:ring-snaper-red-500 focus:border-transparent outline-none"
            />
          </div>
      </div>
  
      <div className="flex justify-end gap-3 mt-6">
        <button 
          onClick={onClose} 
          className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-100 border-2 "
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={isEditing} 
          className="bg-snaper-red-500 hover:bg-snaper-red-600 text-white px-6 py-2 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <span className="animate-spin">↻</span>
              Editing...
            </>
          ) : (
            'Save Changes' 
          )}
        </button>
      </div>
    </div>
  </div>
    );
  };

export default EditImageModal
