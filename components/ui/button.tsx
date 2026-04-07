import Link from "next/link"
import { cn } from "@/lib/utils"

type ButtonVariant = "primary" | "secondary" | "ghost"

type BaseProps = {
  children: React.ReactNode
  className?: string
  variant?: ButtonVariant
}

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>

type LinkButtonProps = BaseProps & {
  href: string
}

function getStyles(variant: ButtonVariant) {
  const base =
    "inline-flex items-center justify-center min-h-11 px-5 py-3 text-sm font-medium rounded-2xl transition-all duration-150 select-none"

  const interaction =
    "active:scale-[0.97] active:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"

  const variants = {
    primary:
      "bg-black text-white hover:opacity-90 active:bg-black/80",
    secondary:
      "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100",
    ghost:
      "text-slate-700 hover:bg-slate-100 active:bg-slate-200",
  }

  return cn(base, interaction, variants[variant])
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button className={cn(getStyles(variant), className)} {...props}>
      {children}
    </button>
  )
}

export function LinkButton({
  children,
  href,
  className,
  variant = "primary",
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(getStyles(variant), className)}
    >
      {children}
    </Link>
  )
}