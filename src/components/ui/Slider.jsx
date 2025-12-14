import { forwardRef } from 'react'
import { cn, formatCurrency, formatNumber } from '../../lib/utils'

const Slider = forwardRef(
  (
    {
      label,
      value,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      formatValue,
      showMinMax = true,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const displayValue = formatValue ? formatValue(value) : value

    const handleChange = (e) => {
      const newValue = parseFloat(e.target.value)
      onChange(newValue)
    }

    // Calculate percentage for gradient fill
    const percentage = ((value - min) / (max - min)) * 100

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className="text-body font-medium text-mx-slate-700">
              {label}
            </label>
            <span className="text-body-lg font-semibold text-mx-purple-700 font-mono">
              {displayValue}
            </span>
          </div>
        )}

        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={cn(
            'w-full h-2 rounded-full appearance-none cursor-pointer',
            'bg-mx-slate-200',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-6',
            '[&::-webkit-slider-thumb]:h-6',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-gradient-to-br',
            '[&::-webkit-slider-thumb]:from-mx-purple-500',
            '[&::-webkit-slider-thumb]:to-mx-purple-700',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:duration-150',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-6',
            '[&::-moz-range-thumb]:h-6',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-gradient-to-br',
            '[&::-moz-range-thumb]:from-mx-purple-500',
            '[&::-moz-range-thumb]:to-mx-purple-700',
            '[&::-moz-range-thumb]:border-none',
            '[&::-moz-range-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:shadow-md',
            className
          )}
          style={{
            background: `linear-gradient(to right, #7C3AED 0%, #7C3AED ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`,
          }}
          {...props}
        />

        {showMinMax && (
          <div className="flex justify-between mt-1 text-body-sm text-mx-slate-500">
            <span>{formatValue ? formatValue(min) : min}</span>
            <span>{formatValue ? formatValue(max) : max}</span>
          </div>
        )}
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export default Slider

// Preset slider for currency values
export function CurrencySlider({ value, onChange, min, max, label, ...props }) {
  return (
    <Slider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      label={label}
      formatValue={(v) => formatCurrency(v)}
      {...props}
    />
  )
}

// Preset slider for km values
export function KilometerSlider({ value, onChange, min, max, label, ...props }) {
  return (
    <Slider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      label={label}
      formatValue={(v) => `${formatNumber(v)} km`}
      {...props}
    />
  )
}

// Preset slider for year values
export function YearSlider({ value, onChange, min, max, label, ...props }) {
  return (
    <Slider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={1}
      label={label}
      formatValue={(v) => `${v} year${v > 1 ? 's' : ''}`}
      {...props}
    />
  )
}
