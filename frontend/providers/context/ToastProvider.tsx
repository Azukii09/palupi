// components/toast/ToastProvider.tsx
"use client";
import React, {
  createContext, useCallback, useContext, useMemo, useRef, useState,
} from "react";
import Button from "@/component/util/base/Button";
import { IoCloseSharp} from "react-icons/io5";
import {FaCheckDouble} from "react-icons/fa";
import {BiSolidErrorAlt} from "react-icons/bi";

type Variant = "success" | "error" | "info" | "warning";
type ToastOpts = { title?: string; description?: string; variant?: Variant; duration?: number };
type ToastItem = Required<ToastOpts> & { id: string; leaving: boolean };

type Ctx = {
  showToast: (opts: ToastOpts) => string;   // return id
  dismissToast: (id: string) => void;       // start exit animation
};

const ToastCtx = createContext<Ctx | null>(null);
const EXIT_MS = 220; // durasi animasi keluar (harus >= keyframes toast-out)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const autoTimers = useRef<Map<string, number>>(new Map());
  const exitTimers = useRef<Map<string, number>>(new Map());

  const removeNow = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const t1 = autoTimers.current.get(id); if (t1) clearTimeout(t1);
    const t2 = exitTimers.current.get(id); if (t2) clearTimeout(t2);
    autoTimers.current.delete(id);
    exitTimers.current.delete(id);
  }, []);

  const startExit = useCallback((id: string) => {
    // tandai leaving agar pakai animasi "toast-out"
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, leaving: true } : t)));
    const timer = window.setTimeout(() => removeNow(id), EXIT_MS);
    exitTimers.current.set(id, timer);
    const t1 = autoTimers.current.get(id); if (t1) { clearTimeout(t1); autoTimers.current.delete(id); }
  }, [removeNow]);

  const dismissToast = useCallback((id: string) => startExit(id), [startExit]);

  const showToast = useCallback((opts: ToastOpts) => {
    const id = (typeof crypto !== "undefined" && "randomUUID" in crypto)
      ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

    const toast: ToastItem = {
      id,
      title: opts.title ?? "",
      description: opts.description ?? "",
      variant: opts.variant ?? "success",
      duration: opts.duration ?? 3000,
      leaving: false,
    };

    setToasts(prev => [...prev, toast]);

    // auto-dismiss → trigger exit, bukan langsung hapus
    const timer = window.setTimeout(() => startExit(id), toast.duration);
    autoTimers.current.set(id, timer);

    return id;
  }, [startExit]);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastCtx.Provider value={value}>
      {children}

      {/* viewport */}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[1000] flex w-auto flex-col gap-2"
        aria-live="polite" aria-atomic="false" role="status"
      >
        {toasts.map(t => (
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

/* Presentational */
function Toast({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const color =
    item.variant === "success" ? "bg-success"
      : item.variant === "error" ? "bg-danger"
        : item.variant === "warning" ? "bg-warning"
          : "bg-blue-600";

  const anim = item.leaving
    ? "animate-[toast-out_200ms_ease-in_forwards]"
    : "animate-[toast-in_200ms_ease-out]";

  return (
    <div
      className={`pointer-events-auto flex min-w-[260px] max-w-[360px] items-start justify-center gap-3 rounded-2xl ${color} p-3 text-white shadow-lg ${anim}`}
    >
      <div className="mt-0.5">
        {item.variant === "success" ? <FaCheckDouble className="size-6 text-white"/>
          : item.variant === "error" ? <BiSolidErrorAlt className="size-6 text-white" />
            : item.variant === "warning" ? "⚠️" : "ℹ️"}
      </div>
      <div className="flex-1">
        {item.title && <div className="text-sm font-semibold leading-tight">{item.title}</div>}
        {item.description && <div className="text-xs opacity-90">{item.description}</div>}
      </div>
      <Button
        buttonType={"button"}
        variant={"danger"}
        variantType={"solid-rounded"}
        buttonName={"Close"}
        buttonText={"Close"}
        size={"xs"}
        onlyIcon
        icon={<IoCloseSharp className={"size-4 text-white"}/>}
        isBadge
        handler={onClose}
      />
    </div>
  );
}
