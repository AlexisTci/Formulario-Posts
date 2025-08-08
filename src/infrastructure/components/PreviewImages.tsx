import React, { useEffect, useState } from 'react';

interface ExistingImage {
  id?: string;
  path_img: string;
}

interface PreviewImagesProps {
  existingImages: ExistingImage[];
  newImages: File[];
  setExistingImages: React.Dispatch<React.SetStateAction<ExistingImage[]>>;
  setNewImages: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function PreviewImages({
  existingImages,
  newImages,
  setExistingImages,
  setNewImages,
}: PreviewImagesProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const existingPreviews = existingImages.map(img => img.path_img);
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setPreviewUrls([...existingPreviews, ...newPreviews]);

    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [existingImages, newImages]);

  const handleRemove = (index: number) => {
    if (index < existingImages.length) {
      // eliminar imagen existente
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      // eliminar imagen nueva
      const newIndex = index - existingImages.length;
      setNewImages(newImages.filter((_, i) => i !== newIndex));
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {previewUrls.map((src, i) => (
        <div key={i} className="relative">
          <img src={src} alt="preview" className="w-20 h-20 object-cover rounded" />
          <button
            type="button"
            onClick={() => handleRemove(i)}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs p-0 w-6 h-6"
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}

