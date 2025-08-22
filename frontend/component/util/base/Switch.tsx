'use client'
import * as React from 'react'

type Props = {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  name?: string
  value?: string
  id?: string
  'aria-label'?: string
  className?: string
}

/**
 * Ini adalah komponen visualmu, hanya ditambah kemampuan controlled/uncontrolled.
 * Semua kelas Tailwind milikmu dipertahankan.
 */
const Switch = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      disabled,
      name = 'switch',
      value = 'on',
      id,
      'aria-label': ariaLabel = 'Toggle',
      className,
    },
    ref,
  ) => {
    const isControlled = checked !== undefined
    const [internal, setInternal] = React.useState<boolean>(defaultChecked ?? false)
    const isOn = isControlled ? Boolean(checked) : internal

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked
      if (!isControlled) setInternal(next)
      onChange?.(next)
    }

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="sr-only peer"
          name={name}
          value={value}
          aria-label={ariaLabel}
          disabled={disabled}
          checked={isOn}
          onChange={handleChange}
        />
        <div
          className={[
            // kelas asli kamu:
            "group peer ring-0 bg-gradient-to-tr from-quaternary via-quinary to-danger rounded-full outline-none duration-300 after:duration-300 w-24 h-12 shadow-md peer-checked:bg-success peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 after:w-10 after:top-1 after:left-1 after:-rotate-180 after:flex after:justify-center after:items-center peer-checked:after:translate-x-12 peer-checked:after:content-['✔️'] peer-hover:after:scale-95 peer-checked:after:rotate-0 peer-checked:bg-gradient-to-tr peer-checked:from-green-300 peer-checked:via-secondary/40 peer-checked:to-success",
            className ?? '',
          ].join(' ')}
        />
      </label>
    )
  },
)
Switch.displayName = 'Switch'

export default Switch
