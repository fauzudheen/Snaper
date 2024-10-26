import React, { useState, useEffect } from 'react';
import { Trash2, Upload } from 'lucide-react';
import ImageUploadModal from '../components/ImageUploadModal';
import axiosInstance from '../utils/api/axiosInstance';
import { API_BASE_URL } from '../utils/api/urls';
import { Image } from '../types/types';
import Grid from '../components/Grid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EditImageModal from '../components/EditImageModal';

const Home: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [imageToEdit, setImageToEdit] = useState<Image>();

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
      
      setImages((prevImages) => {
        const updatedImages = prevImages
          .filter((img) => img.id !== imageId)
          .map((img, index) => ({
            ...img,
            order: index + 1 
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

  const handleReorder = (newImages: Image[]) => {
    setImages(newImages);
    updateImageOrders(newImages);
  }

  const EditImageClick = (imageId: number) => {
    setImageToEdit(images.find((image) => image.id === imageId));
    setIsEditModalOpen(true);
  }

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="min-h-screen bg-snaper-red-500 p-6">
    <div className="max-w-7xl mx-auto mb-8">
      <div className="backdrop-blur-md bg-white/10 p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Image Gallery</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white text-snaper-red-500 px-6 py-2 transition-all duration-200 hover:bg-opacity-90 shadow-sm hover:shadow-md"
          >
            <Upload className="w-5 h-5" />
            Add Images
          </button>
        </div>
      </div>
    </div>

        <div className="backdrop-blur-md bg-white/10 p-6 shadow-lg">
          <Grid images={images} handleDeleteImage={handleDeleteImage} EditImageClick={EditImageClick} handleReorder={handleReorder}/>
        </div>
        {isModalOpen && (
          <ImageUploadModal
            onUploadSuccess={() => {
              fetchImages();
              setIsModalOpen(false);
            }}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {isEditModalOpen && (
          <EditImageModal
            image={imageToEdit}
            onSuccess={() => {
              fetchImages();
              setIsEditModalOpen(false);
            }}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}  
      </div>
    </DndProvider>
  );
};

export default Home;