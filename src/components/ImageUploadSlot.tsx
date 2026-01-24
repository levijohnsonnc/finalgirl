import { useRef, useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

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
  const [isDragging, setIsDragging] = useState(false);
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (imageUrl) {
    return (
      <div className="relative group">
        <div className="relative aspect-[2/3] max-w-[300px] mx-auto overflow-hidden rounded-sm border border-border/50 bg-muted/30">
          <img
            src={imageUrl}
            alt="Movie poster"
            className="w-full h-full object-cover"
          />
          {/* VHS overlay effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="film-grain opacity-[0.05]" />
          </div>
        </div>
        
        {/* Clear button */}
        <button
          onClick={handleClear}
          className="absolute top-2 right-2 p-2 bg-background/80 hover:bg-background border border-border/50 rounded-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative aspect-[2/3] max-w-[300px] mx-auto
        flex flex-col items-center justify-center gap-3
        border-2 border-dashed rounded-sm cursor-pointer
        transition-all duration-200
        ${isDragging 
          ? 'border-primary bg-primary/10' 
          : 'border-border/50 bg-muted/20 hover:border-primary/50 hover:bg-muted/30'
        }
        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      
      {isProcessing ? (
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <div className="p-3 rounded-full bg-muted/50">
            {isDragging ? (
              <ImageIcon className="w-8 h-8 text-primary" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="text-center px-4">
            <p className="font-vhs text-xs text-muted-foreground">
              {isDragging ? 'Drop image here' : 'Click or drag to upload'}
            </p>
            <p className="font-vhs text-[10px] text-muted-foreground/60 mt-1">
              PNG, JPG, WebP
            </p>
          </div>
        </>
      )}
      
      {/* Static noise background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="mystery-static w-full h-full" />
      </div>
    </div>
  );
};
