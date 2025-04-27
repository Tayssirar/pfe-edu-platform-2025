"use client"

import { useState, useEffect, useRef } from "react"
import { ProgressBar } from "react-bootstrap"
import clockTick from "../../assets/sounds/clock-tick.mp3"

interface ActivityTimerProps {
  duration: number // in seconds
  onTimeExpired: () => void
  isActive: boolean
}

export default function ActivityTimer({ duration, onTimeExpired, isActive }: ActivityTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(duration)
  const [tickSound, setTickSound] = useState<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const hasExpiredRef = useRef<boolean>(false)
  const hasStartedSoundRef = useRef<boolean>(false) // 🔥 New ref to control when sound plays

  useEffect(() => {
    const audio = new Audio(clockTick)
    audio.volume = 0.7
    setTickSound(audio)
    audio.load()

    return () => {
      audio.pause()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setTimeLeft(duration)
    hasExpiredRef.current = false
    hasStartedSoundRef.current = false // 🔥 Reset when timer is reset
  }, [duration, isActive])

  useEffect(() => {
    if (!isActive || !tickSound) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      if (tickSound) {
        tickSound.pause()
        tickSound.currentTime = 0
      }
      return
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          tickSound?.pause()
          tickSound!.currentTime = 0
          if (!hasExpiredRef.current) {
            hasExpiredRef.current = true
            onTimeExpired()
          }
          return 0
        }

        // 🔥 Start sound when reaching 26 seconds
        if (prev === 26 && tickSound && !hasStartedSoundRef.current) {
          tickSound.currentTime = 0
          tickSound.play().catch((err) => console.error("Error playing sound:", err))
          hasStartedSoundRef.current = true
        }

        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timerRef.current!)
      if (tickSound) {
        tickSound.pause()
        tickSound.currentTime = 0
      }
    }
  }, [isActive, onTimeExpired, tickSound])

  const percentage = (timeLeft / duration) * 100
  let variant: "success" | "warning" | "danger" = "success"
  if (percentage < 30) variant = "danger"
  else if (percentage < 60) variant = "warning"

  return (
    <div className="timer-container" style={{ width: "200px" }}>
      <div className="d-flex align-items-center mb-2">
        <i className="bi bi-clock me-2"></i>
        <span>{timeLeft} ثانية</span>
      </div>
      <ProgressBar now={percentage} variant={variant} animated={isActive} />
    </div>
  )
}
