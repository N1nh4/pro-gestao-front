"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { ApiError } from "@/lib/api/client";
import {
  atualizarUsuario,
  criarUsuario,
  listarPerfis,
  listarUnidades,
  type PerfilDto,
  type UnidadeDto,
  type UsuarioDto,
  type UsuarioPayload,
} from "@/lib/api/admin";
import { useApiResource } from "@/lib/useApiResource";

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[6px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none";

const STATUS = ["ativo", "inativo"];

export function UsuarioModal({
  usuario,
  onClose,
  onSaved,
}: {
  usuario?: UsuarioDto | null;
  onClose: () => void;
  onSaved: (usuario: UsuarioDto) => void;
}) {
  const { toast } = useToast();
  const edicao = Boolean(usuario);
  const { data: perfis } = useApiResource<PerfilDto[]>("perfis", listarPerfis, []);
  const { data: unidades } = useApiResource<UnidadeDto[]>("unidades", listarUnidades, []);

  const [nome, setNome] = useState(usuario?.nome_completo ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState(usuario?.status ?? "ativo");
  const [perfisSel, setPerfisSel] = useState<string[]>(
    usuario?.perfis.map((p) => p.id) ?? [],
  );
  const [unidadesSel, setUnidadesSel] = useState<string[]>(
    usuario?.unidades?.map((u) => u.id) ?? [],
  );
  const [salvando, setSalvando] = useState(false);

  function toggle(lista: string[], id: string, on: boolean): string[] {
    return on ? [...lista, id] : lista.filter((x) => x !== id);
  }

  function confirmar() {
    if (!nome.trim()) return toast("Informe o nome completo", "warn");
    if (!email.trim()) return toast("Informe o e-mail", "warn");
    if (!edicao && senha.length < 6)
      return toast("A senha deve ter ao menos 6 caracteres", "warn");
    if (!perfisSel.length) return toast("Selecione ao menos um perfil", "warn");

    const payload: UsuarioPayload = {
      nome_completo: nome.trim(),
      email: email.trim(),
      perfil_ids: perfisSel,
      unidade_ids: unidadesSel,
    };

    setSalvando(true);
    const acao = edicao
      ? atualizarUsuario(usuario!.id, {
          ...payload,
          status,
          ...(senha ? { senha } : {}),
        })
      : criarUsuario({ ...payload, perfil_id: perfisSel[0], senha });

    acao
      .then((salvo) => {
        toast(edicao ? "Usuário atualizado." : "Usuário criado.", "ok");
        onSaved(salvo);
        onClose();
      })
      .catch((err: unknown) => {
        toast(err instanceof ApiError ? err.message : "Falha ao salvar usuário.", "err");
      })
      .finally(() => setSalvando(false));
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="animate-fade-in w-full max-w-[620px] overflow-hidden rounded-lg border border-brd bg-bg1 shadow-xl shadow-black/40">
        <div className="flex h-[51px] items-center justify-between border-b border-brd bg-bg2 px-4">
          <div className="text-[13px] font-bold text-t1">
            {edicao ? "Editar Usuário" : "Novo Usuário"}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
            title="Fechar"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-3 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-[10px] font-semibold text-t2">
              Nome completo
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={cn(campo, "mt-1")}
              />
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(campo, "mt-1")}
              />
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              {edicao ? "Nova senha (opcional)" : "Senha"}
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder={edicao ? "deixe vazio para manter" : "mínimo 6 caracteres"}
                className={cn(campo, "mt-1")}
                autoComplete="new-password"
              />
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={cn(campo, "mt-1")}
                disabled={!edicao}
              >
                {STATUS.map((s) => (
                  <option key={s} value={s}>{s === "ativo" ? "Ativo" : "Inativo"}</option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-t2">
              Perfis{" "}
              <span className="font-normal text-t3">({perfisSel.length} selecionado(s))</span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {perfis.map((p) => {
                const on = perfisSel.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-1.5 rounded border px-2 py-1.5 text-[10px] font-semibold transition-colors",
                      on
                        ? "border-acc/40 bg-acc3 text-t1"
                        : "border-brd bg-bg2 text-t2 hover:bg-bg3",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={(e) => setPerfisSel((prev) => toggle(prev, p.id, e.target.checked))}
                      className="size-3 accent-acc"
                    />
                    <span className="truncate">{p.nome}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-t2">
              Unidades{" "}
              <span className="font-normal text-t3">
                (vazio = todas as unidades)
              </span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {unidades.map((u) => {
                const on = unidadesSel.includes(u.id);
                return (
                  <label
                    key={u.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-1.5 rounded border px-2 py-1.5 text-[10px] font-semibold transition-colors",
                      on
                        ? "border-acc/40 bg-acc3 text-t1"
                        : "border-brd bg-bg2 text-t2 hover:bg-bg3",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={(e) => setUnidadesSel((prev) => toggle(prev, u.id, e.target.checked))}
                      className="size-3 accent-acc"
                    />
                    <span className="truncate font-mono">{u.sigla}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-brd bg-bg2 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md border border-brd2 bg-bg1 px-4 py-1.5 text-[11px] font-semibold text-t2 transition-colors hover:bg-bg3 hover:text-t1"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={salvando}
            className="cursor-pointer rounded-md bg-acc px-6 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-acc2 disabled:opacity-40"
          >
            {salvando ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
