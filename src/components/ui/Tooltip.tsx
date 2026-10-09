export function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-bg4 px-1.5 py-0.5 text-[9px] text-t1 opacity-0 transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}
