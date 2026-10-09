"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Eye, EyeOff, LoaderCircle, LogIn, TriangleAlert, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/cn";
import { DEMO_CREDENTIALS, SENHA_DEMO } from "@/lib/rbac";
import type { PerfilId } from "@/lib/types";

const POPUPS: Partial<Record<PerfilId, { titulo: string; msg: string }>> = {
  op: {
    titulo: "⚠ Diligência vencida no seu setor",
    msg: "Você possui diligências vencidas que requerem resposta imediata no setor GEFIN.",
  },
  ag: {
    titulo: "⚠ Diligências críticas vencidas",
    msg: "Existem 2 diligências vencidas que bloqueiam o Nível IV. Verifique o Plano de Ação.",
  },
};

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [shake, setShake] = useState(false);
  const [popup, setPopup] = useState<PerfilId | null>(null);

  useEffect(() => {
    if (ready && user) router.replace("/painel");
  }, [ready, user, router]);

  const dispararShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }, []);

  const entrar = useCallback(
    async (loginUsuario: string, loginSenha: string) => {
      if (!loginUsuario || !loginSenha) {
        setErro(true);
        dispararShake();
        return;
      }
      setCarregando(true);
      setErro(false);
      const resultado = await login(loginUsuario, loginSenha);
      setCarregando(false);
      if (!resultado.ok) {
        setErro(true);
        dispararShake();
        return;
      }
      if (resultado.perfil && POPUPS[resultado.perfil]) setPopup(resultado.perfil);
      else router.replace("/painel");
    },
    [login, router, dispararShake],
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void entrar(usuario, senha);
  }

  function quickLogin(email: string) {
    setUsuario(email);
    setSenha(SENHA_DEMO);
    void entrar(email, SENHA_DEMO);
  }

  return (
    <div className="flex min-h-screen items-center justify-center border-b-[3px] border-acc bg-bg0 p-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-linear-to-br from-acc to-[#6E40C9] text-[13px] font-black tracking-tight text-white">
            SAC
          </div>
          <div>
            <div className="text-lg font-extrabold leading-tight text-t1">SAC Pró-Gestão RPPS</div>
            <div className="mt-0.5 text-[9px] leading-normal text-t3">
              Plataforma corporativa de certificação, auditoria e conformidade para RPPS — MPS/PREVIC v4.1
            </div>
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl border border-brd2 bg-bg1 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
            shake && "animate-shake",
          )}
        >
          <h2 className="mb-1.5 text-xl font-extrabold text-t1">Entrar no sistema</h2>
          <p className="mb-5 text-[11px] leading-normal text-t3">
            Use suas credenciais institucionais para acessar o SAC Pró-Gestão.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3.5">
              <label className="mb-1.5 block text-[11px] font-semibold text-t2">Usuário</label>
              <div className="relative">
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="usuario@municipio.gov.br"
                  autoComplete="username"
                  spellCheck={false}
                  className="w-full rounded-md border-[1.5px] border-brd2 bg-bg2 py-2.5 pl-3 pr-9 text-[13px] text-t1 outline-none transition-colors placeholder:text-t4 focus:border-acc"
                />
                <User className="pointer-events-none absolute right-3 top-1/2 size-[15px] -translate-y-1/2 text-t4" />
              </div>
            </div>

            <div className="mb-3.5">
              <label className="mb-1.5 block text-[11px] font-semibold text-t2">Senha</label>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-md border-[1.5px] border-brd2 bg-bg2 py-2.5 pl-3 pr-9 text-[13px] tracking-[0.1em] text-t1 outline-none transition-colors placeholder:text-t4 focus:border-acc"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-t4 transition-colors hover:text-t2"
                  title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff className="size-[15px]" /> : <Eye className="size-[15px]" />}
                </button>
              </div>
              {erro ? (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-red2">
                  <CircleAlert className="size-3" /> Usuário ou senha inválidos.
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-acc p-3 text-sm font-bold text-white transition-colors hover:bg-[#1a5ec7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" /> Verificando...
                </>
              ) : (
                <>
                  <LogIn className="size-4" /> Acessar
                </>
              )}
            </button>
          </form>

          <div className="mt-4 rounded-lg border border-brd bg-bg2 p-3">
            <div className="mb-2.5 text-[8px] font-extrabold uppercase tracking-[0.1em] text-t4">
              Credenciais de Demonstração
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.email}
                  type="button"
                  onClick={() => quickLogin(cred.email)}
                  className="flex cursor-pointer items-center justify-between gap-1.5 rounded border border-brd bg-bg3 px-2.5 py-1.5 text-left transition-colors hover:border-acc/30 hover:bg-acc3"
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap text-[10px] font-bold text-t1">
                    <span className="text-[13px]">{cred.emoji}</span> {cred.label}
                  </span>
                  <span className="max-w-[120px] truncate text-[9px] text-t3">
                    {cred.email.split("@")[0]}…
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-2 text-center text-[9px] text-t3">
              Senha padrão demo: <code className="rounded bg-bg3 px-1.5 py-px font-mono text-acc2">{SENHA_DEMO}</code>
            </div>
          </div>
        </div>
      </div>

      {popup ? (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-sm rounded-xl border border-brd2 bg-bg1 p-6 text-center">
            <TriangleAlert className="mx-auto mb-2.5 size-9 text-red2" />
            <div className="mb-2 text-[15px] font-extrabold text-t1">{POPUPS[popup]?.titulo}</div>
            <div className="mb-4 text-xs leading-relaxed text-t2">{POPUPS[popup]?.msg}</div>
            <div className="flex justify-center gap-2.5">
              <button
                type="button"
                onClick={() => router.replace("/plano")}
                className="cursor-pointer rounded-md border border-acc bg-acc px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-acc2"
              >
                Abrir Plano de Ação
              </button>
              <button
                type="button"
                onClick={() => router.replace("/painel")}
                className="cursor-pointer rounded-md border border-brd2 bg-bg2 px-3 py-1.5 text-[11px] font-medium text-t2 transition-colors hover:bg-bg3 hover:text-t1"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
