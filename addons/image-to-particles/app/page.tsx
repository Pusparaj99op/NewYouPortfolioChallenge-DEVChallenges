"use client"

import { useState, useRef, useEffect } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { EffectControls } from "@/components/effect-controls"
import { ImageCanvas } from "@/components/image-canvas"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null)
  const [halftoneSize, setHalftoneSize] = useState(4)
  const [contrast, setContrast] = useState(1.5)
  const [accentColor, setAccentColor] = useState("#00d9ff")
  const [mouseRadius, setMouseRadius] = useState(100)
  const [repulsionStrength, setRepulsionStrength] = useState(1.0)
  const [returnSpeed, setReturnSpeed] = useState(0.3)
  const [accentProbability, setAccentProbability] = useState(0.03)
  const [sizeVariation, setSizeVariation] = useState(0.3)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setUploadedImage(img)
    }
    img.src = "https://avatars.githubusercontent.com/u/51397083?v=4"
  }, [])

  const handleImageUpload = (image: HTMLImageElement) => {
    setUploadedImage(image)
  }

  const handleDownload = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = "shader-effect.png"
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  const handleUploadNewImage = () => {
    fileInputRef.current?.click()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Retro Shader Studio</h1>
          <p className="text-muted-foreground">Apply interactive halftone effects to your images</p>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="space-y-4">
            {!uploadedImage ? (
              <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
              <>
                <ImageCanvas
                  ref={canvasRef}
                  image={uploadedImage}
                  halftoneSize={halftoneSize}
                  contrast={contrast}
                  accentColor={accentColor}
                  mouseRadius={mouseRadius}
                  repulsionStrength={repulsionStrength}
                  returnSpeed={returnSpeed}
                  accentProbability={accentProbability}
                  sizeVariation={sizeVariation}
                />
                <div className="flex gap-2">
                  <Button onClick={handleDownload} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Image
                  </Button>
                  <Button variant="outline" onClick={handleUploadNewImage}>
                    Upload New Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const img = new Image()
                        img.crossOrigin = "anonymous"
                        img.onload = () => handleImageUpload(img)
                        img.src = event.target?.result as string
                      }
                      reader.readAsDataURL(file)
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {uploadedImage && (
            <EffectControls
              halftoneSize={halftoneSize}
              contrast={contrast}
              accentColor={accentColor}
              mouseRadius={mouseRadius}
              repulsionStrength={repulsionStrength}
              returnSpeed={returnSpeed}
              accentProbability={accentProbability}
              sizeVariation={sizeVariation}
              onHalftoneSizeChange={setHalftoneSize}
              onContrastChange={setContrast}
              onAccentColorChange={setAccentColor}
              onMouseRadiusChange={setMouseRadius}
              onRepulsionStrengthChange={setRepulsionStrength}
              onReturnSpeedChange={setReturnSpeed}
              onAccentProbabilityChange={setAccentProbability}
              onSizeVariationChange={setSizeVariation}
            />
          )}
        </div>
      </div>
    </main>
  )
}
