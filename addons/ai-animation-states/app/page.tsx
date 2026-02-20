"use client"

import { useState, useEffect, useRef } from "react"
import { ThinkingAnimation } from "@/components/analyze-animation"
import { AbsorptionAnimation } from "@/components/think-animation"
import { ConnectionAnimation } from "@/components/connect-animation"
import { IntenseAnimation } from "@/components/intense-animation"
import { DeepAnimation } from "@/components/deep-animation"
import { TransferAnimation } from "@/components/transfer-animation"
import { AnimatedText } from "@/components/animated-text"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type ShapeType = "circle" | "triangle" | "square" | "diamond"

export default function Page() {
  const [mode, setMode] = useState<"analyze" | "think" | "connect" | "intense" | "deep" | "transfer">("analyze")
  const [textKey, setTextKey] = useState(0)
  const [shape, setShape] = useState<ShapeType>("circle")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const shapeAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5
    }
    if (shapeAudioRef.current) {
      shapeAudioRef.current.volume = 0.5
    }
  }, [])

  useEffect(() => {
    setTextKey((prev) => prev + 1)
  }, [mode])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Handle autoplay restrictions
      })
    }
  }, [mode])

  useEffect(() => {
    if (shapeAudioRef.current) {
      shapeAudioRef.current.currentTime = 0
      shapeAudioRef.current.play().catch(() => {
        // Handle autoplay restrictions
      })
    }
  }, [shape])

  const getModeName = () => {
    switch (mode) {
      case "analyze":
        return "Analyze"
      case "think":
        return "Think"
      case "connect":
        return "Connect"
      case "intense":
        return "Intense"
      case "deep":
        return "Deep"
      case "transfer":
        return "Transfer"
    }
  }

  return (
    <div className="relative w-full h-screen">
      <audio ref={audioRef} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/animation-menu-SBSEhsCLzhfXdw8sBI16r613N8tkGr.mp3" preload="auto" />
      <audio ref={shapeAudioRef} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/select-forms-Y6f2sUOHatrkKO1eoSZpRtMTCUUzTD.mp3" preload="auto" />

      {mode === "analyze" ? (
        <ThinkingAnimation shape={shape} />
      ) : mode === "think" ? (
        <AbsorptionAnimation shape={shape} />
      ) : mode === "connect" ? (
        <ConnectionAnimation shape={shape} />
      ) : mode === "intense" ? (
        <IntenseAnimation shape={shape} />
      ) : mode === "deep" ? (
        <DeepAnimation shape={shape} />
      ) : (
        <TransferAnimation shape={shape} />
      )}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white">
          <AnimatedText key={textKey} text={getModeName()} delay={0} />
        </h1>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
        <Tabs value={shape} onValueChange={(value) => setShape(value as ShapeType)}>
          <TabsList className="backdrop-blur-xl border-white/10 !bg-white/5 border border-solid opacity-80">
            <TabsTrigger
              value="circle"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              ●
            </TabsTrigger>
            <TabsTrigger
              value="triangle"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              ▲
            </TabsTrigger>
            <TabsTrigger
              value="square"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              ■
            </TabsTrigger>
            <TabsTrigger
              value="diamond"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              ◆
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as "analyze" | "think" | "connect" | "intense" | "deep" | "transfer")}
        >
          <TabsList className="backdrop-blur-xl border-white/10 !bg-white/5 border border-solid opacity-80">
            <TabsTrigger
              value="analyze"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Analyze
            </TabsTrigger>
            <TabsTrigger
              value="think"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Think
            </TabsTrigger>
            <TabsTrigger
              value="connect"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Connect
            </TabsTrigger>
            <TabsTrigger
              value="intense"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Intense
            </TabsTrigger>
            <TabsTrigger
              value="deep"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Deep
            </TabsTrigger>
            <TabsTrigger
              value="transfer"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Transfer
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
