"use client"

import { useEffect, useState } from "react"
import DigitReel from "./digit-reel"

interface CountdownTimerProps {
  initialMinutes: number
  initialSeconds: number
}

export default function CountdownTimer({ initialMinutes = 0, initialSeconds = 0 }: CountdownTimerProps) {
  const [minutes, setMinutes] = useState(initialMinutes)
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          clearInterval(interval as NodeJS.Timeout)
          setIsActive(false)
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, minutes, seconds])

  // Format numbers to always have two digits
  const formattedMinutes = minutes.toString().padStart(2, "0")
  const formattedSeconds = seconds.toString().padStart(2, "0")

  return (
    <div className="flex items-center justify-center font-twk-everett">
      <div className="flex items-center">
        <div className="-mr-2">
          <DigitReel value={formattedMinutes[0]} />
        </div>
        <div className="-mx-2">
          <DigitReel value={formattedMinutes[1]} />
        </div>
        <div className="text-white text-7xl mx-1 font-twk-everett font-normal">:</div>
        <div className="-mx-2">
          <DigitReel value={formattedSeconds[0]} />
        </div>
        <div className="-ml-2">
          <DigitReel value={formattedSeconds[1]} />
        </div>
      </div>
    </div>
  )
}

