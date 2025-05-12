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
      url: "https://youtu.be/QieU1YCXDuo?si=oECySThSDCKTiyrL",
      question: "كم عدد البيض؟",
      options: [1, 3, 2],
      correctAnswer: 3,
    },
    {
      id: 1,
      url: "https://youtu.be/jEWS0YHbIV8?si=yMZc9NH2J2KySFNM",
      question: "كم عدد البيض؟",
      options: [3, 5, 6],
      correctAnswer: 6,
    },
    {
      id: 2,
      url: "https://youtu.be/9G2nHTRXE8o?si=vXz8P63AY-GIfXib",
      question: "كم عدد البيض؟",
      options: [2, 6, 4],
      correctAnswer: 6,
    },
    {
      id: 3,
      url: "https://youtu.be/MROsFjYGj_I?si=-NjRGC-CXjUm-G_6",
      question: "كم عدد البيض؟",
      options: [8, 5, 3],
      correctAnswer: 8,
    },
    {
      id: 4,
      url: "https://youtu.be/5t9nYy_-oW8?si=PCYpY5YQc7efrfqV",
      question: "كم عدد البيض؟",
      options: [7, 5, 6],
      correctAnswer: 7,
    },
    {
      id: 5,
      url: "https://youtu.be/p37fiNaJV9U?si=OeHw3ReAbvR9Zzn7",
      question: "كم عدد البيض؟",
      options: [3, 5, 2],
      correctAnswer: 5,
    },
    {
      id: 6,
      url: "https://youtu.be/V3FE8meg7Ho?si=y4TV1tsqfEGbJM-3",
      question: "كم عدد البيض؟",
      options: [9, 4, 5],
      correctAnswer: 9,
    },
    {
      id: 7,
      url: "https://youtu.be/V00DUNwDPVE?si=woBNRbFuO-oFWYDU",
      question: "كم عدد البيض؟",
      options: [7, 9, 5],
      correctAnswer: 7,
    },
    {
      id: 8,
      url: "https://youtu.be/WjjvqIyHwp8?si=hs-ljp9eXdagA8_A",
      question: "كم عدد البيض؟",
      options: [8, 3, 6],
      correctAnswer: 8,
    },
    {
      id: 9,
      url: "https://youtu.be/Vq8u8q5FXQ0?si=el-ClsAWO2lHidKl",
      question: "كم عدد البيض؟",
      options: [7, 4, 3],
      correctAnswer: 7,
    },

  ],
  range2: [
    {
      id: 0,
      url: "https://youtu.be/HOtuj5wp2D8?si=dGTQySXNfG8qveSy",
      question: "كم يبلغ مجموع البرتقال؟",
      options: [6, 8, 2],
      correctAnswer: 8,
    },
    {
      id: 1,
      url: "https://youtu.be/AvPyKjJC0Y0?si=tjOKaONklRBKXPPN",
      question: "كم يبلغ مجموع البرتقال؟",
      options: [17, 15, 16],
      correctAnswer: 17,
    },
    {
      id: 2,
      url: "https://youtu.be/T6oaAuf6Wh0?si=8JCFyD1glXcDuRbA",
      question: "كم يبلغ مجموع البرتقال؟",
      options: [12, 16, 14],
      correctAnswer: 14,
    },
    {
      id: 3,
      url: "https://youtu.be/92OWBuUL5DE?si=i6BzQtmwIdnnpjr5",
      question: "كم يبلغ مجموع البرتقال؟",
      options: [11, 8, 4],
      correctAnswer: 11,
    },
    {
      id: 4,
      url: "https://youtu.be/y_Dg9MJ8Ec8?si=fh8fGNUvwlOyydJl",
      question: "كم يبلغ مجموع البرتقال؟",
      options: [17, 13, 16],
      correctAnswer: 13,
    },
    {
      id: 5,
      url: "https://youtu.be/bAUhT2hqOs0?si=ME_NTTurkbew5P56",
      question: "كم تفاحة جمعها أحمد وسلمى معا؟",
      options: [12, 10, 14],
      correctAnswer: 10,
    },
    {
      id: 6,
      url: "https://youtu.be/V2xgArdU-vY?si=2VKkk0v6pyNPKNiT",
      question: "كم تفاحة جمعها أحمد وسلمى معا؟",
      options: [7, 10, 13],
      correctAnswer: 13,
    },
    {
      id: 7,
      url: "https://youtu.be/cQk2vhM6OnA?si=rfel1QNrORDDP4yh",
      question: "كم تفاحة جمعها أحمد وسلمى معا؟",
      options: [16, 10, 6],
      correctAnswer: 16,
    },
    {
      id: 8,
      url: "https://youtu.be/DWZqE2Hk4vs?si=HDAMvBgZocQO3fVs",
      question: "كم تفاحة جمعها أحمد وسلمى معا؟",
      options: [15, 14, 13],
      correctAnswer: 14,
    },
    {
      id: 9,
      url: "https://youtu.be/_jLPbp7yP7E?si=DOQQ22TO-76EKWZ3",
      question: "كم تفاحة جمعها أحمد وسلمى معا؟",
      options: [9, 10, 6],
      correctAnswer: 9,
    },
  ],
}

