import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ApiKeyInfo {
  id: string;
  provider: string;
  created_at: string;
  // We intentionally never fetch api_key_encrypted on the client
  last4?: string;
}

interface ImageSettings {
  auto_generate_images: boolean;
  preferred_provider: string | null;
}

interface GenerateImageContext {
  story: string;
  killer: string;
  finalGirl: string;
  location: string;
  sceneType: 'beginning' | 'ending';
}

export const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google Gemini',
  openai: 'OpenAI DALL-E',
  stability: 'Stability AI',
};

export const useImageGeneration = () => {
  const { user, isAuthenticated } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
  const [settings, setSettings] = useState<ImageSettings>({
    auto_generate_images: false,
    preferred_provider: null,
  });
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Fetch saved keys (metadata only) and settings
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setApiKeys([]);
      setSettings({ auto_generate_images: false, preferred_provider: null });
      return;
    }
    loadKeysAndSettings();
  }, [isAuthenticated, user?.id]);

  const loadKeysAndSettings = async () => {
    if (!user) return;
    setIsLoadingKeys(true);
    try {
      // Fetch keys — only select non-sensitive columns
      const { data: keysData } = await supabase
        .from('user_api_keys')
        .select('id, provider, created_at')
        .eq('user_id', user.id);

      setApiKeys(keysData ?? []);

      // Fetch settings
      const { data: settingsData } = await supabase
        .from('user_image_settings')
        .select('auto_generate_images, preferred_provider')
        .eq('user_id', user.id)
        .maybeSingle();

      if (settingsData) {
        setSettings({
          auto_generate_images: settingsData.auto_generate_images,
          preferred_provider: settingsData.preferred_provider,
        });
      }
    } finally {
      setIsLoadingKeys(false);
    }
  };

  const saveApiKey = useCallback(async (provider: string, apiKey: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_api_keys')
      .upsert(
        {
          user_id: user.id,
          provider,
          api_key_encrypted: apiKey,
        },
        { onConflict: 'user_id,provider' }
      );

    if (error) {
      toast.error('Failed to save API key');
      console.error(error);
      return;
    }

    toast.success('API key saved securely');

    // Also set preferred provider if none set
    if (!settings.preferred_provider) {
      await updateSettings({ preferred_provider: provider });
    }

    await loadKeysAndSettings();
  }, [user, settings.preferred_provider]);

  const removeApiKey = useCallback(async (provider: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_api_keys')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider);

    if (error) {
      toast.error('Failed to remove API key');
      return;
    }

    toast.success('API key removed');

    // If this was the preferred provider, clear it
    if (settings.preferred_provider === provider) {
      await updateSettings({ preferred_provider: null });
    }

    await loadKeysAndSettings();
  }, [user, settings.preferred_provider]);

  const updateSettings = useCallback(async (updates: Partial<ImageSettings>) => {
    if (!user) return;

    const newSettings = { ...settings, ...updates };

    const { error } = await supabase
      .from('user_image_settings')
      .upsert(
        {
          user_id: user.id,
          auto_generate_images: newSettings.auto_generate_images,
          preferred_provider: newSettings.preferred_provider,
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      toast.error('Failed to update settings');
      console.error(error);
      return;
    }

    setSettings(newSettings);
  }, [user, settings]);

  const setAutoGenerate = useCallback(async (value: boolean) => {
    await updateSettings({ auto_generate_images: value });
  }, [updateSettings]);

  const generateImage = useCallback(async (context: GenerateImageContext): Promise<string | null> => {
    if (!user) return null;

    setIsGeneratingImage(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        toast.error('Please sign in to generate images');
        return null;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-scene-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify(context),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Image generation failed (${response.status})`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.imageUrl ?? null;
    } catch (err) {
      console.error('Image generation error:', err);
      const msg = err instanceof Error ? err.message : 'Image generation failed';
      toast.error(msg);
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  }, [user]);

  const hasApiKey = apiKeys.length > 0;
  const activeProvider = settings.preferred_provider ?? apiKeys[0]?.provider ?? null;

  return {
    isAuthenticated,
    hasApiKey,
    apiKeys,
    activeProvider,
    autoGenerate: settings.auto_generate_images,
    isLoadingKeys,
    isGeneratingImage,
    saveApiKey,
    removeApiKey,
    setAutoGenerate,
    updateSettings,
    generateImage,
  };
};
