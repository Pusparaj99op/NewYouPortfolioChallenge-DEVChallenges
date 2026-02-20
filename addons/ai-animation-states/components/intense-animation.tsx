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
  distancesFromCenters: number[]
  baseSize: number
}

interface Wave {
  startTime: number
  centerIndex: number
  isPowerPulse?: boolean
}

export function IntenseAnimation({ shape = "circle" }: { shape?: "circle" | "triangle" | "square" | "diamond" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const gridInfoRef = useRef({ cols: 0, rows: 0, spacing: 20 })
  const wavesRef = useRef<Wave[]>([])
  const lastWaveCreationsRef = useRef<number[]>([0, 0, 0, 0])
  const lastPowerPulseRef = useRef<number>(0)
  const centersRef = useRef<{ x: number; y: number }[]>([])
  const activeCentersRef = useRef<Set<number>>(new Set())

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

      centersRef.current = [
        { x: 0, y: rows / 2 }, // Left
        { x: cols, y: rows / 2 }, // Right
        { x: cols / 2, y: 0 }, // Top
        { x: cols / 2, y: rows }, // Bottom
      ]

      const indices = [0, 1, 2, 3]
      const shuffled = indices.sort(() => Math.random() - 0.5)
      activeCentersRef.current = new Set(shuffled.slice(0, 2))

      particlesRef.current = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const opacity = Math.random()
          const baseSize = Math.random() * 1.5 + 1
          const size = baseSize

          const distancesFromCenters = centersRef.current.map((center) =>
            Math.sqrt(Math.pow(col - center.x, 2) + Math.pow(row - center.y, 2)),
          )

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
            distancesFromCenters,
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

      if (currentTime - lastPowerPulseRef.current >= Math.random() * 3000 + 3000) {
        const activeArray = Array.from(activeCentersRef.current)
        const randomCenterIndex = activeArray[Math.floor(Math.random() * activeArray.length)]
        wavesRef.current.push({
          startTime: currentTime,
          centerIndex: randomCenterIndex,
          isPowerPulse: true,
        })
        lastPowerPulseRef.current = currentTime
      }

      activeCentersRef.current.forEach((centerIndex) => {
        if (currentTime - lastWaveCreationsRef.current[centerIndex] >= 1500) {
          wavesRef.current.push({ startTime: currentTime, centerIndex })
          lastWaveCreationsRef.current[centerIndex] = currentTime
        }
      })

      if (currentTime % 5000 < 16) {
        // Check roughly every 5 seconds
        if (Math.random() < 0.3) {
          // 30% chance to change
          const allIndices = [0, 1, 2, 3]
          const shuffled = allIndices.sort(() => Math.random() - 0.5)
          activeCentersRef.current = new Set(shuffled.slice(0, 2))
        }
      }

      wavesRef.current = wavesRef.current.filter((wave) => {
        const waveAge = (currentTime - wave.startTime) / 1000
        const speed = wave.isPowerPulse ? 120 : 30
        const waveRadius = waveAge * speed
        return waveRadius < maxDistance + 20
      })

      particlesRef.current.forEach((particle) => {
        let maxOpacity = 0
        let maxScale = 0

        wavesRef.current.forEach((wave) => {
          const waveAge = (currentTime - wave.startTime) / 1000
          const speed = wave.isPowerPulse ? 120 : 30
          const waveRadius = waveAge * speed
          const distanceFromWaveCenter = particle.distancesFromCenters[wave.centerIndex]
          const distanceDiff = Math.abs(distanceFromWaveCenter - waveRadius)

          const waveWidth = wave.isPowerPulse ? 30 : 15
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

            const distanceFade = Math.max(0, 1 - distanceFromWaveCenter / (maxDistance * 1.5))
            const intensityMultiplier = wave.isPowerPulse ? 1.5 : 1
            const effectiveIntensity = waveIntensity * distanceFade * intensityMultiplier

            maxOpacity = Math.max(maxOpacity, effectiveIntensity)
            const scaleMultiplier = wave.isPowerPulse ? 3 : 2
            maxScale = Math.max(maxScale, effectiveIntensity * scaleMultiplier)
          }
        })

        const minDistanceFromAnyCenter = Math.min(...particle.distancesFromCenters)
        const distanceFadeForSize = Math.max(0, 1 - minDistanceFromAnyCenter / (maxDistance * 1.2))
        const baseSize = particle.baseSize * (0.3 + distanceFadeForSize * 0.7)

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
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-orange-500/40 to-slate-900/50 blur-3xl scale-125" />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-transparent to-red-800/40 blur-2xl scale-125" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
