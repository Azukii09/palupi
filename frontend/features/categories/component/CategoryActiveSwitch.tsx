// component/ui/categories/CategoryActiveSwitch.tsx
"use client";

import * as React from "react";
import Switch from "@/component/util/base/Switch";
import {useActionState, startTransition, useCallback, useMemo} from "react";
import { toggleCategoryStatus } from "@/features/categories/actions/actions";
import { useActionToast } from "@/hook/useActionToast";
import {
  categoryToggleInitialState,
  CategoryToggleState
} from "@/features/categories/state/categoryInitialState";

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

  const [state, formAction, pending] = useActionState<CategoryToggleState, FormData>(
    toggleCategoryStatus,
    categoryToggleInitialState
  );

  // selector STABIL (tak bergantung apa pun)
  const getOk = useCallback((s: CategoryToggleState) => s.ok, []);
  const getMessage = useCallback(
    (s: CategoryToggleState) => (s.ok ? s.data?.message : s.errors?._form?.[0]),
    []
  );

// objekt opsi STABIL; hanya berubah saat tCategory berubah
  const toastOpts = useMemo(
    () => ({
      success: {
        title: "toggle category status:",
        description: (s: CategoryToggleState) => (s.ok ? s.data.message : undefined),
        duration: 5000,
      },
      error: {
        title: "toggle category status:",
        description: (s: CategoryToggleState) => (!s.ok ? s.errors?._form?.[0] : undefined),
        duration: 5000,
      },
      accessors: { getOk, getMessage },
      requireSubmitStart: true,
    }),
    [getOk, getMessage]
  );

// pakai seperti biasa
  useActionToast<CategoryToggleState>(state, pending, toastOpts);

  // Revert kalau gagal
  React.useEffect(() => {
    if (!pending && !state.ok && state.errors) {
      // Balikkan ke nilai sebelum klik (optimistic revert)
      setOn(prev => !prev);
    }
  }, [pending, state.ok, state.errors]);

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
