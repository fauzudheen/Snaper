import React, { useCallback } from 'react'
import ImageCard from './ImageCard'
import { Image } from '../types/types'

interface ImageProps {
    images: Image[]
    handleDeleteImage: (imageId: number) => void
    EditImageClick: (imageId: number) => void
    handleReorder: (images: Image[]) => void
}
const Grid = ({images, handleDeleteImage, EditImageClick, handleReorder}: ImageProps) => {
    const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
        const draggedImage = images[dragIndex]
        const newImages = [...images]
        newImages.splice(dragIndex, 1)
        newImages.splice(hoverIndex, 0, draggedImage)
        handleReorder(newImages)

        const updatedImages = newImages.map((image, index) => ({
            ...image,
            order: index + 1
        }))

        handleReorder(updatedImages)
    }, [images, handleReorder])

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
    {images.map((image, index) => (
        <ImageCard 
            key={image.id} 
            image={image} 
            index={index} 
            handleDeleteImage={handleDeleteImage} 
            EditImageClick={EditImageClick}
            moveImage={moveImage}
        />
    ))}
</div>

  )
}

export default Grid
