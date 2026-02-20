"use client"

import { useEffect, useRef } from "react"

interface Particle {
  gridX: number
  gridY: number
  opacity: number
  targetOpacity: number
  size: number
  targetSize: number
  flickerSpeed: number
  scale: number
  targetScale: number
  distanceFromLeft: number
  baseSize: number
}

interface Wave {
  startTime: number
}

export function ConnectionAnimation({ shape = "circle" }: { shape?: "circle" | "triangle" | "square" | "diamond" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const gridInfoRef = useRef({ cols: 0, rows: 0, spacing: 8 }) // Updated spacing from 10 to 8
  const wavesRef = useRef<Wave[]>([])
  const lastWaveCreationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const initializeParticles = () => {
      const spacing = 8 // Updated spacing from 10 to 8 for consistency with Analyze and Think
      const cols = Math.ceil(canvas.width / spacing)
      const rows = Math.ceil(canvas.height / spacing)

      gridInfoRef.current = { cols, rows, spacing }

      particlesRef.current = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const opacity = Math.random()
          const baseSize = Math.random() * 1.5 + 1 // Updated baseSize from (0.3-1) to (1-2.5) to match Analyze and Think
          const size = baseSize
          const distanceFromLeft = col

          particlesRef.current.push({
            gridX: col * spacing + spacing / 2,
            gridY: row * spacing + spacing / 2,
            opacity,
            targetOpacity: opacity,
            size,
            targetSize: size,
            flickerSpeed: Math.random() * 0.08 + 0.05,
            scale: 1,
            targetScale: 1,
            distanceFromLeft,
            baseSize,
          })
        }
      }
    }

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initializeParticles()
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`

      switch (shape) {
        case "circle":
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
          break
        case "triangle":
          ctx.beginPath()
          ctx.moveTo(x, y - size)
          ctx.lineTo(x - size * 0.866, y + size * 0.5)
          ctx.lineTo(x + size * 0.866, y + size * 0.5)
          ctx.closePath()
          ctx.fill()
          break
        case "square":
          ctx.fillRect(x - size, y - size, size * 2, size * 2)
          break
        case "diamond":
          ctx.beginPath()
          ctx.moveTo(x, y - size)
          ctx.lineTo(x + size, y)
          ctx.lineTo(x, y + size)
          ctx.lineTo(x - size, y)
          ctx.closePath()
          ctx.fill()
          break
      }
    }

    const animate = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const maxDistance = gridInfoRef.current.cols
      const currentTime = Date.now()

      // Create new waves every 1.2 seconds
      if (wavesRef.current.length === 0 || currentTime - lastWaveCreationRef.current >= 1200) {
        wavesRef.current.push({ startTime: currentTime })
        lastWaveCreationRef.current = currentTime
      }

      // Remove waves that have passed the screen
      wavesRef.current = wavesRef.current.filter((wave) => {
        const waveAge = (currentTime - wave.startTime) / 1000
        const wavePosition = waveAge * 35 // Increased wave speed from 25 to 35 for faster horizontal propagation
        return wavePosition < maxDistance + 20
      })

      particlesRef.current.forEach((particle) => {
        const distanceFadeForSize = Math.max(0, 1 - particle.distanceFromLeft / (maxDistance * 1.2))
        const baseSize = particle.baseSize * (0.3 + distanceFadeForSize * 0.7)

        let maxOpacity = 0
        let maxScale = 0

        // Process all active waves
        wavesRef.current.forEach((wave) => {
          const waveAge = (currentTime - wave.startTime) / 1000
          const wavePosition = waveAge * 35 // Increased wave speed from 25 to 35
          const distanceDiff = Math.abs(particle.distanceFromLeft - wavePosition)

          const waveWidth = 40
          const risePhase = waveWidth * 0.3
          const holdPhase = waveWidth * 0.4
          const fallPhase = waveWidth * 0.3

          if (distanceDiff < waveWidth) {
            let waveIntensity = 0

            // Calculate wave intensity based on phase
            if (distanceDiff < risePhase) {
              waveIntensity = distanceDiff / risePhase
            } else if (distanceDiff < risePhase + holdPhase) {
              waveIntensity = 1
            } else {
              const fallProgress = (distanceDiff - risePhase - holdPhase) / fallPhase
              waveIntensity = 1 - fallProgress
            }

            const distanceFade = Math.max(0, 1 - particle.distanceFromLeft / (maxDistance * 1.5))
            const effectiveIntensity = waveIntensity * distanceFade

            maxOpacity = Math.max(maxOpacity, effectiveIntensity)
            maxScale = Math.max(maxScale, effectiveIntensity * 2)
          }
        })

        particle.targetOpacity = maxOpacity
        particle.targetScale = maxScale
        particle.targetSize = baseSize

        // Smooth transitions with easing
        particle.opacity += (particle.targetOpacity - particle.opacity) * (particle.flickerSpeed * 0.6) // Increased flickerSpeed multiplier from 0.4 to 0.6 for faster transitions
        particle.size += (particle.targetSize - particle.size) * (particle.flickerSpeed * 0.6)
        particle.scale += (particle.targetScale - particle.scale) * (particle.flickerSpeed * 0.6)

        const finalSize = particle.size * particle.scale

        drawShape(ctx, particle.gridX, particle.gridY, finalSize, particle.opacity)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [shape]) // Added shape to dependency array

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-green-500/40 to-slate-900/50 blur-3xl scale-125" />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-transparent to-emerald-800/40 blur-2xl scale-125" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
