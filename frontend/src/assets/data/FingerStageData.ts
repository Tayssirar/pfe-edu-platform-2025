import finger from "../fingers/finger.png"

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
export interface StageDataMap {
  range1: FingerStageData[]
  range2: FingerStageData[]
  range3: FingerStageData[]
}
export const fingersStageData: StageDataMap = {
  range1: [
    {
      id: 0,
      videoUrl: "https://youtu.be/xNw1SSz18Gg?si=GWHcFwZOTGVjBWQe",
      firstNumberImage: finger,
      firstNumber: 3,
      secondNumber: 2,
      secondNumberImage: finger,
      question: "كم يساوي 3 + 2؟",
      correctAnswer: 5,
    },
    {
      id: 1,
      videoUrl: "https://youtu.be/BC5dI-8wysY?si=QomJ-I41dwuCprlE",
      firstNumberImage: finger,
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
    }
  ],
  range2: [
  // Range 1-10
    {
      id: 3,
      videoUrl: "https://youtu.be/xNw1SSz18Gg?si=GWHcFwZOTGVjBWQe",
      firstNumberImage: finger,
      firstNumber: 6,
      secondNumber: 4,
      secondNumberImage: finger,
      question: "كم يساوي 6 + 4؟",
      correctAnswer: 10,
    },
    {
      id: 4,
      videoUrl: "https://youtu.be/BC5dI-8wysY?si=QomJ-I41dwuCprlE",
      firstNumberImage: finger,
      secondNumberImage: finger,
      firstNumber: 7,
      secondNumber: 3,
      question: "كم يساوي 7 + 3؟",
      correctAnswer: 10,
    },
    {
      id: 5,
      videoUrl: "https://youtu.be/eBVqcTEC3zQ?si=7MvwclbLuP3P6aq6",
      firstNumberImage: finger,
      secondNumberImage: finger,
      firstNumber: 8,
      secondNumber: 2,
      question: "كم يساوي 8 + 2؟",
      correctAnswer: 10,
    }
  ],
  range3: [
    // Range 1-15
    {
      id: 6,
      videoUrl: "https://youtu.be/xNw1SSz18Gg?si=GWHcFwZOTGVjBWQe",
      firstNumberImage: finger,
      firstNumber: 9,
      secondNumber: 6,
      secondNumberImage: finger,
      question: "كم يساوي 9 + 6؟",
      correctAnswer: 15,
    },
    {
      id: 7,
      videoUrl: "https://youtu.be/BC5dI-8wysY?si=QomJ-I41dwuCprlE",
      firstNumberImage: finger,
      secondNumberImage: finger,
      firstNumber: 8,
      secondNumber: 7,
      question: "كم يساوي 8 + 7؟",
      correctAnswer: 15,
    },
    {
      id: 8,
      videoUrl: "https://youtu.be/eBVqcTEC3zQ?si=7MvwclbLuP3P6aq6",
      firstNumberImage: finger,
      secondNumberImage: finger,
      firstNumber: 10,
      secondNumber: 5,
      question: "كم يساوي 10 + 5؟",
      correctAnswer: 15,
    }
  ]
}

