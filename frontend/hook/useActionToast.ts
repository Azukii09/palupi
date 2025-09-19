// components/toast/useActionToast.ts
"use client";
import { useEffect } from "react";
import {useToast} from "@/providers/context/ToastProvider";

type ActionResult = { ok: true } | { ok: false; message: string };

export function useActionToast(result: ActionResult, pending: boolean, msg: { ok: string; fail?: string }) {
  const { showToast } = useToast();

  useEffect(() => {
    if (pending) return;
    if (result?.ok) {
      showToast({ title: msg.ok, variant: "success" });
    } else if (result && "message" in result && result.message) {
      showToast({ title: msg.fail ?? "Failed", description: result.message, variant: "error", duration: 4500 });
    }
  }, [result, pending, msg.ok, msg.fail, showToast]);
}
