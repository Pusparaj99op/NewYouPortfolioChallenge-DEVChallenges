import * as React from 'react'
import { cn } from '../lib/utils'

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)] backdrop-blur supports-[backdrop-filter]:bg-[var(--hx-surface)]',
        props.className
      )}
    />
  )
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-5 md:p-6', props.className)} />
}

export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 {...props} className={cn('text-base font-semibold tracking-tight', props.className)} />
  )
}

export function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cn('mt-1 text-sm text-[color:var(--hx-muted)]', props.className)} />
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('px-5 pb-5 md:px-6 md:pb-6', props.className)} />
}

export function Badge({
  variant = 'default',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'soft' | 'outline' }) {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium leading-none'
  const styles =
    variant === 'outline'
      ? 'border border-[var(--hx-border)] text-[color:var(--hx-muted)]'
      : variant === 'soft'
        ? 'bg-[var(--hx-surface)] text-[color:var(--hx-muted)] border border-[var(--hx-border)]'
        : 'bg-white text-slate-900'
  return <span {...props} className={cn(base, styles, className)} />
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-[color:var(--hx-cyan)]/40 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants: Record<string, string> = {
    primary:
      'bg-[linear-gradient(90deg,var(--hx-cyan),var(--hx-purple))] text-black hover:brightness-110',
    secondary:
      'bg-[var(--hx-surface)] text-[color:var(--hx-text)] hover:bg-white/10 border border-[var(--hx-border)]',
    ghost: 'bg-transparent text-[color:var(--hx-muted)] hover:bg-white/10',
    danger: 'bg-[color:var(--hx-red)]/90 text-white hover:bg-[color:var(--hx-red)]',
  }
  const sizes: Record<string, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }

  return <button {...props} className={cn(base, variants[variant], sizes[size], className)} />
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2.5 text-sm text-[color:var(--hx-text)] placeholder:text-[color:var(--hx-muted2)] outline-none focus:ring-2 focus:ring-[color:var(--hx-cyan)]/35',
        props.className
      )}
    />
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2.5 text-sm text-[color:var(--hx-text)] placeholder:text-[color:var(--hx-muted2)] outline-none focus:ring-2 focus:ring-[color:var(--hx-cyan)]/35',
        props.className
      )}
    />
  )
}

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={cn('text-xs font-medium text-[color:var(--hx-muted)]', props.className)} />
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-[var(--hx-border)]', className)} />
}
