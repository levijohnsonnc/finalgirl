const ALLOWED_ORIGIN_PATTERNS = [
  'https://cdyvccecrovyjkabfcnx.supabase.co',
  /^https:\/\/.*\.lovable\.app$/,
  /^https:\/\/.*\.lovable\.dev$/,
  /^https:\/\/.*\.lovableproject\.com$/,
  'http://localhost:5173',
  'http://localhost:8080',
];

const CORS_HEADERS_BASE = 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version';

const isAllowedOrigin = (origin: string): boolean =>
  ALLOWED_ORIGIN_PATTERNS.some(p =>
    typeof p === 'string' ? origin === p : p.test(origin)
  );

export const getCorsHeaders = (origin?: string | null) => ({
  'Access-Control-Allow-Origin': origin && isAllowedOrigin(origin) ? origin : ALLOWED_ORIGIN_PATTERNS[0] as string,
  'Access-Control-Allow-Headers': CORS_HEADERS_BASE,
});

// Backwards-compatible static export — used by validation.ts and other shared code.
// Edge function handlers should prefer getCorsHeaders(req) for proper origin checking.
export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN_PATTERNS[0] as string,
  'Access-Control-Allow-Headers': CORS_HEADERS_BASE,
};
