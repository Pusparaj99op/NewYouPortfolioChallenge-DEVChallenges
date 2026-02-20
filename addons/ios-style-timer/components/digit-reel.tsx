"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface DigitReelProps {
  value: string
  className?: string
}

export default function DigitReel({ value, className }: DigitReelProps) {
  const [prevValue, setPrevValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (value !== prevValue) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setPrevValue(value)
        setIsAnimating(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [value, prevValue])

  // Generate the digits that will appear in the reel
  // For a digit like "5", we'll show "3", "4", "5", "6", "7" in the reel
  const generateReelDigits = (currentDigit: string) => {
    const digit = Number.parseInt(currentDigit, 10)
    const digits = []

    // Add digits before current
    for (let i = 2; i > 0; i--) {
      const prevDigit = (digit - i + 10) % 10
      digits.push(prevDigit.toString())
    }

    // Add current digit
    digits.push(currentDigit)

    // Add digits after current
    for (let i = 1; i <= 2; i++) {
      const nextDigit = (digit + i) % 10
      digits.push(nextDigit.toString())
    }

    return digits
  }

  const reelDigits = generateReelDigits(value)

  return (
    <div className={cn("relative w-20 h-28 overflow-hidden font-twk-everett", className)}>
      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-12 z-10 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>

      <div className="relative h-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute"
          >
            <div className="flex flex-col items-center">
              {reelDigits.map((digit, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-7xl font-normal transition-all duration-300 font-twk-everett",
                    index === 2 ? "text-white" : "text-gray-600",
                    index < 2 ? "-mb-4" : "",
                    index > 2 ? "-mt-4" : "",
                  )}
                >
                  {digit}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-12 z-10 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </div>
  )
}

