import { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import clockTick from "../../assets/sounds/clock-tick.mp3";

interface ActivityTimerProps {
  duration: number; // in seconds
  onTimeExpired: () => void;
  isActive: boolean;  // New prop to control the timer's activity
}

export default function ActivityTimer({ duration, onTimeExpired, isActive }: ActivityTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [tickSound, setTickSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(clockTick);
    audio.volume = 0.3;
    setTickSound(audio);

    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (!isActive || !tickSound) return;

    const playSound = () => {
      tickSound.play();
    };

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }

        playSound();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeExpired, tickSound]);

  const percentage = (timeLeft / duration) * 100;

  let variant: "success" | "warning" | "danger" = "success";
  if (percentage < 30) variant = "danger";
  else if (percentage < 60) variant = "warning";

  return (
    <div className="timer-container" style={{ width: "200px" }}>
      <div className="d-flex align-items-center mb-2">
        <i className="bi bi-clock me-2"></i>
        <span>{timeLeft} ثانية</span>
      </div>
      <ProgressBar now={percentage} variant={variant} animated />
    </div>
  );
}

