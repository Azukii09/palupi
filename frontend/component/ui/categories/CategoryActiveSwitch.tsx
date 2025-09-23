// component/ui/categories/CategoryActiveSwitch.tsx
"use client";

import * as React from "react";
import Switch from "@/component/util/base/Switch";
import { useActionState, startTransition } from "react";
import { toggleCategoryStatus, type ActionResult } from "@/app/[locale]/(admin)/master/categories/actions";
// (opsional) untuk toast:
import { useActionToast } from "@/hook/useActionToast";

type Props = {
  categoryId: string;         // atau number, samakan juga di server action
  initialActive: boolean;     // nilai awal dari DB
  disabled?: boolean;
  // (opsional) kalau mau tahu hasil:
  onSaved?: (next: boolean) => void;
};

export function CategoryActiveSwitch({
  categoryId,
  initialActive,
  disabled,
  onSaved,
}: Props) {
  // State lokal per row (optimistic)
  const [on, setOn] = React.useState<boolean>(initialActive);

  // Server action per switch (independen)
  const [result, formAction, pending] = useActionState<ActionResult, FormData>(
    toggleCategoryStatus,
    { ok: false, message: "" }
  );

  // Toast (opsional)
  useActionToast(result, pending, {
    success: { title: "Status updated", description: r => r.message },
    error:   { title: "Update failed" },
  });

  // Revert kalau server gagal
  React.useEffect(() => {
    if (!pending && !result.ok && result.message) {
      // Balikkan ke nilai sebelum klik (optimistic revert)
      setOn(prev => !prev);
    }
  }, [pending, result.ok, result.message]);

  const commit = (next: boolean) => {
    // 1) Optimistic UI
    setOn(next);

    // 2) Kirim ke server action
    const fd = new FormData();
    fd.set("id", String(categoryId));
    fd.set("status", String(next));
    // safe untuk dipanggil langsung; startTransition biar non-blocking
    startTransition(() => formAction(fd));

    // 3) Callback eksternal (opsional)
    onSaved?.(next);
  };

  return (
    <Switch
      checked={on}
      onChange={commit}
      aria-label="Aktif/nonaktif kategori"
      name={`category-${categoryId}-active`} // tidak dipakai submit form, tapi aman
      value="true"
      size="sm"
      disabled={disabled || pending}
    />
  );
}
