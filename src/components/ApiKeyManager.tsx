import { useState } from 'react';
import { Eye, EyeOff, Film, Loader2, Lock, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useImageGeneration, PROVIDER_LABELS } from '@/hooks/useImageGeneration';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const SOURCES = [
  { value: 'google', label: 'GEMINI' },
  { value: 'openai', label: 'OPENAI' },
  { value: 'stability', label: 'STABILITY' },
] as const;

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

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>('google');
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const isOnline = hasApiKey;
  const currentProvider = apiKeys.length > 0 ? apiKeys[0]?.provider : null;

  const handleActivate = async () => {
    if (!keyInput.trim()) return;
    setIsSaving(true);
    await saveApiKey(selectedSource, keyInput.trim());
    setKeyInput('');
    setShowKey(false);
    setIsSaving(false);
    setIsExpanded(false);
  };

  const handleRemove = async (provider: string) => {
    await removeApiKey(provider);
    setConfirmRemove(null);
    if (apiKeys.length <= 1) {
      setIsExpanded(false);
    }
  };

  // Not authenticated — slim disabled bar
  if (!isAuthenticated) {
    return (
      <div className="relative overflow-hidden rounded-sm border border-muted-foreground/10 bg-card/30 px-4 py-3 opacity-50">
        <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative flex items-center gap-3">
          <Film className="w-4 h-4 text-muted-foreground" />
          <span className="font-display text-sm tracking-[0.15em] text-muted-foreground uppercase">
            Image Engine
          </span>
          <span className="font-vhs text-[10px] text-muted-foreground/60 ml-auto">
            SIGN IN TO ACTIVATE
          </span>
        </div>
      </div>
    );
  }

  // ── COLLAPSED STATE ──
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="group relative w-full overflow-hidden rounded-sm border border-muted-foreground/20 hover:border-primary/40 bg-card/50 hover:bg-card/70 transition-all duration-300 text-left"
      >
        <div className="scanlines pointer-events-none absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative flex items-center gap-3 px-4 py-3">
          {/* Icon */}
          <Film className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors shrink-0" />

          {/* Title + Status */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-display text-sm tracking-[0.15em] text-foreground uppercase">
              Image Engine
            </span>
            <span
              className={`font-vhs text-[10px] tracking-wider px-2 py-0.5 rounded-sm border ${
                isOnline
                  ? 'text-primary border-primary/30 bg-primary/10 blood-glow'
                  : 'text-muted-foreground border-muted-foreground/20 bg-muted/20'
              }`}
            >
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          {/* Action label */}
          <span className="ml-auto font-vhs text-[10px] tracking-wider text-muted-foreground group-hover:text-primary transition-colors uppercase shrink-0">
            {isOnline ? 'MANAGE' : 'ACTIVATE'}
          </span>
        </div>
      </button>
    );
  }

  // ── EXPANDED STATE ──
  return (
    <div className="relative overflow-hidden rounded-sm border border-primary/30 bg-card/60 transition-all duration-300">
      <div className="scanlines pointer-events-none absolute inset-0 opacity-15" />

      <div className="relative space-y-4 p-4">
        {/* Header bar — click to collapse */}
        <button
          onClick={() => setIsExpanded(false)}
          className="group flex items-center gap-3 w-full text-left"
        >
          <Film className="w-4 h-4 text-primary shrink-0" />
          <span className="font-display text-sm tracking-[0.15em] text-foreground uppercase">
            Image Engine
          </span>
          <span
            className={`font-vhs text-[10px] tracking-wider px-2 py-0.5 rounded-sm border ${
              isOnline
                ? 'text-primary border-primary/30 bg-primary/10 blood-glow'
                : 'text-muted-foreground border-muted-foreground/20 bg-muted/20'
            }`}
          >
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
          <X className="w-3.5 h-3.5 ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {/* ── Saved keys ── */}
        {apiKeys.length > 0 && (
          <div className="space-y-2">
            {apiKeys.map(k => (
              <div
                key={k.id}
                className="flex items-center justify-between bg-muted/20 border border-muted-foreground/10 rounded-sm px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-vhs text-[10px] tracking-wider text-primary uppercase">
                    {PROVIDER_LABELS[k.provider] ?? k.provider}
                  </span>
                  <span className="font-vhs text-[10px] text-muted-foreground/40">····</span>
                </div>
                {confirmRemove === k.provider ? (
                  <div className="flex items-center gap-2">
                    <span className="font-vhs text-[9px] text-muted-foreground">CONFIRM?</span>
                    <button
                      onClick={() => handleRemove(k.provider)}
                      className="font-vhs text-[9px] text-primary hover:text-primary/80 transition-colors"
                    >
                      YES
                    </button>
                    <button
                      onClick={() => setConfirmRemove(null)}
                      className="font-vhs text-[9px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      NO
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmRemove(k.provider)}
                    className="text-muted-foreground hover:text-primary transition-colors p-1"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 1: SELECT SOURCE ── */}
        <div className="space-y-2">
          <p className="font-vhs text-[10px] text-muted-foreground uppercase tracking-wider">
            Select Source
          </p>
          <div className="grid grid-cols-3 gap-2">
            {SOURCES.map(s => {
              const isSelected = selectedSource === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setSelectedSource(s.value)}
                  className={`relative font-vhs text-[10px] sm:text-xs tracking-wider py-2 px-3 rounded-sm border transition-all duration-200 uppercase ${
                    isSelected
                      ? 'border-primary/50 bg-primary/15 text-primary ring-1 ring-primary/30 shadow-[0_0_12px_hsl(var(--primary)/0.15)]'
                      : 'border-muted-foreground/15 bg-muted/10 text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/20 hover:text-foreground'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── STEP 2: ENTER ACCESS CODE ── */}
        <div className="space-y-2">
          <p className="font-vhs text-[10px] text-muted-foreground uppercase tracking-wider">
            Enter Access Code
          </p>
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="Paste your access code"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              className="font-vhs text-xs bg-muted/20 border-muted-foreground/20 pr-10 h-9"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Security note */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="flex items-center gap-1 font-vhs text-[9px] text-muted-foreground/60 cursor-help">
                  <Lock className="w-2.5 h-2.5" />
                  Stored securely. Never shared.
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-vhs text-[10px] max-w-[200px]">
                Your access code is stored server-side and is only used to call the provider you select. It is never exposed after saving.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <button
            onClick={handleActivate}
            disabled={!keyInput.trim() || isSaving}
            className="vcr-tape-button flex items-center justify-center gap-2 px-4 py-2 font-display text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all disabled:opacity-30 w-full"
          >
            {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
            {isSaving ? 'ACTIVATING...' : 'ACTIVATE ENGINE'}
          </button>
        </div>

        {/* ── AUTO-GENERATE TOGGLE ── */}
        {hasApiKey && (
          <div className="flex items-center justify-between pt-3 border-t border-muted-foreground/10">
            <p className="font-vhs text-[10px] sm:text-xs text-foreground/80 uppercase tracking-wider">
              Auto Generate Scenes
            </p>
            <Switch
              checked={autoGenerate}
              onCheckedChange={setAutoGenerate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeyManager;
