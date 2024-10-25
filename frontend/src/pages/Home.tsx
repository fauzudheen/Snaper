import React, { useState, useEffect } from 'react';
import { Trash2, Upload } from 'lucide-react';
import ImageUploadModal from '../components/ImageUploadModal';
import axiosInstance from '../utils/api/axiosInstance';
import { API_BASE_URL } from '../utils/api/urls';
import { Image } from '../types/types';

const Home: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/images/`);
      // Sort images by order when fetching
      const sortedImages = response.data.sort((a: Image, b: Image) => a.order - b.order);
      setImages(sortedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/images/${imageId}/`);
      
      // Remove the deleted image and update orders
      setImages((prevImages) => {
        const updatedImages = prevImages
          .filter((img) => img.id !== imageId)
          .map((img, index) => ({
            ...img,
            order: index + 1 // Update order based on array position
          }));
        
        updateImageOrders(updatedImages);
        
        return updatedImages;
      });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const updateImageOrders = async (updatedImages: Image[]) => {
    try {
      const orderUpdates = updatedImages.map((img) => ({
        id: img.id,
        order: img.order
      }));

      await axiosInstance.patch(`${API_BASE_URL}/images/update-orders/`, {
        images: orderUpdates
      });
    } catch (error) {
      console.error('Error updating image orders:', error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Image Gallery</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Upload className="w-5 h-5" />
            Add Images
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative group bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="relative aspect-square">
              <img src={image.image_file} alt={image.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-red-500 hover:bg-red-600 text-white p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{image.title}</h3>
              <p className="text-sm text-gray-500">Order: {index + 1}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Upload Images</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <ImageUploadModal
              onUploadSuccess={() => {
                fetchImages();
                setIsModalOpen(false);
              }}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;