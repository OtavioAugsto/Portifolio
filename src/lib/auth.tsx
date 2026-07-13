"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

/**
 * Camada de autenticação.
 *
 * Dois modos, mesma interface pública (`useAuth`):
 *  - Supabase Auth quando `.env.local` está configurado (produção).
 *  - Mock localStorage enquanto não há chaves (desenvolvimento).
 *
 * As telas consomem só `useAuth()` e não sabem qual modo está ativo.
 */

export type User = {
  name: string;
  email: string;
  plan: string;
  planStatus: "pendente" | "ativo";
  avatarUrl?: string;
};

export type SignUpResult = { needsEmailConfirm: boolean };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<SignUpResult>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (fields: { name?: string; avatarUrl?: string }) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
};

const STORAGE_KEY = "klix.auth.user";

const AuthContext = createContext<AuthContextValue | null>(null);

function nameFromEmail(email: string): string {
  const handle = email.split("@")[0] ?? "Usuário";
  return handle
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/** Mapeia um usuário do Supabase para o formato usado nas telas. */
function fromSupabase(u: SupabaseUser): User {
  const meta = u.user_metadata ?? {};
  return {
    name:
      (meta.nome as string) ||
      (meta.full_name as string) ||
      (meta.name as string) ||
      nameFromEmail(u.email ?? ""),
    email: u.email ?? "",
    plan: (meta.plano as string) || "Nenhum plano ativo",
    planStatus: (meta.plano_status as User["planStatus"]) || "pendente",
    // `custom_avatar` = foto que o usuário subiu (o Google não mexe nela);
    // avatar_url/picture = foto vinda do provedor (Google), usada como fallback
    avatarUrl:
      (meta.custom_avatar as string) ||
      (meta.avatar_url as string) ||
      (meta.picture as string) ||
      undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // bootstrap da sessão
  useEffect(() => {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session ? fromSupabase(data.session.user) : null);
        setLoading(false);
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        setUser(session ? fromSupabase(session.user) : null);
      });
      return () => sub.subscription.unsubscribe();
    }

    // modo mock
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      /* ignora storage corrompido */
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(traduzErro(error.message));
      return;
    }
    // mock
    await new Promise((r) => setTimeout(r, 450));
    const mockUser: User = {
      name: nameFromEmail(email),
      email,
      plan: "Nenhum plano ativo",
      planStatus: "pendente",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<SignUpResult> => {
      if (isSupabaseConfigured) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nome: name } },
        });
        if (error) throw new Error(traduzErro(error.message));
        // sem sessão => Supabase exige confirmação por email
        return { needsEmailConfirm: !data.session };
      }
      // mock: cria e já loga
      await new Promise((r) => setTimeout(r, 450));
      const mockUser: User = {
        name: name || nameFromEmail(email),
        email,
        plan: "Nenhum plano ativo",
        planStatus: "pendente",
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return { needsEmailConfirm: false };
    },
    [],
  );

  const loginWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      throw new Error("Login com Google requer o Supabase configurado.");
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    // signInWithOAuth redireciona o navegador; se der erro antes disso, avisa
    if (error) throw new Error(traduzErro(error.message));
  }, []);

  const updateProfile = useCallback(
    async (fields: { name?: string; avatarUrl?: string }) => {
      if (!isSupabaseConfigured) {
        setUser((u) => {
          if (!u) return u;
          const next: User = {
            ...u,
            name: fields.name ?? u.name,
            avatarUrl: fields.avatarUrl ?? u.avatarUrl,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
        return;
      }
      const supabase = createClient();
      const data: Record<string, unknown> = {};
      if (fields.name !== undefined) data.nome = fields.name;
      // salva na chave própria pra não ser sobrescrita no login com Google
      if (fields.avatarUrl !== undefined) data.custom_avatar = fields.avatarUrl;
      const { data: res, error } = await supabase.auth.updateUser({ data });
      if (error) throw new Error(traduzErro(error.message));
      if (res.user) setUser(fromSupabase(res.user));
    },
    [],
  );

  const updatePassword = useCallback(async (password: string) => {
    if (!isSupabaseConfigured) return; // mock: nada a fazer
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(traduzErro(error.message));
  }, []);

  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    if (!isSupabaseConfigured) {
      // mock: devolve um data URL local
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) throw new Error("Sessão expirada. Entre novamente.");
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${authUser.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      throw new Error(
        /bucket/i.test(upErr.message)
          ? "O bucket 'avatars' ainda não existe no Supabase (rode a migração 0002)."
          : "Não foi possível enviar a foto. " + upErr.message,
      );
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`; // cache-bust
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await createClient().auth.signOut();
      setUser(null);
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signUp,
        loginWithGoogle,
        logout,
        updateProfile,
        updatePassword,
        uploadAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Mensagens comuns do Supabase em português. */
function traduzErro(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return "Email ou senha inválidos.";
  if (/user already registered/i.test(msg)) return "Este email já tem conta.";
  if (/password should be at least/i.test(msg))
    return "A senha precisa de pelo menos 6 caracteres.";
  if (/new password should be different/i.test(msg))
    return "A nova senha deve ser diferente da atual.";
  if (/unable to validate email/i.test(msg)) return "Email inválido.";
  return msg;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
