
import React, { useRef, useState } from 'react';
import Icon from './Icon';

interface ImageUploadProps {
  onImageSelect: (file: File, base64: string) => void;
  imagePreviewUrl: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, imagePreviewUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(file, (reader.result as string).split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleClick = () => inputRef.current?.click();

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(file, (reader.result as string).split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <div 
        onClick={handleClick} 
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
        className={`relative w-full aspect-video rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group
        ${isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500'}
        ${imagePreviewUrl ? 'border-solid' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {imagePreviewUrl ? (
          <img
            src={`data:image/jpeg;base64,${imagePreviewUrl}`}
            alt="Pratinjau Makanan"
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <Icon icon="upload" className="w-12 h-12 mb-2 transition-colors group-hover:text-emerald-500" />
            <p className="font-semibold">Klik atau seret foto ke sini</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">untuk mengunggah</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;