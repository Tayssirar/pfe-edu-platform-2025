export interface ConcreteStageData {
    id: number;
    url: string;
    question: string;
    options: number[];
    correctAnswer: number;
  }
  
  export const concreteStageData: ConcreteStageData[] = [
    {
      id: 0,
      url: "https://youtu.be/tVHOBVAFjUw?si=NGq_fD-XuIQwCKLJ",
      question: "كم هو مجموع 2 + 3؟",
      options: [4, 5, 6],
      correctAnswer: 6,
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
  ];
  