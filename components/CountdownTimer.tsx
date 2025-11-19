'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  hours?: number
  minutes?: number
  seconds?: number
}

export default function CountdownTimer({
  hours = 24,
  minutes = 0,
  seconds = 0,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours,
    minutes,
    seconds,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (value: number) => String(value).padStart(2, '0')

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-6 shadow-lg">
      <div className="text-center mb-2">
        <p className="text-sm font-medium opacity-90">Limited Time Offer</p>
      </div>
      <div className="flex justify-center space-x-4">
        <motion.div
          key={timeLeft.hours}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[70px]"
        >
          <div className="text-3xl font-bold">{formatTime(timeLeft.hours)}</div>
          <div className="text-xs opacity-80">Hours</div>
        </motion.div>
        <div className="text-3xl font-bold self-center">:</div>
        <motion.div
          key={timeLeft.minutes}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[70px]"
        >
          <div className="text-3xl font-bold">
            {formatTime(timeLeft.minutes)}
          </div>
          <div className="text-xs opacity-80">Minutes</div>
        </motion.div>
        <div className="text-3xl font-bold self-center">:</div>
        <motion.div
          key={timeLeft.seconds}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[70px]"
        >
          <div className="text-3xl font-bold">
            {formatTime(timeLeft.seconds)}
          </div>
          <div className="text-xs opacity-80">Seconds</div>
        </motion.div>
      </div>
    </div>
  )
}

