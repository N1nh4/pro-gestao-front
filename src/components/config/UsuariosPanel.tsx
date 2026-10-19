"use client";

import { useState } from "react";
import { Pencil, Plus, User } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UsuarioModal } from "@/components/config/UsuarioModal";
import { listarUsuarios, type UsuarioDto } from "@/lib/api/admin";
import { useApiResource } from "@/lib/useApiResource";

export function UsuariosPanel({ podeEditar }: { podeEditar: boolean }) {
  const { data, loading, offline, error, reload } = useApiResource<UsuarioDto[]>(
    "usuarios",
    listarUsuarios,
    [],
  );
  const [modal, setModal] = useState<{ aberto: boolean; usuario?: UsuarioDto | null }>(
    { aberto: false },
  );

  return (
    <Card>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[12px] font-semibold text-t1">Usuários</div>
          <div className="text-[10px] text-t3">Usuários, perfis e unidades vinculadas.</div>
        </div>
        <Button
          variant="pri"
          icon={<Plus className="size-3.5" />}
          disabled={!podeEditar}
          onClick={() => setModal({ aberto: true, usuario: null })}
        >
          Novo
        </Button>
      </div>

      {offline ? (
        <div className="mb-2">
          <Alert
            variant="warn"
            title="API indisponível"
            action={
              <button
                type="button"
                onClick={reload}
                className="text-[10px] font-semibold text-acc2 hover:underline"
              >
                Recarregar
              </button>
            }
          >
            {error}
          </Alert>
        </div>
      ) : null}

      {loading ? (
        <div className="py-4 text-center text-[11px] text-t3">Carregando usuários…</div>
      ) : data.length === 0 ? (
        <div className="py-4 text-center text-[11px] text-t3">Nenhum usuário cadastrado.</div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {data.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-2 rounded border border-brd bg-bg2 px-2 py-1.5 text-[11px]"
            >
              <User className="size-3.5 shrink-0 text-t3" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-t1">{u.nome_completo}</span>
                  <span
                    className={
                      u.status === "Ativo"
                        ? "rounded bg-grn3 px-1.5 py-0.5 text-[9px] font-bold text-grn2"
                        : "rounded bg-bg3 px-1.5 py-0.5 text-[9px] font-bold text-t3"
                    }
                  >
                    {u.status ?? "—"}
                  </span>
                </div>
                <div className="truncate text-t3">
                  {u.email}
                  {u.perfis.length ? ` · ${u.perfis.map((p) => p.nome).join(", ")}` : ""}
                  {u.unidades?.length ? ` · ${u.unidades.map((x) => x.sigla).join(", ")}` : ""}
                </div>
              </div>
              <Button
                variant="ghost"
                icon={<Pencil className="size-3.5" />}
                disabled={!podeEditar}
                onClick={() => setModal({ aberto: true, usuario: u })}
              >
                Editar
              </Button>
            </div>
          ))}
        </div>
      )}

      {modal.aberto ? (
        <UsuarioModal
          usuario={modal.usuario}
          onClose={() => setModal({ aberto: false })}
          onSaved={reload}
        />
      ) : null}
    </Card>
  );
}
