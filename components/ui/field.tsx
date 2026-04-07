import * as React from "react"
import { cn } from "@/lib/utils"

type FieldProps = {
  label?: string
  hint?: string
  error?: string
  htmlFor?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

function FieldWrapper({
  label,
  hint,
  error,
  htmlFor,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-slate-900"
        >
          {label}
          {required ? <span className="ml-1 text-rose-600">*</span> : null}
        </label>
      ) : null}

      {children}

      {error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : hint ? (
        <p className="text-sm text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}

const controlBase =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 active:scale-[0.995] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
}

export function Input({
  label,
  hint,
  error,
  id,
  required,
  className,
  ...props
}: InputProps) {
  return (
    <FieldWrapper
      label={label}
      hint={hint}
      error={error}
      htmlFor={id}
      required={required}
    >
      <input
        id={id}
        required={required}
        className={cn(controlBase, className)}
        {...props}
      />
    </FieldWrapper>
  )
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  hint?: string
  error?: string
}

export function Textarea({
  label,
  hint,
  error,
  id,
  required,
  className,
  ...props
}: TextareaProps) {
  return (
    <FieldWrapper
      label={label}
      hint={hint}
      error={error}
      htmlFor={id}
      required={required}
    >
      <textarea
        id={id}
        required={required}
        className={cn(
          controlBase,
          "min-h-[120px] resize-y leading-6",
          className,
        )}
        {...props}
      />
    </FieldWrapper>
  )
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  hint?: string
  error?: string
}

export function Select({
  label,
  hint,
  error,
  id,
  required,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <FieldWrapper
      label={label}
      hint={hint}
      error={error}
      htmlFor={id}
      required={required}
    >
      <select
        id={id}
        required={required}
        className={cn(controlBase, className)}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  )
}