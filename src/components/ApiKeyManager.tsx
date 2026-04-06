import { useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useImageGeneration, PROVIDER_LABELS } from '@/hooks/useImageGeneration';

const PROVIDERS = [
  { value: 'google', label: 'Google Gemini' },
  { value: 'openai', label: 'OpenAI DALL-E' },
  { value: 'stability', label: 'Stability AI' },
];

const ApiKeyManager = () => {
  const {
    isAuthenticated,
    hasApiKey,
    apiKeys,
    activeProvider,
    autoGenerate,
    isLoadingKeys,
    saveApiKey,
    removeApiKey,
    setAutoGenerate,
    updateSettings,
  } = useImageGeneration();

  const [selectedProvider, setSelectedProvider] = useState('google');
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!keyInput.trim()) return;
    setIsSaving(true);
    await saveApiKey(selectedProvider, keyInput.trim());
    setKeyInput('');
    setShowKey(false);
    setIsSaving(false);
  };

  const handleRemove = async (provider: string) => {
    await removeApiKey(provider);
  };

  if (!isAuthenticated) {
    return (
      <div className="border border-muted-foreground/20 rounded-sm p-4 sm:p-6 opacity-60">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="w-4 h-4 text-primary" />
          <h3 className="font-display text-lg sm:text-xl text-foreground tracking-wider uppercase">
            Image Generation
          </h3>
        </div>
        <p className="font-vhs text-xs text-muted-foreground">
          Sign in to configure AI image generation with your own API key.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-primary/30 rounded-sm p-4 sm:p-6 bg-card/50 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <KeyRound className="w-4 h-4 text-primary" />
        <h3 className="font-display text-lg sm:text-xl text-foreground tracking-wider uppercase">
          Image Generation
        </h3>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-2 bg-muted/30 border border-muted-foreground/10 rounded-sm px-3 py-2">
        <ShieldCheck className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
        <p className="font-vhs text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
          Your API key is stored securely on the server and is never exposed after saving. It is only used server-side to call the provider you select.
        </p>
      </div>

      {/* Saved keys list */}
      {apiKeys.length > 0 && (
        <div className="space-y-2">
          <p className="font-vhs text-[10px] text-muted-foreground uppercase tracking-wider">
            Saved Keys
          </p>
          {apiKeys.map(k => (
            <div
              key={k.id}
              className="flex items-center justify-between bg-muted/20 border border-muted-foreground/10 rounded-sm px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-vhs text-xs text-foreground">
                  {PROVIDER_LABELS[k.provider] ?? k.provider}
                </span>
                <span className="font-vhs text-[10px] text-muted-foreground">
                  ····
                </span>
              </div>
              <button
                onClick={() => handleRemove(k.provider)}
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                title="Remove key"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add / replace key form */}
      <div className="space-y-3">
        <p className="font-vhs text-[10px] text-muted-foreground uppercase tracking-wider">
          {hasApiKey ? 'Add Another Key' : 'Add API Key'}
        </p>

        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger className="font-vhs text-xs bg-muted/20 border-muted-foreground/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVIDERS.map(p => (
              <SelectItem key={p.value} value={p.value} className="font-vhs text-xs">
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Input
            type={showKey ? 'text' : 'password'}
            placeholder="Paste your API key"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            className="font-vhs text-xs bg-muted/20 border-muted-foreground/20 pr-10"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={!keyInput.trim() || isSaving}
          className="vcr-tape-button flex items-center justify-center gap-2 px-4 py-2.5 font-display text-xs tracking-[0.15em] uppercase transition-all disabled:opacity-40 w-full"
        >
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          {isSaving ? 'Saving...' : 'Save Key'}
        </button>
      </div>

      {/* Preferred provider */}
      {apiKeys.length > 1 && (
        <div className="space-y-2">
          <p className="font-vhs text-[10px] text-muted-foreground uppercase tracking-wider">
            Preferred Provider
          </p>
          <Select
            value={activeProvider ?? ''}
            onValueChange={v => updateSettings({ preferred_provider: v })}
          >
            <SelectTrigger className="font-vhs text-xs bg-muted/20 border-muted-foreground/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {apiKeys.map(k => (
                <SelectItem key={k.provider} value={k.provider} className="font-vhs text-xs">
                  {PROVIDER_LABELS[k.provider] ?? k.provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Auto-generate toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-muted-foreground/10">
        <div>
          <p className="font-vhs text-xs text-foreground">Auto-generate scene images</p>
          <p className="font-vhs text-[10px] text-muted-foreground">
            Automatically create images when stories load
          </p>
        </div>
        <Switch
          checked={autoGenerate}
          onCheckedChange={setAutoGenerate}
          disabled={!hasApiKey}
        />
      </div>
    </div>
  );
};

export default ApiKeyManager;
