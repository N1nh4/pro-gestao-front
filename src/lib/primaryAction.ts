/* ==========================================================================
   Ação primária da topbar — handler registrado pela página ativa.
   O Topbar chama runPrimaryAction(); se nenhuma página registrar um handler,
   mantém o comportamento fallback (toast "em breve").
   ========================================================================== */

type Handler = (() => void) | null;

let handler: Handler = null;

/** Registra o handler e devolve a função de cleanup (usar em useEffect). */
export function setPrimaryAction(next: Handler): () => void {
  handler = next;
  return () => {
    if (handler === next) handler = null;
  };
}

/** Executa o handler da página ativa. Retorna false se não houver handler. */
export function runPrimaryAction(): boolean {
  if (!handler) return false;
  handler();
  return true;
}
