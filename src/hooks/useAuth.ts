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

const clearPersistedAuthSession = () => {
  Object.keys(window.localStorage)
    .filter((key) => key === 'supabase.auth.token' || /^sb-.+-auth-token$/.test(key))
    .forEach((key) => window.localStorage.removeItem(key));
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
        clearPersistedAuthSession();
        void supabase.auth.signOut({ scope: 'local' }).catch(() => undefined);

        if (!isMounted) return;
        initialSessionResolvedRef.current = true;
        setAuthState({
          session: null,
          user: null,
          isLoading: false,
          isAuthReady: true,
          authError: 'Your saved session could not be restored. Please sign in again.',
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
