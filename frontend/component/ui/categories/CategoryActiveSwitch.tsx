'use client'

import * as React from 'react'
import Switch from "@/component/util/base/Switch";

type Props = {
  categoryId: string;
  /** untuk uncontrolled */
  initialActive?: boolean;
  /** untuk controlled (opsional) */
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}

export function CategoryActiveSwitch({
  categoryId,
  initialActive = false,
  checked,            // ← kalau dikirim, komponen jadi controlled
  onChange,
  disabled,
}: Props) {
  const isControlled = checked !== undefined;

  const [on, setOn] = React.useState<boolean>(initialActive);

  // ⬇️ sinkronkan state saat prop berubah / row berganti
  React.useEffect(() => {
    if (!isControlled) setOn(initialActive);
  }, [initialActive, isControlled, categoryId]);

  const handleChange = (next: boolean) => {
    if (!isControlled) setOn(next); // optimistic local
    onChange?.(next);
  };

  return (
    <Switch
      checked={isControlled ? !!checked : on}
      onChange={handleChange}
      aria-label="Aktif/nonaktif kategori"
      name={`category-${categoryId}-active`}
      value="true"
      size="sm"
      disabled={disabled}
    />
  );
}
