// component/ui/categories/CategoryActiveSwitch.tsx
"use client";

import * as React from "react";
import Switch from "@/component/util/base/Switch";
import { useActionState, startTransition } from "react";
import { toggleCategoryStatus, type ActionResult } from "@/app/[locale]/(admin)/master/categories/actions";
import { useActionToast } from "@/hook/useActionToast";

type Props = {
  categoryId: string;
  initialActive: boolean;
  disabled?: boolean;
  onSaved?: (next: boolean) => void;
};

export function CategoryActiveSwitch({
  categoryId,
  initialActive,
  disabled,
  onSaved,
}: Props) {
  const [on, setOn] = React.useState<boolean>(initialActive);

  // 🔒 guard lokal agar klik ganda sebelum pending=true tertahan
  const [localPending, setLocalPending] = React.useState(false);

  const [result, formAction, pending] = useActionState<ActionResult, FormData>(
    toggleCategoryStatus,
    { ok: false, message: "" }
  );

  // Toast (opsional)
  useActionToast(result, pending, {
    success: { title: "Status updated", description: r => r.message },
    error:   { title: "Update failed" },
  });

  // Revert kalau gagal
  React.useEffect(() => {
    if (!pending && !result.ok && result.message) {
      // Balikkan ke nilai sebelum klik (optimistic revert)
      setOn(prev => !prev);
    }
  }, [pending, result.ok, result.message]);

  // Sinkronkan localPending dengan siklus action
  React.useEffect(() => {
    if (!pending) setLocalPending(false);
  }, [pending]);

  const commit = (next: boolean) => {
    // ⛔ blok saat sedang proses
    if (disabled || localPending || pending) return;

    // 1) lock lokal + optimistic UI
    setLocalPending(true);
    setOn(next);

    // 2) kirim ke server action
    const fd = new FormData();
    fd.set("id", String(categoryId));
    fd.set("status", String(next));
    // safe untuk dipanggil langsung; startTransition biar non-blocking
    startTransition(() => formAction(fd));

    // 3) Callback eksternal (opsional)
    onSaved?.(next);
  };

  const isDisabled = disabled || pending || localPending;

  return (
    <Switch
      checked={on}
      onChange={commit}
      aria-label="Aktif/nonaktif kategori"
      name={`category-${categoryId}-active`}
      value="true"
      size="sm"
      disabled={isDisabled}
    />
  );
}
