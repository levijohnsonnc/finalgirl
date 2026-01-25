import { useRef, useState, useCallback } from 'react';
import { Upload, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploadSlotProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  gameId?: string;
}

// Resize and compress image before upload
const resizeImage = (file: File, maxWidth: number = 1200): Promise<Blob> => {
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
        
        // Convert to JPEG blob at 85% quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const ImageUploadSlot = ({ imageUrl, onImageChange, gameId }: ImageUploadSlotProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Resize the image first
      const resizedBlob = await resizeImage(file);
      
      // Generate a unique filename
      const fileName = `${gameId || crypto.randomUUID()}-${Date.now()}.jpg`;
      const filePath = `game-posters/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('posters')
        .upload(filePath, resizedBlob, {
          contentType: 'image/jpeg',
          upsert: true,
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload image');
        return;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('posters')
        .getPublicUrl(filePath);
      
      onImageChange(urlData.publicUrl);
      toast.success('Poster uploaded!');
    } catch (error) {
      console.error('Image processing error:', error);
      toast.error('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  }, [onImageChange, gameId]);

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
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : hasImage ? (
        <Check className="w-4 h-4 text-secondary" />
      ) : (
        <Upload className="w-4 h-4" />
      )}
      {isProcessing ? 'Uploading...' : hasImage ? 'Still Saved' : 'Upload Movie Still'}
    </button>
  );
};
