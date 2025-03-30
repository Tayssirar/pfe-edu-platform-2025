export interface ConcreteStageData {
  id: number
  url: string
  question: string
  options: number[]
  correctAnswer: number
}

export interface StageDataMap {
  range1: ConcreteStageData[]
  range2: ConcreteStageData[]
  range3: ConcreteStageData[]
}

export const concreteStageData: StageDataMap = {
  range1: [
    {
      id: 0,
      url: "https://youtu.be/tVHOBVAFjUw?si=NGq_fD-XuIQwCKLJ",
      question: "كم هو مجموع 2 + 3؟",
      options: [4, 5, 6],
      correctAnswer: 5,
    },
    {
      id: 1,
      url: "https://youtu.be/iLXNBiGJAGs?si=NrIMRtgS85x4_Zsx",
      question: "كم هو مجموع 4 + 2؟",
      options: [3, 2, 6],
      correctAnswer: 6,
    },
    {
      id: 2,
      url: "https://youtu.be/0TgLtF3PMOc?si=4FOW5rev2cxlqrd2",
      question: "كم هو مجموع 3 + 3؟",
      options: [1, 6, 4],
      correctAnswer: 6,
    },
  ],
  range2: [
    {
      id: 0,
      url: "https://youtu.be/tVHOBVAFjUw?si=NGq_fD-XuIQwCKLJ",
      question: "كم هو مجموع 5 + 5؟",
      options: [8, 10, 12],
      correctAnswer: 10,
    },
    {
      id: 1,
      url: "https://youtu.be/iLXNBiGJAGs?si=NrIMRtgS85x4_Zsx",
      question: "كم هو مجموع 6 + 4؟",
      options: [7, 9, 10],
      correctAnswer: 10,
    },
    {
      id: 2,
      url: "https://youtu.be/0TgLtF3PMOc?si=4FOW5rev2cxlqrd2",
      question: "كم هو مجموع 7 + 3؟",
      options: [8, 10, 12],
      correctAnswer: 10,
    },
  ],
  range3: [
    {
      id: 0,
      url: "https://youtu.be/tVHOBVAFjUw?si=NGq_fD-XuIQwCKLJ",
      question: "كم هو مجموع 8 + 7؟",
      options: [13, 15, 17],
      correctAnswer: 15,
    },
    {
      id: 1,
      url: "https://youtu.be/iLXNBiGJAGs?si=NrIMRtgS85x4_Zsx",
      question: "كم هو مجموع 9 + 6؟",
      options: [12, 15, 18],
      correctAnswer: 15,
    },
    {
      id: 2,
      url: "https://youtu.be/0TgLtF3PMOc?si=4FOW5rev2cxlqrd2",
      question: "كم هو مجموع 10 + 5؟",
      options: [12, 15, 18],
      correctAnswer: 15,
    },
  ],
}

