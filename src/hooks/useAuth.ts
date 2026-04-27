import { createContext, createElement, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthReady: boolean;
  authError: string | null;
}

interface SignInResult {
  error: AuthError | Error | null;
}

const getPersistedSession = (): Session | null => {
  const authKey = Object.keys(window.localStorage).find((key) => /^sb-.+-auth-token$/.test(key));
  if (!authKey) return null;

  try {
    const stored = window.localStorage.getItem(authKey);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { currentSession?: Session; access_token?: string; user?: User; expires_at?: number };
    const session = parsed.currentSession ?? (parsed.access_token && parsed.user ? parsed as Session : null);
    if (!session?.access_token || !session.user) return null;
    if (session.expires_at && session.expires_at * 1000 < Date.now()) return null;
    return session;
  } catch (error) {
    console.error('Failed to read persisted auth session:', error);
    return null;
  }
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthReady: false,
    authError: null,
  });
  const initialSessionResolvedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        if (event === 'INITIAL_SESSION' && !initialSessionResolvedRef.current) return;

        setAuthState({
          session,
          user: session?.user ?? null,
          isLoading: false,
          isAuthReady: true,
          authError: null,
        });
      }
    );

    const restoreSession = async () => {
      try {
        const timeout = new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error('Saved session restoration timed out.')), 10000);
        });
        const { data: { session } } = await Promise.race([supabase.auth.getSession(), timeout]);

        if (!isMounted) return;
        initialSessionResolvedRef.current = true;
        setAuthState({
          session,
          user: session?.user ?? null,
          isLoading: false,
          isAuthReady: true,
          authError: null,
        });
      } catch (error) {
        console.error('Failed to restore saved auth session:', error);
        const persistedSession = getPersistedSession();

        if (!isMounted) return;
        initialSessionResolvedRef.current = true;
        setAuthState({
          session: persistedSession,
          user: persistedSession?.user ?? null,
          isLoading: false,
          isAuthReady: true,
          authError: persistedSession
            ? 'Sign-in services are temporarily slow. Using your saved session while the archive reconnects.'
            : 'Sign-in services are temporarily unavailable. Please try again shortly.',
        });
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<SignInResult> => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    return { error };
  }, []);

  const signOut = useCallback(async (): Promise<SignInResult> => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  return {
    user: authState.user,
    session: authState.session,
    isLoading: authState.isLoading,
    isAuthReady: authState.isAuthReady,
    authError: authState.authError,
    isAuthenticated: !!authState.session,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
};

type AuthContextValue = ReturnType<typeof useAuthState>;

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const value = useAuthState();
  return createElement(AuthContext.Provider, { value }, children);
};
