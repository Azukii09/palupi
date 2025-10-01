// component/ui/categories/CategoryActiveSwitch.tsx
"use client";

import * as React from "react";
import Switch from "@/component/util/base/Switch";
import {useActionState, startTransition, useCallback, useMemo, useEffect, useState, useRef} from "react";
import { useActionToast } from "@/hook/useActionToast";
import { categoryToggleInitialState, CategoryToggleState } from "@/features/categories/state/categoryInitialState";
import {toggleCategoryStatus} from "@/features/categories/actions/actions";

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
  const [on, setOn] = useState<boolean>(initialActive);
  const [localPending, setLocalPending] = useState(false);

  const [state, formAction, pending] = useActionState<CategoryToggleState, FormData>(
    toggleCategoryStatus,
    categoryToggleInitialState
  );

  // track siklus submit: false→true menandakan submit dimulai
  const prevPending = useRef(pending);
  const didSubmitRef = useRef(false);

  useEffect(() => {
    if (!prevPending.current && pending) {
      didSubmitRef.current = true;
    }
    prevPending.current = pending;
  }, [pending]);

  // selector STABIL
  const getOk = useCallback((s: CategoryToggleState) => s.ok, []);
  const getMessage = useCallback(
    (s: CategoryToggleState) => (s.ok ? s.data?.message : s.errors?._form?.[0]),
    []
  );

  const toastOpts = useMemo(
    () => ({
      success: {
        title: "toggle category status:",
        description: (s: CategoryToggleState) => (s.ok ? s.data!.message : undefined),
        duration: 5000,
      },
      error: {
        title: "toggle category status:",
        description: (s: CategoryToggleState) => (!s.ok ? s.errors?._form?.[0] : undefined),
        duration: 5000,
      },
      accessors: { getOk, getMessage },
      requireSubmitStart: true, // penting
    }),
    [getOk, getMessage]
  );

  useActionToast<CategoryToggleState>(state, pending, toastOpts);

  // ✅ Revert hanya jika submit memang terjadi & berakhir gagal
  useEffect(() => {
    if (!pending && didSubmitRef.current && !state.ok && state.errors && Object.keys(state.errors).length > 0) {
      setOn(prev => !prev);
      didSubmitRef.current = false; // reset siklus
    }
  }, [pending, state.ok, state.errors]);

  // Sinkronkan localPending
  useEffect(() => {
    if (!pending) setLocalPending(false);
  }, [pending]);

  // (opsional) kalau initialActive dari props berubah karena router.refresh(), sinkronkan ulang:
  useEffect(() => {
    setOn(initialActive);
  }, [initialActive]);

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
