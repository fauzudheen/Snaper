import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Image as ImageType } from '../types/types';
import { useDrag, useDrop } from 'react-dnd'

type ImageProps = {
    image: ImageType
    index: number
    handleDeleteImage: (imageId: number) => void
    EditImageClick: (imageId: number) => void
    moveImage: (dragIndex: number, hoverIndex: number) => void
}
const ImageCard: React.FC<ImageProps> = ({ image, index, handleDeleteImage, EditImageClick, moveImage }: ImageProps) => {
  const [{isDragging}, drag] = useDrag({
    type: 'IMAGE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'IMAGE',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveImage(item.index, index)
        item.index = index
      }
    },
  })

  return (
    <div
    ref={(node) => drag(drop(node))}
    className={`relative group bg-white/90 backdrop-blur-sm overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full ${isDragging ? 'opacity-50' : ''}`}
>
    <div className="w-full relative pb-[100%]">
        <img 
            src={image.image_file} 
            alt={image.title} 
            className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute gap-2 inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <button
                onClick={() => handleDeleteImage(image.id)}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-snaper-red-500 hover:bg-snaper-red-600 text-white p-3 transform hover:scale-105"
            >
                <Trash2 className="w-5 h-5" />
            </button>
            <button
                onClick={() => EditImageClick(image.id)}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-yellow-500 hover:bg-yellow-600 text-white p-3 transform hover:scale-105"
            >
                <Pencil className="w-5 h-5" />
            </button>
        </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white/90 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{image.title}</h3>
        <p className="text-sm text-gray-500 mt-1">Order: {index + 1}</p>
    </div>
</div>
  )
}

export default ImageCard
