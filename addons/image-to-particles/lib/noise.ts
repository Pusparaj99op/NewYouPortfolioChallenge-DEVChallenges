// Simple noise function for organic boundaries
export function smoothNoise(x: number, y: number, scale = 0.1, seed = 0): number {
  const scaledX = x * scale + seed
  const scaledY = y * scale + seed

  const sin1 = Math.sin(scaledX * 12.9898 + scaledY * 78.233) * 43758.5453
  const sin2 = Math.sin(scaledX * 93.9898 + scaledY * 47.233) * 28571.1234

  const noise1 = sin1 - Math.floor(sin1)
  const noise2 = sin2 - Math.floor(sin2)

  return (noise1 + noise2) / 2
}
