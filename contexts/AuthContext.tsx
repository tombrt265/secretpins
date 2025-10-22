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
          const result = await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
          setUser(session.user);
        }
      } catch (err) {
        console.error("AUTH_PROVIDER: restore error", err);
      } finally {
        setLoading(false);
      }
    };

    restore();

    const sub = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH_PROVIDER: onAuthStateChange", { event, session });
    });

    return () => {
      try {
        const anySub: any = sub;
        if (anySub?.data?.subscription?.unsubscribe) {
          anySub.data.subscription.unsubscribe();
        } else if (typeof anySub?.unsubscribe === "function") {
          anySub.unsubscribe();
        }
      } catch (_) {
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
