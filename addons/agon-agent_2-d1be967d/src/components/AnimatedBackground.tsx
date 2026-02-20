import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.to('.orb-a', { y: 60, x: -40, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to('.orb-b', { y: -70, x: 30, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to('.orb-c', { y: 40, x: 50, duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to('.grid', { backgroundPosition: '0px 0px', duration: 18, repeat: -1, ease: 'none' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid absolute inset-0 opacity-45 [background-size:22px_22px] [background-position:0px_22px] bg-[radial-gradient(circle_at_1px_1px,rgba(0,240,255,0.10)_1px,transparent_0)]" />
      <div className="orb-a absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--hx-purple)]/20 blur-3xl" />
      <div className="orb-b absolute -bottom-40 left-10 h-[520px] w-[520px] rounded-full bg-[color:var(--hx-cyan)]/14 blur-3xl" />
      <div className="orb-c absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[color:var(--hx-purple)]/12 blur-3xl" />
    </div>
  )
}
