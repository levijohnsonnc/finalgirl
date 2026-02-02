import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { GameResult } from '@/hooks/useGameHistory';
import { ScrapbookGrid } from './ScrapbookGrid';
import { ScrapbookStoryPage } from './ScrapbookStoryPage';
import { ScrapbookPolaroid } from './ScrapbookPolaroid';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import finalGirlCover from '@/assets/scrapbooks/final-girl-cover.png';
import killerCover from '@/assets/scrapbooks/killer-cover.png';

interface ScrapbookBookProps {
  type: 'finalGirl' | 'killer';
  games: GameResult[];
  onClose: () => void;
  onUpdateGame: (id: string, updates: Partial<GameResult>) => void;
  onDeleteGame: (id: string) => Promise<void> | void;
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

export const ScrapbookBook = ({ type, games, onClose, onUpdateGame, onDeleteGame }: ScrapbookBookProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameResult | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger open animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 800);
  };

  const handleDeleteConfirm = async () => {
    if (selectedGame) {
      await onDeleteGame(selectedGame.id);
      setSelectedGame(null);
      setShowDeleteConfirm(false);
      toast.success('Record destroyed');
    }
  };

  const handlePosterUpload = useCallback(async (file: File) => {
    if (!selectedGame) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const resizedBlob = await resizeImage(file);
      const fileName = `${selectedGame.id}-${Date.now()}.jpg`;
      const filePath = `game-posters/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('posters')
        .upload(filePath, resizedBlob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload poster');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('posters')
        .getPublicUrl(filePath);

      onUpdateGame(selectedGame.id, { posterImageUrl: urlData.publicUrl });
      setSelectedGame(prev => prev ? { ...prev, posterImageUrl: urlData.publicUrl } : null);
      toast.success('Poster added!');
    } catch (error) {
      console.error('Image processing error:', error);
      toast.error('Failed to process image');
    } finally {
      setIsUploading(false);
    }
  }, [selectedGame, onUpdateGame]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePosterUpload(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const coverImage = type === 'finalGirl' ? finalGirlCover : killerCover;
  const themeClass = type === 'finalGirl' ? 'scrapbook-theme-survivor' : 'scrapbook-theme-killer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Book Container - 3D perspective */}
      <div 
        className={`scrapbook-container ${themeClass} ${isOpen ? 'book-open' : ''}`}
        style={{ perspective: '2000px' }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 sm:top-4 sm:-right-12 z-50 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Book */}
        <div className="scrapbook-book">
          {/* Front Cover (flips open) */}
          <div className={`scrapbook-cover ${isOpen ? 'cover-open' : ''}`}>
            <img
              src={coverImage}
              alt={type === 'finalGirl' ? 'Final Girl Scrapbook' : 'Killer Scrapbook'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Inside Pages (revealed when open) */}
          <div className={`scrapbook-pages ${isOpen ? 'pages-visible' : ''}`}>
            {/* Polaroid Scene Image - Only when story selected and has scene image */}
            {selectedGame?.sceneImageUrl && (
              <ScrapbookPolaroid sceneImageUrl={selectedGame.sceneImageUrl} />
            )}

            {/* Left Page - Poster Display */}
            <div className="scrapbook-page scrapbook-page-left">
              <div className="page-content">
                {selectedGame ? (
                  <div className="poster-display">
                    {selectedGame.posterImageUrl ? (
                      <img
                        src={selectedGame.posterImageUrl}
                        alt="Game Poster"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="no-poster clickable-poster"
                      >
                        {isUploading ? (
                          <Loader2 className="w-8 h-8 text-muted-foreground/40 animate-spin" />
                        ) : (
                          <Upload className="w-8 h-8 text-muted-foreground/40 mb-2" />
                        )}
                        <span className="font-display text-sm text-muted-foreground/50">
                          {isUploading ? 'Uploading...' : 'Click to Upload Poster'}
                        </span>
                      </button>
                    )}
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <div className="poster-info">
                      <p className="font-vhs text-xs">{selectedGame.finalGirl}</p>
                      <p className="font-vhs text-[10px] text-muted-foreground">
                        vs {selectedGame.killer}
                      </p>
                      <p className="font-vhs text-[10px] text-muted-foreground">
                        {selectedGame.location}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="empty-page">
                    <p className="font-vhs text-sm text-muted-foreground text-center px-4">
                      Select a story from the grid to view its poster
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Page - Grid or Story */}
            <div className="scrapbook-page scrapbook-page-right">
              <div className="page-content">
                {selectedGame ? (
                  <div className="story-display">
                    {/* Action buttons row */}
                    <div className="flex justify-between items-center mb-2">
                      <button
                        onClick={() => setSelectedGame(null)}
                        className="back-to-grid"
                      >
                        ← Back to Grid
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="delete-entry-btn"
                      >
                        Delete
                      </button>
                    </div>
                    <ScrapbookStoryPage game={selectedGame} type={type} />
                  </div>
                ) : (
                  <ScrapbookGrid
                    games={games}
                    selectedGameId={null}
                    onSelectGame={setSelectedGame}
                    type={type}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Back Cover (static) */}
          <div className="scrapbook-back" />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
