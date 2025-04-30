import finger from "../fingers/finger.png"

interface FingerStageData {
  id: number
  videoUrl: string
}

export interface StageDataMap {
  range1: FingerStageData[]
  range2: FingerStageData[]
}
export const fingersStageData: StageDataMap = {
  range1: [

    {
      //1+2
      id: 0,
      videoUrl: "https://youtu.be/_D2hcs73Oy4?si=Dtg0TNHEeGYXZP1r",
    },
    {
      //2+3
      id: 1,
      videoUrl: "https://youtu.be/nyuhNMf5_w4?si=euF0ZdcURWYiBRPF",
      
    },
    {
      //3+3
      id: 2,
      videoUrl: "https://youtu.be/N9nsHDEPsdE?si=fYfnvpoFRKn0yx3B",
    },
    {
      //4+2
      id: 3,
      videoUrl: "https://youtu.be/fRkwRlzEV6w?si=eab1lKyC5fF6tN-D",
    },
    {
      //4+3
      id: 4,
      videoUrl: "https://youtu.be/HMb0w-MMptg?si=-TPStTagRwrb8n5T",
    },
    {
      //4+4
      id: 5,
      videoUrl: "https://youtu.be/29fnhmMQ9ZA?si=6KFsS4pq_2RzJRVd",
    },
    {
      //5+2
      id: 6,
      videoUrl: "https://youtu.be/lPoUJsqMreE?si=JufGNbF_dXyI-Irx",
    },
    {
      //5+3
      id: 7,
      videoUrl: "https://youtu.be/k90kBgIMZA4?si=3--TZLRrKNhkRZ6N",
    },
    {
      //5+4
      id: 8,
      videoUrl: "https://youtu.be/tlbmTqx2y3o?si=wABeKVYQZzne0sre",
    },
    {
      //5+5
      id: 9,
      videoUrl: "https://youtu.be/y6d2evK5BQA?si=xyEp5MrT6pZjA-2a",
    },

  ],
  range2: [
    {
      //6+2
      id: 1,
      videoUrl: "https://youtu.be/tR2HlfWEOjg?si=9sq4jywZxuFpW9NI",
    },
    {
      //6+7
      id: 2,
      videoUrl: "https://youtu.be/2mko08Ct0Rg?si=gpHvAc6We-fhYOL0",
    },
    {
      //4+9
      id: 3,
      videoUrl: "https://youtu.be/hECixEljIpI?si=Q9Tubhlf-U2X1pmG",
    },
    {
      //5+9
      id: 4,
      videoUrl: "https://youtu.be/JmHFYWnP_gc?si=xvdK4HuKW5ZJjFSj",
    },
    {
      //2+10
      id: 5,
      videoUrl: "https://youtu.be/c4bJEQt9XgI?si=GKR_At8caMxEF0wD",
    },
    {
      //7+9
      id: 6,
      videoUrl: "https://youtu.be/bDVDCaQNU3M?si=3-dZQLcmYzDfSpM4",
    },
    {
      //8+9
      id: 7,
      videoUrl: "https://youtu.be/tvoUY66DPFc?si=XTEAejxvBTGs4vTs",
    },
    {
      //3+8
      id: 8,
      videoUrl: "https://youtu.be/EsjiKL5qiJM?si=w3o-ouxpqSUeM6fa",
    },
    {
      //3+7
      id: 9,
      videoUrl: "https://youtu.be/Wg9EY_BUR40?si=2q5DEOHVuuckFuoo",
    },
    {
      //6+8
      id: 10,
      videoUrl: "https://youtu.be/cB3ulwm02tg?si=PMzjyoSj9N82MQ_a",
    }
  ],
}


