"use client"

import type React from "react"

import { useCallback } from "react"
import { Upload } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ImageUploaderProps {
  onImageUpload: (image: HTMLImageElement) => void
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          onImageUpload(img)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    },
    [onImageUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          onImageUpload(img)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    },
    [onImageUpload],
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <Card
      className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <label className="flex flex-col items-center justify-center min-h-[500px] cursor-pointer p-8">
        <Upload className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Upload an image</h3>
        <p className="text-muted-foreground text-center mb-4">Drag and drop or click to select</p>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
    </Card>
  )
}
