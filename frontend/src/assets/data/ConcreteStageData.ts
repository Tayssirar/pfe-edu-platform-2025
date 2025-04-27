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
}

export const concreteStageData: StageDataMap = {
  range1: [
    {
      id: 0,
      url: "https://www.youtube.com/watch?v=R6Li1bzoLuM",
      question: "كم عدد البيض؟",
      options: [1, 3, 2],
      correctAnswer: 3,
    },
    {
      id: 1,
      url: "https://www.youtube.com/watch?v=vnNctR634SQ",
      question: "كم عدد البيض؟",
      options: [3, 5, 6],
      correctAnswer: 6,
    },
    {
      id: 2,
      url: "https://www.youtube.com/watch?v=DYJ0Rbfmvog",
      question: "كم عدد البيض؟",
      options: [2, 6, 4],
      correctAnswer: 6,
    },
    {
      id: 3,
      url: "https://www.youtube.com/watch?v=iqiUg1TN70E",
      question: "كم عدد البيض؟",
      options: [8, 5, 3],
      correctAnswer: 8,
    },
    {
      id: 4,
      url: "https://www.youtube.com/watch?v=txj2xy3AOR8",
      question: "كم عدد البيض؟",
      options: [7, 5, 6],
      correctAnswer: 7,
    },
    {
      id: 5,
      url: "https://www.youtube.com/watch?v=4mzpZJC-uqg",
      question: "كم عدد البيض؟",
      options: [3, 5, 2],
      correctAnswer: 5,
    },
    {
      id: 6,
      url: "https://www.youtube.com/watch?v=n5vH70GTU6w",
      question: "كم عدد البيض؟",
      options: [9, 4, 5],
      correctAnswer: 9,
    },
    {
      id: 7,
      url: "https://www.youtube.com/watch?v=gJVkVU2Oh6E",
      question: "كم عدد البيض؟",
      options: [7, 9, 5],
      correctAnswer: 7,
    },
    {
      id: 8,
      url: "https://www.youtube.com/watch?v=HgSU0ENNaqM",
      question: "كم عدد البيض؟",
      options: [9, 3, 6],
      correctAnswer: 6,
    },
    {
      id: 9,
      url: "https://www.youtube.com/watch?v=3cenNvKuQyQ",
      question: "كم عدد البيض؟",
      options: [7, 4, 2],
      correctAnswer: 7,
    },

  ],
  range2: [
    {
      id: 0,
      url: "https://www.youtube.com/watch?v=O_bJ_ntInAg&pp=0gcJCYQJAYcqIYzv",
      question: "كم يبلغ مجموع البرتقال؟",
      options: [6, 8, 2],
      correctAnswer: 8,
    },
    {
      id: 1,
      url: "https://www.youtube.com/watch?v=onVf7OFdmKA",
      question: "كم يبلغ مجموع البرتقال؟",
      options: [17, 15, 16],
      correctAnswer: 17,
    },
    {
      id: 2,
      url: "https://www.youtube.com/watch?v=G7scT_5Oe34",
      question: "كم يبلغ مجموع البرتقال؟",
      options: [12, 16, 14],
      correctAnswer: 14,
    },
    {
      id: 3,
      url: "https://www.youtube.com/watch?v=j_-4n8fmxpc",
      question: "كم يبلغ مجموع البرتقال؟",
      options: [11, 8, 4],
      correctAnswer: 11,
    },
    {
      id: 4,
      url: "https://www.youtube.com/watch?v=xzm0X-C8qIQ",
      question: "كم يبلغ مجموع البرتقال؟",
      options: [17, 13, 16],
      correctAnswer: 13,
    },
    {
      id: 5,
      url: "https://www.youtube.com/watch?v=c5uioXnzIX8",
      question: "كم تفاحة جمعها أحمد وسلمى معا؟",
      options: [12, 10, 14],
      correctAnswer: 10,
    },
    {
      id: 6,
      url: "https://www.youtube.com/watch?v=Afs4djCiyGs",
      question: "كم تفاحة جمعها أحمد وسلمى معا؟",
      options: [7, 10, 13],
      correctAnswer: 13,
    },
    {
      id: 7,
      url: "https://www.youtube.com/watch?v=rV1aPGMHFtA",
      question: "كم تفاحة جمعها أحمد وسلمى معا؟",
      options: [16, 10, 6],
      correctAnswer: 16,
    },
    {
      id: 8,
      url: "https://www.youtube.com/watch?v=5xp5-6ehqwA",
      question: "كم تفاحة جمعها أحمد وسلمى معا؟",
      options: [15, 14, 13],
      correctAnswer: 14,
    },
    {
      id: 9,
      url: "https://www.youtube.com/watch?v=0b9afzcmrGI",
      question: "كم تفاحة جمعها أحمد وسلمى معا؟",
      options: [9, 10, 6],
      correctAnswer: 9,
    },
  ],
}

