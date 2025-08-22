'use client'

import * as React from 'react'
import Switch from "@/component/util/base/Switch";

type Props = {
  categoryId: string
  initialActive: boolean
  revalidatePathAfter?: string // contoh: '/admin/categories'
  disabled?: boolean
}

export function CategoryActiveSwitch({
  categoryId,
  initialActive,
}: Props) {
  const [on, setOn] = React.useState(initialActive)

  const handleChange = (next: boolean) => {
    // optimistic
    setOn(next)
  }

  return (
    <Switch
      checked={on}
      onChange={handleChange}
      aria-label="Aktif/nonaktif kategori"
      // optional: kamu bisa beri name/value jika suatu saat ingin kirim via form
      name={`category-${categoryId}-active`}
      value="true"
      size={"md"}
    />
  )
}
