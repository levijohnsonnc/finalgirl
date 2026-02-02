
# Plan: Complete Data Cleanup on Game Deletion

## Problem Summary
When deleting game records from the Scrapbook, not all related data is being cleaned up:
1. **Storage files remain orphaned** - Poster and scene images uploaded to storage are not deleted
2. **Database records may persist** - Need to ensure the delete actually completes and the UI refreshes

## Current Behavior
The `deleteGame` function in `useGameHistory.ts`:
- Removes the record from local React state (optimistic update)
- Sends a DELETE request to the `game_history` table
- Does NOT delete associated files from storage

## Solution Overview

### Step 1: Enhance the `deleteGame` function
Update `src/hooks/useGameHistory.ts` to:
1. Extract the `poster_image_url` and `scene_image_url` from the game being deleted
2. Delete the storage files BEFORE deleting the database record
3. Parse the file paths from the public URLs to get the correct storage paths
4. Handle errors gracefully (don't block deletion if storage cleanup fails)

### Step 2: Handle the `clearHistory` function
Update the `clearHistory` function to:
1. Get all games with image URLs before clearing
2. Delete all associated storage files
3. Then delete all database records

### Step 3: Add a helper function for storage cleanup
Create a reusable utility function that:
1. Extracts the file path from a Supabase public URL
2. Deletes the file from the `posters` bucket
3. Handles errors silently (log but don't throw)

---

## Technical Implementation Details

### File Changes

**1. `src/hooks/useGameHistory.ts`**

Add a helper function to extract storage path from public URL:
```typescript
const extractStoragePath = (publicUrl: string | undefined): string | null => {
  if (!publicUrl) return null;
  // URL format: .../storage/v1/object/public/posters/game-posters/filename.jpg
  const match = publicUrl.match(/\/posters\/(.+)$/);
  return match ? match[1] : null;
};
```

Add a helper function to delete storage files:
```typescript
const deleteStorageFiles = async (game: GameResult) => {
  const posterPath = extractStoragePath(game.posterImageUrl);
  const scenePath = extractStoragePath(game.sceneImageUrl);
  
  const pathsToDelete = [posterPath, scenePath].filter(Boolean) as string[];
  
  if (pathsToDelete.length > 0) {
    const { error } = await supabase.storage
      .from('posters')
      .remove(pathsToDelete);
      
    if (error) {
      console.error('Error deleting storage files:', error);
    }
  }
};
```

Update `deleteGame`:
```typescript
const deleteGame = useCallback(async (id: string) => {
  // Find the game to get image URLs before deletion
  const gameToDelete = gameHistory.find(g => g.id === id);
  
  if (user) {
    // Optimistically update
    setDbGameHistory(prev => prev.filter(game => game.id !== id));
    
    // Delete storage files first (best effort)
    if (gameToDelete) {
      await deleteStorageFiles(gameToDelete);
    }
    
    // Delete from database
    const { error } = await supabase
      .from('game_history')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error deleting game:', error);
      // Rollback optimistic update on error
      if (gameToDelete) {
        setDbGameHistory(prev => [...prev, gameToDelete].sort((a, b) => b.timestamp - a.timestamp));
      }
    }
  } else {
    setLocalGameHistory(prev => prev.filter(game => game.id !== id));
  }
}, [user, gameHistory, setLocalGameHistory]);
```

Update `clearHistory`:
```typescript
const clearHistory = useCallback(async () => {
  if (user) {
    const gamesToClear = [...dbGameHistory];
    
    // Optimistically clear
    setDbGameHistory([]);
    
    // Delete all storage files (best effort, in parallel)
    await Promise.all(gamesToClear.map(game => deleteStorageFiles(game)));
    
    // Delete all from database
    const { error } = await supabase
      .from('game_history')
      .delete()
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error clearing history:', error);
    }
  } else {
    setLocalGameHistory([]);
  }
}, [user, dbGameHistory, setLocalGameHistory]);
```

**2. Update components that call `deleteGame`**

The `deleteGame` function will become async, but we can keep the same interface by not awaiting at the call site (fire-and-forget pattern), OR we can update the components to handle async.

For safety, I recommend making the components await the deletion to ensure UI updates correctly:

**`src/pages/Scrapbooks.tsx`** - Update `handleDeleteGame`:
```typescript
const handleDeleteGame = async (id: string) => {
  await deleteGame(id);
};
```

**`src/components/ScrapbookBook.tsx`** - Update `handleDeleteConfirm`:
```typescript
const handleDeleteConfirm = async () => {
  if (selectedGame) {
    await onDeleteGame(selectedGame.id);
    setSelectedGame(null);
    setShowDeleteConfirm(false);
    toast.success('Record destroyed');
  }
};
```

---

## Safety Considerations

1. **No accidental data deletion** - We only delete files that belong to the specific game record being removed
2. **Error handling** - Storage deletion errors are logged but don't block the main deletion
3. **Rollback on failure** - If database deletion fails, we restore the optimistic update
4. **Path extraction is safe** - Uses regex matching that returns null if the URL format doesn't match

## Testing Checklist
- Delete a single game from scrapbook and verify:
  - Record is removed from Stats page
  - Poster image is removed from storage
  - Scene image is removed from storage
- Use "Reset My Plays" and verify:
  - All records are cleared
  - All storage files are deleted
  - Stats page shows empty state
