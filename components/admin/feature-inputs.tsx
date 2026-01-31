"use client"

import { cx } from "~/utils/cva"

interface RatingInputProps {
    value: number | null
    onChange: (value: number | null) => void
    label: string
    description?: string
    max?: number
    className?: string
}

export function RatingInput({
    value,
    onChange,
    label,
    description,
    max = 5,
    className
}: RatingInputProps) {
    const ratings = Array.from({ length: max + 1 }, (_, i) => i)

    return (
        <div className={cx("flex items-center justify-between py-2 border-b last:border-0 gap-4", className)}>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{label}</p>
                {description && <p className="text-xs text-muted-foreground truncate">{description}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
                {ratings.map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => onChange(value === rating ? null : rating)}
                        className={cx(
                            "size-8 rounded text-sm font-medium transition-colors",
                            value === rating
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                        )}
                    >
                        {rating}
                    </button>
                ))}
            </div>
        </div>
    )
}

interface BooleanInputProps {
    value: boolean | null
    onChange: (value: boolean | null) => void
    label: string
    description?: string
    className?: string
}

export function BooleanInput({
    value,
    onChange,
    label,
    description,
    className,
}: BooleanInputProps) {
    return (
        <div className={cx("flex items-center justify-between py-2 border-b last:border-0 gap-4", className)}>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{label}</p>
                {description && <p className="text-xs text-muted-foreground truncate">{description}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
                <button
                    type="button"
                    onClick={() => onChange(value === true ? null : true)}
                    className={cx(
                        "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                        value === true
                            ? "bg-green-600 text-white"
                            : "bg-muted hover:bg-muted/80"
                    )}
                >
                    Yes
                </button>
                <button
                    type="button"
                    onClick={() => onChange(value === false ? null : false)}
                    className={cx(
                        "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                        value === false
                            ? "bg-red-600 text-white"
                            : "bg-muted hover:bg-muted/80"
                    )}
                >
                    No
                </button>
            </div>
        </div>
    )
}

interface TextInputProps {
    value: string | null
    onChange: (value: string | null) => void
    label: string
    description?: string
    placeholder?: string
    className?: string
}

export function TextFieldInput({
    value,
    onChange,
    label,
    description,
    placeholder,
    className,
}: TextInputProps) {
    return (
        <div className={cx("flex items-center justify-between py-2 border-b last:border-0 gap-4", className)}>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{label}</p>
                {description && <p className="text-xs text-muted-foreground truncate">{description}</p>}
            </div>
            <input
                type="text"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || null)}
                placeholder={placeholder}
                className="w-48 px-3 py-1.5 text-sm rounded border bg-background shrink-0"
            />
        </div>
    )
}

interface NumberInputProps {
    value: number | null
    onChange: (value: number | null) => void
    label: string
    description?: string
    placeholder?: string
    className?: string
}

export function NumberFieldInput({
    value,
    onChange,
    label,
    description,
    placeholder,
    className,
}: NumberInputProps) {
    return (
        <div className={cx("flex items-center justify-between py-2 border-b last:border-0 gap-4", className)}>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{label}</p>
                {description && <p className="text-xs text-muted-foreground truncate">{description}</p>}
            </div>
            <input
                type="number"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                placeholder={placeholder}
                className="w-32 px-3 py-1.5 text-sm rounded border bg-background shrink-0"
            />
        </div>
    )
}

interface SelectInputProps {
    value: string | null
    onChange: (value: string | null) => void
    label: string
    description?: string
    options: { value: string; label: string }[]
    className?: string
}

export function SelectInput({
    value,
    onChange,
    label,
    description,
    options,
    className,
}: SelectInputProps) {
    return (
        <div className={cx("flex items-center justify-between py-2 border-b last:border-0 gap-4", className)}>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{label}</p>
                {description && <p className="text-xs text-muted-foreground truncate">{description}</p>}
            </div>
            <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || null)}
                className="w-48 px-3 py-1.5 text-sm rounded border bg-background shrink-0"
            >
                <option value="">Not set</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
