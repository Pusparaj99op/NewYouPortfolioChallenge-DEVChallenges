"use client"

import { useEffect, useRef } from "react"
import type { ShapeType } from "@/app/page"

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
  gridCol: number
  gridRow: number
}

interface PathSegment {
  x: number
  y: number
}

interface Connection {
  startIndex: number
  endIndex: number
  progress: number
  speed: number
  opacity: number
  path: PathSegment[]
}

const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shape: ShapeType) => {
  ctx.beginPath()

  switch (shape) {
    case "circle":
      ctx.arc(x, y, size, 0, Math.PI * 2)
      break

    case "triangle":
      ctx.moveTo(x, y - size)
      ctx.lineTo(x - size, y + size)
      ctx.lineTo(x + size, y + size)
      ctx.closePath()
      break

    case "square":
      ctx.rect(x - size, y - size, size * 2, size * 2)
      break

    case "diamond":
      ctx.moveTo(x, y - size)
      ctx.lineTo(x + size, y)
      ctx.lineTo(x, y + size)
      ctx.lineTo(x - size, y)
      ctx.closePath()
      break
  }

  ctx.fill()
}

export function ThinkingAnimation({ shape }: { shape: ShapeType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const animationFrameRef = useRef<number>()
  const gridInfoRef = useRef({ cols: 0, rows: 0, spacing: 20 })

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

      particlesRef.current = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const opacity = Math.random()
          const size = Math.random() * 1.5 + 1

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
            gridCol: col,
            gridRow: row,
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

    const createOrthogonalPath = (startParticle: Particle, endParticle: Particle): PathSegment[] => {
      const path: PathSegment[] = []
      const { spacing } = gridInfoRef.current

      let currentCol = startParticle.gridCol
      let currentRow = startParticle.gridRow
      const targetCol = endParticle.gridCol
      const targetRow = endParticle.gridRow

      path.push({ x: startParticle.gridX, y: startParticle.gridY })

      const horizontalFirst = Math.random() > 0.5

      if (horizontalFirst) {
        while (currentCol !== targetCol) {
          currentCol += currentCol < targetCol ? 1 : -1
          path.push({
            x: currentCol * spacing + spacing / 2,
            y: currentRow * spacing + spacing / 2,
          })
        }
        while (currentRow !== targetRow) {
          currentRow += currentRow < targetRow ? 1 : -1
          path.push({
            x: currentCol * spacing + spacing / 2,
            y: currentRow * spacing + spacing / 2,
          })
        }
      } else {
        while (currentRow !== targetRow) {
          currentRow += currentRow < targetRow ? 1 : -1
          path.push({
            x: currentCol * spacing + spacing / 2,
            y: currentRow * spacing + spacing / 2,
          })
        }
        while (currentCol !== targetCol) {
          currentCol += currentCol < targetCol ? 1 : -1
          path.push({
            x: currentCol * spacing + spacing / 2,
            y: currentRow * spacing + spacing / 2,
          })
        }
      }

      return path
    }

    const createConnection = () => {
      if (particlesRef.current.length < 2) return

      const startIndex = Math.floor(Math.random() * particlesRef.current.length)
      let endIndex = Math.floor(Math.random() * particlesRef.current.length)

      while (endIndex === startIndex) {
        endIndex = Math.floor(Math.random() * particlesRef.current.length)
      }

      const path = createOrthogonalPath(particlesRef.current[startIndex], particlesRef.current[endIndex])

      connectionsRef.current.push({
        startIndex,
        endIndex,
        progress: 0,
        speed: Math.random() * 0.008 + 0.008,
        opacity: Math.random() * 0.3 + 0.2,
        path,
      })
    }

    const connectionInterval = setInterval(() => {
      if (connectionsRef.current.length < 8) {
        createConnection()
      }
    }, 800)

    const animate = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      connectionsRef.current = connectionsRef.current.filter((connection) => {
        const start = particlesRef.current[connection.startIndex]
        const end = particlesRef.current[connection.endIndex]

        if (!start || !end) return false

        connection.progress += connection.speed

        if (connection.progress >= 1) {
          return false
        }

        const totalSegments = connection.path.length - 1
        const currentSegment = Math.min(Math.floor(connection.progress * totalSegments), totalSegments - 1)
        const segmentProgress = (connection.progress * totalSegments) % 1

        const currentPoint = connection.path[currentSegment]
        const nextPoint = connection.path[currentSegment + 1]

        const currentX = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress
        const currentY = currentPoint.y + (nextPoint.y - currentPoint.y) * segmentProgress

        ctx.strokeStyle = `rgba(255, 255, 255, ${connection.opacity * (1 - connection.progress * 0.5)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(connection.path[0].x, connection.path[0].y)

        for (let i = 1; i <= currentSegment; i++) {
          ctx.lineTo(connection.path[i].x, connection.path[i].y)
        }
        ctx.lineTo(currentX, currentY)
        ctx.stroke()

        const dotSize = 2
        ctx.fillStyle = `rgba(255, 255, 255, ${connection.opacity * 1.5})`
        ctx.beginPath()
        ctx.arc(currentX, currentY, dotSize, 0, Math.PI * 2)
        ctx.fill()

        return true
      })

      particlesRef.current.forEach((particle) => {
        if (Math.random() < 0.08) {
          particle.targetOpacity = Math.random()
          particle.targetSize = Math.random() * 2 + 0.5
          particle.targetScale = 1 + Math.random() * 0.15
        }

        particle.opacity += (particle.targetOpacity - particle.opacity) * (particle.flickerSpeed * 0.6)
        particle.size += (particle.targetSize - particle.size) * (particle.flickerSpeed * 0.6)
        particle.scale += (particle.targetScale - particle.scale) * (particle.flickerSpeed * 0.6)

        const finalSize = particle.size * particle.scale

        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        drawShape(ctx, particle.gridX, particle.gridY, finalSize, shape)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      clearInterval(connectionInterval)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [shape])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/40 to-indigo-900/50 blur-3xl scale-125" />
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/60 via-transparent to-purple-900/40 blur-2xl scale-125" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
