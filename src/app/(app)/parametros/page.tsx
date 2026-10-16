"use client";

import { useToast } from "@/context/ToastContext";
import { Card } from "@/components/ui/Card";
import { FileText } from "lucide-react";

export default function ParametrosPage() {
  const { toast } = useToast();

  return (
    <div className="animate-fade-in">
      <Card>
        <div className="mb-2 text-[12px] font-semibold text-t1">Parâmetros do Sistema</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-t3">Entidade demo (RPPS)</label>
            <input
              value="FUMPRES — Salvador/BA"
              readOnly
              className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t2 opacity-70"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-t3">Manual de referência</label>
            <input
              value="Pró-Gestão RPPS v4.1"
              readOnly
              className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t2 opacity-70"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-t3">Nível atual</label>
            <select defaultValue="Nível III" className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1">
              <option>Nível I</option>
              <option>Nível II</option>
              <option>Nível III</option>
              <option>Nível IV</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-t3">Nível pretendido</label>
            <select defaultValue="Nível IV" className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1">
              <option>Nível I</option>
              <option>Nível II</option>
              <option>Nível III</option>
              <option>Nível IV</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => toast("Salvo!", "ok")}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-acc bg-acc px-2.5 py-[5px] text-[11px] font-medium text-white hover:bg-acc2"
        >
          <FileText className="size-3.5" />
          Salvar
        </button>
      </Card>
    </div>
  );
}
