"use client";
import React, {
  createContext, useCallback, useContext, useMemo, useRef, useState,
} from "react";

type Variant = "success" | "error" | "info" | "warning";
type ToastOpts = {
  title?: string;
  description?: string;
  variant?: Variant;
  duration?: number; // ms (default 3000)
};
type ToastItem = Required<ToastOpts> & { id: string };

type Ctx = {
  showToast: (opts: ToastOpts) => string;
  dismissToast: (id: string) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback((opts: ToastOpts) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
    const toast: ToastItem = {
      id,
      title: opts.title ?? "",
      description: opts.description ?? "",
      variant: opts.variant ?? "success",
      duration: opts.duration ?? 3000,
    };
    setToasts((prev) => [...prev, toast]);
    const timer = window.setTimeout(() => dismissToast(id), toast.duration);
    timers.current.set(id, timer);
    return id;
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastCtx.Provider value={value}>
      {children}

      {/* Viewport (SSR-safe: kosong saat SSR) */}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[1000] flex w-auto flex-col gap-2"
        aria-live="polite" aria-atomic="false" role="status"
      >
        {toasts.map((t) => (
          <Toast key={t.id} item={t} onClose={() => dismissToast(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

function Toast({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const color =
    item.variant === "success" ? "bg-emerald-600"
      : item.variant === "error" ? "bg-red-600"
        : item.variant === "warning" ? "bg-amber-500"
          : "bg-blue-600";

  return (
    <div className={`pointer-events-auto flex min-w-[260px] max-w-[360px] items-start gap-3 rounded-2xl ${color} p-3 text-white shadow-lg transition-all`}>
      <div className="mt-0.5">
        {item.variant === "success" ? "✅"
          : item.variant === "error" ? "⛔"
            : item.variant === "warning" ? "⚠️" : "ℹ️"}
      </div>
      <div className="flex-1">
        {item.title && <div className="text-sm font-semibold leading-tight">{item.title}</div>}
        {item.description && <div className="text-xs opacity-90">{item.description}</div>}
      </div>
      <button
        onClick={onClose}
        className="ml-2 rounded-md bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
        aria-label="Close"
      >
        Close
      </button>
    </div>
  );
}
