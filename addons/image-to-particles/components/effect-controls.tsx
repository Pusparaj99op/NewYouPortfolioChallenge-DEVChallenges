"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface EffectControlsProps {
  halftoneSize: number
  contrast: number
  accentColor: string
  mouseRadius: number
  repulsionStrength: number
  returnSpeed: number
  accentProbability: number
  sizeVariation: number
  onHalftoneSizeChange: (value: number) => void
  onContrastChange: (value: number) => void
  onAccentColorChange: (value: string) => void
  onMouseRadiusChange: (value: number) => void
  onRepulsionStrengthChange: (value: number) => void
  onReturnSpeedChange: (value: number) => void
  onAccentProbabilityChange: (value: number) => void
  onSizeVariationChange: (value: number) => void
}

export function EffectControls({
  halftoneSize,
  contrast,
  accentColor,
  mouseRadius,
  repulsionStrength,
  returnSpeed,
  accentProbability,
  sizeVariation,
  onHalftoneSizeChange,
  onContrastChange,
  onAccentColorChange,
  onMouseRadiusChange,
  onRepulsionStrengthChange,
  onReturnSpeedChange,
  onAccentProbabilityChange,
  onSizeVariationChange,
}: EffectControlsProps) {
  return (
    <Card className="p-6 space-y-6 h-fit sticky top-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">Effect Controls</h2>
        <p className="text-sm text-muted-foreground">Adjust parameters and hover over the image to interact</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="halftone-size">Halftone Dot Size</Label>
            <span className="text-sm text-muted-foreground">{halftoneSize}px</span>
          </div>
          <Slider
            id="halftone-size"
            min={2}
            max={12}
            step={1}
            value={[halftoneSize]}
            onValueChange={([value]) => onHalftoneSizeChange(value)}
          />
          <p className="text-xs text-muted-foreground">Controls the size of the halftone dots</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="contrast">Contrast</Label>
            <span className="text-sm text-muted-foreground">{contrast.toFixed(1)}x</span>
          </div>
          <Slider
            id="contrast"
            min={0.5}
            max={2}
            step={0.1}
            value={[contrast]}
            onValueChange={([value]) => onContrastChange(value)}
          />
          <p className="text-xs text-muted-foreground">Adjusts the contrast before applying effects</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="size-variation">Size Variation</Label>
            <span className="text-sm text-muted-foreground">{(sizeVariation * 100).toFixed(0)}%</span>
          </div>
          <Slider
            id="size-variation"
            min={0}
            max={0.5}
            step={0.05}
            value={[sizeVariation]}
            onValueChange={([value]) => onSizeVariationChange(value)}
          />
          <p className="text-xs text-muted-foreground">Makes dots more heterogeneous and organic</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="mouse-radius">Mouse Impact Radius</Label>
            <span className="text-sm text-muted-foreground">{mouseRadius}px</span>
          </div>
          <Slider
            id="mouse-radius"
            min={50}
            max={300}
            step={10}
            value={[mouseRadius]}
            onValueChange={([value]) => onMouseRadiusChange(value)}
          />
          <p className="text-xs text-muted-foreground">Area of influence around the cursor</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="repulsion-strength">Repulsion Strength</Label>
            <span className="text-sm text-muted-foreground">{repulsionStrength.toFixed(1)}x</span>
          </div>
          <Slider
            id="repulsion-strength"
            min={0.1}
            max={2}
            step={0.1}
            value={[repulsionStrength]}
            onValueChange={([value]) => onRepulsionStrengthChange(value)}
          />
          <p className="text-xs text-muted-foreground">How strongly dots are pushed by cursor movement</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="return-speed">Return Speed</Label>
            <span className="text-sm text-muted-foreground">{(returnSpeed * 100).toFixed(0)}%</span>
          </div>
          <Slider
            id="return-speed"
            min={0.05}
            max={0.3}
            step={0.01}
            value={[returnSpeed]}
            onValueChange={([value]) => onReturnSpeedChange(value)}
          />
          <p className="text-xs text-muted-foreground">How quickly dots return to original position</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accent-color">Accent Color</Label>
          <div className="flex gap-2 items-center">
            <input
              id="accent-color"
              type="color"
              value={accentColor}
              onChange={(e) => onAccentColorChange(e.target.value)}
              className="w-12 h-12 rounded border border-border cursor-pointer"
            />
            <span className="text-sm text-muted-foreground font-mono">{accentColor}</span>
          </div>
          <p className="text-xs text-muted-foreground">Random accent dots will use this color</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="accent-probability">Accent Probability</Label>
            <span className="text-sm text-muted-foreground">{(accentProbability * 100).toFixed(0)}%</span>
          </div>
          <Slider
            id="accent-probability"
            min={0}
            max={0.1}
            step={0.005}
            value={[accentProbability]}
            onValueChange={([value]) => onAccentProbabilityChange(value)}
          />
          <p className="text-xs text-muted-foreground">Chance of dots being colored with accent</p>
        </div>
      </div>
    </Card>
  )
}
