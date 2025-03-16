import finger from "../fingers/finger.png";
interface FingerStageData {
    id: number
    videoUrl: string
    firstNumber: number
    secondNumber: number
    firstNumberImage: string
    secondNumberImage: string
    question: string
    correctAnswer: number
  }
  
  export const fingersStageData: FingerStageData[] = [
    {
      id: 0,
      videoUrl: "https://youtu.be/xNw1SSz18Gg?si=GWHcFwZOTGVjBWQe",
      firstNumberImage: finger,
      firstNumber: 3,
      secondNumber: 2,
      secondNumberImage:finger,
      question: "كم يساوي 3 + 2؟",
      correctAnswer: 5,
    },
    {
      id: 1,
      videoUrl: "https://youtu.be/BC5dI-8wysY?si=QomJ-I41dwuCprlE",
      firstNumberImage:finger,
      secondNumberImage: finger,
      firstNumber: 4,
      secondNumber: 1,
      question: "كم يساوي 4 + 1؟",
      correctAnswer: 5,
    },
    {
      id: 2,
      videoUrl: "https://youtu.be/eBVqcTEC3zQ?si=7MvwclbLuP3P6aq6",
      firstNumberImage: finger,
      secondNumberImage: finger,
      firstNumber: 5,
      secondNumber: 2,
      question: "كم يساوي 5 + 2؟",
      correctAnswer: 7,
    },
  ]