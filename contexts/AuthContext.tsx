import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { deleteSession, getSession, saveSession } from "../utils/storage";
import { supabase } from "../utils/supabaseClient";

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Prevent restore running multiple times in StrictMode
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const restore = async () => {
      try {
        const saved = await getSession();
        if (saved) {
          const session = JSON.parse(saved);
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            });

            // If supabase returned an error or no session, treat as signed out
            if (error || !data?.session) {
              console.warn(
                "AUTH_PROVIDER: restore - refresh failed, clearing saved session",
                error
              );
              await deleteSession();
              setUser(null);
            } else {
              // use the server-returned session user (fresh)
              setUser(data.session.user);
              await saveSession(JSON.stringify(data.session));
            }
          } catch (err) {
            console.error("AUTH_PROVIDER: restore - setSession error", err);
            await deleteSession();
            setUser(null);
          }
        }
      } catch (err) {
        console.error("AUTH_PROVIDER: restore error", err);
      } finally {
        setLoading(false);
      }
    };

    restore();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log("AUTH_PROVIDER: onAuthStateChange", { event, session });

          if (event === "SIGNED_IN" || event === "USER_UPDATED") {
            // session may be null in some events
            if (session?.access_token && session?.refresh_token) {
              await saveSession(JSON.stringify(session));
            }
            setUser(session?.user ?? null);
          } else if (
            event === "SIGNED_OUT" ||
            (event === "TOKEN_REFRESHED" && !session)
          ) {
            // clear local session when signed out
            await deleteSession();
            setUser(null);
          } else if (event === "PASSWORD_RECOVERY") {
            // keep user cleared until explicit sign-in
            setUser(null);
          }
        } catch (err) {
          console.error("AUTH_PROVIDER: onAuthStateChange handler error", err);
        }
      }
    );

    return () => {
      try {
        if (subscription?.subscription?.unsubscribe) {
          subscription.subscription.unsubscribe();
        } else if (typeof (subscription as any)?.unsubscribe === "function") {
          (subscription as any).unsubscribe();
        }
      } catch {
        // ignore
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data?.session) {
      await saveSession(JSON.stringify(data.session));
      setUser(data.session.user);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await deleteSession();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, signIn, signOut }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
