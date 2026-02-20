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
  distanceFromCenter: number
  angle: number
  baseSize: number
}

interface Wave {
  startTime: number
}

export function DeepAnimation({ shape = "circle" }: { shape?: "circle" | "triangle" | "square" | "diamond" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const gridInfoRef = useRef({ cols: 0, rows: 0, spacing: 8 })
  const wavesRef = useRef<Wave[]>([])
  const lastWaveCreationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const initializeParticles = () => {
      const spacing = 8
      const cols = Math.ceil(canvas.width / spacing)
      const rows = Math.ceil(canvas.height / spacing)

      gridInfoRef.current = { cols, rows, spacing }

      const centerCol = cols / 2
      const centerRow = rows / 2

      particlesRef.current = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const opacity = Math.random()
          const baseSize = Math.random() * 1.5 + 1
          const size = baseSize
          const dx = col - centerCol
          const dy = row - centerRow
          const distanceFromCenter = Math.sqrt(dx * dx + dy * dy)
          const angle = Math.atan2(dy, dx)

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
            distanceFromCenter,
            angle,
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

      const maxDistance = Math.max(gridInfoRef.current.cols, gridInfoRef.current.rows) * 0.8
      const currentTime = Date.now()

      if (wavesRef.current.length === 0 || currentTime - lastWaveCreationRef.current >= 800) {
        wavesRef.current.push({ startTime: currentTime })
        lastWaveCreationRef.current = currentTime
      }

      wavesRef.current = wavesRef.current.filter((wave) => {
        const waveAge = (currentTime - wave.startTime) / 1000
        const waveRadius = waveAge * 30
        return waveRadius < maxDistance + 20
      })

      particlesRef.current.forEach((particle) => {
        const distanceFadeForSize = particle.distanceFromCenter / (maxDistance * 1.2)
        const baseSize = particle.baseSize * (0.3 + (1 - Math.min(1, distanceFadeForSize)) * 0.7)

        let maxOpacity = 0
        let maxScale = 0

        wavesRef.current.forEach((wave) => {
          const waveAge = (currentTime - wave.startTime) / 1000
          const waveRadius = waveAge * 30
          const spiralRotation = (waveRadius / maxDistance) * Math.PI * 4
          const effectiveAngle = particle.angle + spiralRotation
          const spiralDistance = particle.distanceFromCenter + Math.sin(effectiveAngle * 3) * 5

          const distanceDiff = Math.abs(spiralDistance - waveRadius)

          const waveWidth = 15
          const risePhase = waveWidth * 0.3
          const holdPhase = waveWidth * 0.4
          const fallPhase = waveWidth * 0.3

          if (distanceDiff < waveWidth) {
            let waveIntensity = 0

            if (distanceDiff < risePhase) {
              waveIntensity = distanceDiff / risePhase
            } else if (distanceDiff < risePhase + holdPhase) {
              waveIntensity = 1
            } else {
              const fallProgress = (distanceDiff - risePhase - holdPhase) / fallPhase
              waveIntensity = 1 - fallProgress
            }

            const distanceFade = 1 - particle.distanceFromCenter / (maxDistance * 1.5)
            const effectiveIntensity = waveIntensity * Math.max(0.3, distanceFade)

            maxOpacity = Math.max(maxOpacity, effectiveIntensity)
            maxScale = Math.max(maxScale, effectiveIntensity * 2)
          }
        })

        particle.targetOpacity = maxOpacity
        particle.targetScale = maxScale
        particle.targetSize = baseSize

        particle.opacity += (particle.targetOpacity - particle.opacity) * (particle.flickerSpeed * 0.6)
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
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-purple-950/50 to-violet-950/60 blur-3xl scale-125" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-indigo-950/30 blur-2xl scale-125" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
