"use client";

import { useRef, useState } from "react";
import { X, Camera, Loader2, Check } from "lucide-react";
import { useAuth } from "@/lib/auth";

/** Modal de configurações: trocar nome, foto de perfil e senha. */
export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile, updatePassword, uploadAvatar } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [avatar, setAvatar] = useState(user?.avatarUrl);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const initials = (name || "U")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setOk(null);
    setUploading(true);
    try {
      const url = await uploadAvatar(file);
      setAvatar(url);
      await updateProfile({ avatarUrl: url });
      setOk("Foto atualizada!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar a foto.");
    } finally {
      setUploading(false);
    }
  }

  async function onSaveProfile() {
    setError(null);
    setOk(null);
    if (!name.trim()) {
      setError("Informe seu nome.");
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile({ name: name.trim() });
      setOk("Perfil atualizado!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar o perfil.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function onSavePassword() {
    setError(null);
    setOk(null);
    if (password.length < 6) {
      setError("A nova senha precisa de pelo menos 6 caracteres.");
      return;
    }
    if (password !== password2) {
      setError("As senhas não coincidem.");
      return;
    }
    setSavingPass(true);
    try {
      await updatePassword(password);
      setPassword("");
      setPassword2("");
      setOk("Senha alterada!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao alterar a senha.");
    } finally {
      setSavingPass(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-pop-in w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Configurações</h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-background hover:text-foreground active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* avatar */}
        <div className="mt-5 flex items-center gap-4">
          <div className="relative">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-brand text-xl font-bold text-white ring-2 ring-border">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-brand text-white shadow-md ring-2 ring-card transition hover:bg-brand-600 active:scale-90 disabled:opacity-70"
              title="Trocar foto"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickFile}
            />
          </div>
          <div>
            <p className="font-semibold">{name || "Sem nome"}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </div>

        {/* nome */}
        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium">Nome</label>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
            />
            <button
              onClick={onSaveProfile}
              disabled={savingProfile}
              className="shrink-0 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-600 active:scale-95 disabled:opacity-70"
            >
              {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
            </button>
          </div>
        </div>

        {/* senha */}
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-sm font-medium">Alterar senha</p>
          <div className="mt-2 space-y-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nova senha"
              autoComplete="new-password"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
            />
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Confirmar nova senha"
              autoComplete="new-password"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
            />
            <button
              onClick={onSavePassword}
              disabled={savingPass}
              className="w-full rounded-xl border border-border py-2.5 text-sm font-semibold transition hover:bg-background active:scale-[0.98] disabled:opacity-70"
            >
              {savingPass ? "Alterando…" : "Alterar senha"}
            </button>
          </div>
        </div>

        {/* feedback */}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {ok && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <Check className="h-4 w-4" /> {ok}
          </p>
        )}
      </div>
    </div>
  );
}
