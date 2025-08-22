'use client'
import * as React from 'react'

type Size = 'sm' | 'md' | 'lg' | 'xl'

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
  size?: Size
}

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
      size = 'md',
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

    // Track/thumb/translate + font-size untuk emoji
    const sizeMap: Record<Size, { track: string; thumb: string; translate: string; emoji: string }> = {
      sm: { track: 'w-12 h-6',  thumb: 'after:w-4  after:h-4',  translate: 'peer-checked:after:translate-x-6',  emoji: 'after:text-[10px]' },
      md: { track: 'w-16 h-8',  thumb: 'after:w-6  after:h-6',  translate: 'peer-checked:after:translate-x-8',  emoji: 'after:text-[14px]' },
      lg: { track: 'w-20 h-10', thumb: 'after:w-8  after:h-8',  translate: 'peer-checked:after:translate-x-10', emoji: 'after:text-[18px]' },
      xl: { track: 'w-24 h-12', thumb: 'after:w-10 after:h-10', translate: 'peer-checked:after:translate-x-12', emoji: 'after:text-[20px]' },
    }
    const s = sizeMap[size]

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
            // kelas asli + tambahan untuk font-size & line-height emoji
            `group peer ring-0 bg-gradient-to-tr from-quaternary via-quinary to-danger rounded-full outline-none duration-300 after:duration-300 shadow-md peer-checked:bg-success peer-focus:outline-none
             after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:top-1 after:left-1 after:-rotate-180 after:flex after:justify-center after:items-center
             after:leading-none after:select-none
             peer-checked:after:content-['✔️'] peer-hover:after:scale-95 peer-checked:after:rotate-0
             peer-checked:bg-gradient-to-tr peer-checked:from-green-300 peer-checked:via-secondary/40 peer-checked:to-success`,
            s.track,
            s.thumb,
            s.translate,
            s.emoji,
            className ?? '',
          ].join(' ')}
        />
      </label>
    )
  },
)
Switch.displayName = 'Switch'

export default Switch
