import { useState, useEffect, useRef } from "react"
import { ProgressBar } from "react-bootstrap"
import clockTick from "../../assets/sounds/clock-tick.mp3"

interface ActivityTimerProps {
  duration: number // in seconds
  onTimeExpired: () => void
  isActive: boolean // New prop to control the timer's activity
}

export default function ActivityTimer({ duration, onTimeExpired, isActive }: ActivityTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(duration)
  const [tickSound, setTickSound] = useState<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const hasExpiredRef = useRef<boolean>(false)

  useEffect(() => {
    const audio = new Audio(clockTick)
    audio.volume = 0.3
    setTickSound(audio)

    return () => {
      audio.pause()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Reset timer when duration changes or when isActive becomes true
  useEffect(() => {
    setTimeLeft(duration)
    hasExpiredRef.current = false
  }, [duration, isActive])

  useEffect(() => {
    if (!isActive || !tickSound) {
      // Clear any existing timer when inactive
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    const playSound = () => {
      if (tickSound && timeLeft <= 10) {
        // Only play sound in last 10 seconds
        tickSound.currentTime = 0
        tickSound.play().catch((err) => console.error("Error playing sound:", err))
      }
    }

    // Clear any existing timer before setting a new one
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }

          // Only call onTimeExpired once
          if (!hasExpiredRef.current) {
            hasExpiredRef.current = true
            onTimeExpired()
          }
          return 0
        }

        playSound()
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isActive, onTimeExpired, tickSound, timeLeft])

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

