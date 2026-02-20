"use client"

import { useState } from "react"
import CountdownTimer from "@/components/countdown-timer"

export default function Home() {
  const [initialTime, setInitialTime] = useState({ minutes: 15, seconds: 42 })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="flex items-center justify-center gap-4">
        <div className="text-gray-400 text-2xl font-twk-everett">Voting ends in:</div>
        <CountdownTimer initialMinutes={initialTime.minutes} initialSeconds={initialTime.seconds} />
      </div>
    </main>
  )
}

