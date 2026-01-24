import { useRef, useState, useCallback } from 'react';
import { Upload, Check } from 'lucide-react';

interface ImageUploadSlotProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

// Resize and compress image to prevent localStorage bloat
const resizeImage = (file: File, maxWidth: number = 1200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Only resize if larger than max
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG at 80% quality for compression
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const ImageUploadSlot = ({ imageUrl, onImageChange }: ImageUploadSlotProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    
    setIsProcessing(true);
    try {
      const resizedUrl = await resizeImage(file);
      onImageChange(resizedUrl);
    } catch (error) {
      console.error('Image processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onImageChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const hasImage = !!imageUrl;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isProcessing}
      className={`vcr-tape-button flex items-center justify-center gap-2 px-4 py-3 font-display text-xs tracking-[0.1em] uppercase transition-all duration-300 min-h-[44px] ${
        isProcessing ? 'opacity-50' : ''
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      
      {isProcessing ? (
        <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      ) : hasImage ? (
        <Check className="w-4 h-4 text-secondary" />
      ) : (
        <Upload className="w-4 h-4" />
      )}
      {isProcessing ? 'Saving...' : hasImage ? 'Poster Saved' : 'Upload Poster'}
    </button>
  );
};
