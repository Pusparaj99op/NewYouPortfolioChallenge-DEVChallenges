import React from 'react'
import { cn } from '../lib/utils'

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50 disabled:pointer-events-none'
  const variants: Record<string, string> = {
    primary:
      'bg-white text-slate-900 hover:bg-white/90 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]',
    secondary: 'bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/15',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    danger: 'bg-rose-500 text-white hover:bg-rose-400'
  }
  const sizes: Record<string, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base'
  }
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.8)]',
        className
      )}
      {...props}
    />
  )
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl bg-white/5 px-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-white/25',
        className
      )}
      {...props}
    />
  )
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('text-sm font-medium text-white/80', className)}
      {...props}
    />
  )
}

export function Badge({
  className,
  tone = 'neutral',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'green' | 'amber' | 'rose' | 'blue'
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-white/10 text-white/80 ring-1 ring-white/15',
    green: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20',
    amber: 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/20',
    rose: 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/20',
    blue: 'bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/20'
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className
      )}
      {...props}
    />
  )
}
