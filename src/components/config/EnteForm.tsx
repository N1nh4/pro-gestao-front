"use client";

import { useState, type ReactNode } from "react";
import { Pencil, Save, X } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import {
  atualizarEnte,
  obterEnte,
  type EnteDto,
} from "@/lib/api/admin";
import { useApiResource } from "@/lib/useApiResource";

const VAZIO: EnteDto = {
  id: "",
  nome_ente: "",
  cnpj_ente: "",
  uf: "",
  tipo_ente: "Município",
  ativo: true,
};

const ESFERAS = ["Município", "Estado", "Distrito Federal", "União"];

const TIPOS_LOGRADOURO = [
  "Rua",
  "Avenida",
  "Praça",
  "Travessa",
  "Alameda",
  "Estrada",
  "Rodovia",
  "Outro",
];

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[5px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none disabled:opacity-70";

function Campo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold text-t3">{label}</span>
      {children}
    </label>
  );
}

export function EnteForm({ podeEditar }: { podeEditar: boolean }) {
  const { toast } = useToast();
  const { data, setData, loading, offline, reload } = useApiResource<EnteDto>(
    "ente",
    obterEnte,
    VAZIO,
  );
  const [draft, setDraft] = useState<Partial<EnteDto>>({});
  const [editando, setEditando] = useState(false);

  function v(campoKey: keyof EnteDto): string {
    const raw = campoKey in draft ? draft[campoKey] : data[campoKey];
    return raw == null ? "" : String(raw);
  }

  function set(campoKey: keyof EnteDto, value: string) {
    setDraft((d) => ({ ...d, [campoKey]: value }));
  }

  const alterou = Object.keys(draft).length > 0;

  function cancelar() {
    setDraft({});
    setEditando(false);
  }

  function salvar() {
    if (!alterou) {
      setEditando(false);
      return;
    }
    atualizarEnte(draft)
      .then((novo) => {
        setData(novo);
        setDraft({});
        setEditando(false);
        toast("Dados do ente atualizados com sucesso.", "ok");
      })
      .catch(() => {
        setData((prev) => ({ ...prev, ...draft }) as EnteDto);
        setDraft({});
        setEditando(false);
        toast("API offline — dados salvos localmente.", "warn");
      });
  }

  const disabled = !editando || !podeEditar;

  return (
    <Card>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[12px] font-semibold text-t1">Dados do Ente</div>
          <div className="text-[10px] text-t3">
            Informações cadastrais do ente federativo / RPPS.
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editando ? (
            <>
              <Button variant="default" icon={<X className="size-3.5" />} onClick={cancelar}>
                Cancelar
              </Button>
              <Button variant="pri" icon={<Save className="size-3.5" />} onClick={salvar}>
                Salvar
              </Button>
            </>
          ) : (
            <Button
              variant="pri"
              icon={<Pencil className="size-3.5" />}
              disabled={!podeEditar || loading}
              onClick={() => setEditando(true)}
            >
              Editar
            </Button>
          )}
        </div>
      </div>

      {offline ? (
        <div className="mb-2">
          <Alert variant="warn" title="API indisponível">
            Exibindo dados locais. As alterações só persistirão quando a API voltar.
          </Alert>
        </div>
      ) : null}

      {loading ? (
        <div className="py-4 text-center text-[11px] text-t3">Carregando dados do ente…</div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Campo label="Razão Social">
              <input
                value={v("nome_ente")}
                disabled={disabled}
                onChange={(e) => set("nome_ente", e.target.value)}
                className={campo}
              />
            </Campo>
            <Campo label="CNPJ">
              <input
                value={v("cnpj_ente")}
                disabled={disabled}
                placeholder="00.000.000/0000-00"
                onChange={(e) => set("cnpj_ente", e.target.value)}
                className={campo}
              />
            </Campo>
            <Campo label="Esfera">
              <select
                value={v("tipo_ente")}
                disabled={disabled}
                onChange={(e) => set("tipo_ente", e.target.value)}
                className={campo}
              >
                {ESFERAS.map((es) => (
                  <option key={es} value={es}>{es}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Código SIAFI">
              <input
                value={v("codigo_siafi")}
                disabled={disabled}
                onChange={(e) => set("codigo_siafi", e.target.value)}
                className={campo}
              />
            </Campo>
            <Campo label="Representante Legal">
              <input
                value={v("representante_legal")}
                disabled={disabled}
                onChange={(e) => set("representante_legal", e.target.value)}
                className={campo}
              />
            </Campo>
            <Campo label="CPF do Representante">
              <input
                value={v("cpf_representante")}
                disabled={disabled}
                placeholder="000.000.000-00"
                onChange={(e) => set("cpf_representante", e.target.value)}
                className={campo}
              />
            </Campo>
            <Campo label="Data de Início do Processo">
              <input
                type="date"
                value={v("data_inicio_processo")}
                disabled={disabled}
                onChange={(e) => set("data_inicio_processo", e.target.value)}
                className={campo}
              />
            </Campo>
            <Campo label="Data de Fim do Processo">
              <input
                type="date"
                value={v("data_fim_processo")}
                disabled={disabled}
                onChange={(e) => set("data_fim_processo", e.target.value)}
                className={campo}
              />
            </Campo>
            <Campo label="E-mail">
              <input
                type="email"
                value={v("email_contato")}
                disabled={disabled}
                onChange={(e) => set("email_contato", e.target.value)}
                className={campo}
              />
            </Campo>
          </div>

          <div className="border-t border-brd pt-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-t3">
              Endereço
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Campo label="CEP">
                <input
                  value={v("cep")}
                  disabled={disabled}
                  placeholder="00000-000"
                  onChange={(e) => set("cep", e.target.value)}
                  className={campo}
                />
              </Campo>
              <Campo label="UF">
                <select
                  value={v("uf")}
                  disabled={disabled}
                  onChange={(e) => set("uf", e.target.value)}
                  className={campo}
                >
                  <option value="">—</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Cidade">
                <input
                  value={v("cidade")}
                  disabled={disabled}
                  onChange={(e) => set("cidade", e.target.value)}
                  className={campo}
                />
              </Campo>
              <Campo label="Tipo de Logradouro">
                <select
                  value={v("tipo_logradouro")}
                  disabled={disabled}
                  onChange={(e) => set("tipo_logradouro", e.target.value)}
                  className={campo}
                >
                  <option value="">—</option>
                  {TIPOS_LOGRADOURO.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Logradouro">
                <input
                  value={v("logradouro")}
                  disabled={disabled}
                  onChange={(e) => set("logradouro", e.target.value)}
                  className={campo}
                />
              </Campo>
              <Campo label="Número">
                <input
                  value={v("numero")}
                  disabled={disabled}
                  onChange={(e) => set("numero", e.target.value)}
                  className={campo}
                />
              </Campo>
              <Campo label="Bairro">
                <input
                  value={v("bairro")}
                  disabled={disabled}
                  onChange={(e) => set("bairro", e.target.value)}
                  className={campo}
                />
              </Campo>
              <Campo label="Complemento (opcional)">
                <input
                  value={v("complemento")}
                  disabled={disabled}
                  onChange={(e) => set("complemento", e.target.value)}
                  className={cn(campo, "sm:col-span-2")}
                />
              </Campo>
            </div>
          </div>

          {offline ? (
            <button
              type="button"
              onClick={reload}
              className="self-start text-[10px] font-semibold text-acc2 hover:underline"
            >
              Tentar conectar novamente
            </button>
          ) : null}
        </div>
      )}
    </Card>
  );
}
