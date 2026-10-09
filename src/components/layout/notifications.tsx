"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { useDrawer } from "@/context/DrawerContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface Alerta {
  tone: "red" | "amb";
  titulo: string;
  sub: string;
}

const ALERTAS: Alerta[] = [
  {
    tone: "red",
    titulo: "D-002 · 3.2.2 PLANEJAMENTO — Vencida há 3 dias",
    sub: "Aguardando resposta do Operacional · Carlos Santos (Financeiro)",
  },
  {
    tone: "red",
    titulo: "D-001 · 3.2.8 TRANSPARÊNCIA — Vencida há 1 dia",
    sub: "Roberto Oliveira · TI",
  },
  {
    tone: "amb",
    titulo: "Certificado Isabela Loureiro vencido · 3.1.3",
    sub: "GAB DPR · Renovação urgente",
  },
];

function NotifBody({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex flex-col gap-[7px]">
      {ALERTAS.map((a) => (
        <div
          key={a.titulo}
          className={cn(
            "rounded-[5px] border p-2.5",
            a.tone === "red" ? "border-red/25 bg-red3" : "border-amb/25 bg-amb3",
          )}
        >
          <div
            className={cn(
              "flex items-start gap-1.5 text-[11px] font-bold",
              a.tone === "red" ? "text-red2" : "text-amb2",
            )}
          >
            <TriangleAlert className="mt-px size-3.5 shrink-0" />
            {a.titulo}
          </div>
          <div className="mt-1 text-[10px] text-t3">{a.sub}</div>
          <Button className="mt-1.5 text-[10px]" onClick={onOpen}>
            Abrir Plano de Ação
          </Button>
        </div>
      ))}
      <div className="rounded-[5px] border border-acc/20 bg-acc3 p-2.5 text-[11px] text-acc2">
        Supervisão MPS/PREVIC em 27 dias · 15/07/2026
      </div>
    </div>
  );
}

/** Abre o drawer de notificações (usado pelo sino da Topbar). */
export function useNotifications() {
  const { openDrawer, closeDrawer } = useDrawer();
  const router = useRouter();

  return useCallback(() => {
    const abrirPlano = () => {
      closeDrawer();
      router.push("/plano");
    };
    openDrawer({
      title: "Notificações",
      sub: "Alertas e pendências recentes",
      body: <NotifBody onOpen={abrirPlano} />,
    });
  }, [openDrawer, closeDrawer, router]);
}
