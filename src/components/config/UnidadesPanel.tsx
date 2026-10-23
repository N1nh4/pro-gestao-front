"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UnidadeModal } from "@/components/config/UnidadeModal";
import { listarUnidades, type UnidadeDto } from "@/lib/api/admin";
import { useApiResource } from "@/lib/useApiResource";

export function UnidadesPanel({ podeEditar }: { podeEditar: boolean }) {
  const { data, setData, loading, offline, error, reload } = useApiResource<
    UnidadeDto[]
  >("unidades", listarUnidades, []);
  const [modal, setModal] = useState<{ aberto: boolean; unidade?: UnidadeDto | null }>(
    { aberto: false },
  );

  function onSaved(salvo: UnidadeDto) {
    setData((prev) => {
      const existe = prev.some((u) => u.id === salvo.id);
      return existe ? prev.map((u) => (u.id === salvo.id ? salvo : u)) : [salvo, ...prev];
    });
  }

  return (
    <Card>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[12px] font-semibold text-t1">Unidades</div>
          <div className="text-[10px] text-t3">
            Unidades administrativas vinculadas ao ente.
          </div>
        </div>
        <Button
          variant="pri"
          icon={<Plus className="size-3.5" />}
          disabled={!podeEditar}
          onClick={() => setModal({ aberto: true, unidade: null })}
        >
          Nova
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
        <div className="py-4 text-center text-[11px] text-t3">Carregando unidades…</div>
      ) : data.length === 0 ? (
        <div className="py-4 text-center text-[11px] text-t3">Nenhuma unidade cadastrada.</div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {data.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-2 rounded border border-brd bg-bg2 px-2 py-1.5 text-[11px]"
            >
              <span className="rounded bg-bg3 px-1.5 py-0.5 font-mono text-[10px] font-bold text-t2">
                {u.sigla}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-t1">{u.nome}</div>
                {u.descricao ? (
                  <div className="truncate text-t3">{u.descricao}</div>
                ) : null}
              </div>
              <Button
                variant="ghost"
                icon={<Pencil className="size-3.5" />}
                disabled={!podeEditar}
                onClick={() => setModal({ aberto: true, unidade: u })}
              >
                Editar
              </Button>
            </div>
          ))}
        </div>
      )}

      {modal.aberto ? (
        <UnidadeModal
          unidade={modal.unidade}
          onClose={() => setModal({ aberto: false })}
          onSaved={onSaved}
        />
      ) : null}
    </Card>
  );
}
