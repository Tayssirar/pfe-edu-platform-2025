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
      videoUrl: "https://youtu.be/kyjcv3SjLPY?si=PjknEp2a3Bq6iyMB",
    },
    {
      //2+3
      id: 1,
      videoUrl: "https://youtu.be/cFFh0ujx6B8?si=AjC1snGFog0CmZNc",
      
    },
    {
      //3+3
      id: 2,
      videoUrl: "https://youtu.be/Ri2eNafPaxg?si=HSrjL7L4QqNaq-R1",
    },
    {
      //4+2
      id: 3,
      videoUrl: "https://youtu.be/p-2RhbgigEA?si=bi_QbUMHhE7M-5qd",
    },
    {
      //4+3
      id: 4,
      videoUrl: "https://youtu.be/fVB0G2flTaI?si=cPtjYT1XROkM2h3q",
    },
    {
      //4+4
      id: 5,
      videoUrl: "https://youtu.be/tVQ6pu1mKcs?si=ZYWHEClzIC9GsFCg",
    },
    {
      //5+2
      id: 6,
      videoUrl: "https://youtu.be/V1JA54P8nXU?si=trxUbA_PjyvA1TPd",
    },
    {
      //5+3
      id: 7,
      videoUrl: "https://youtu.be/0fsIPUBGPDI?si=22rpJdxz_O2jrckb",
    },
    {
      //5+4
      id: 8,
      videoUrl: "https://youtu.be/F6hZ4vQOr4Q?si=amhvNIod-01IyZ15",
    },
    {
      //5+5
      id: 9,
      videoUrl: "https://youtu.be/KuFoOOY83Z0?si=UsgKrK_3E4WJUSzZ",
    },

  ],
  range2: [
    {
      //6+2
      id: 1,
      videoUrl: "https://youtu.be/L83bgWqnMIQ?si=Dv6_Hi2ZgJIQYCJP",
    },
    {
      //6+7
      id: 2,
      videoUrl: "https://youtu.be/3v2opzYo_5I?si=3oyO6v2Kp9gyBGoy",
    },
    {
      //4+9
      id: 3,
      videoUrl: "https://youtu.be/vZuy8cgnr78?si=Ufr3Rizn2p2FYWmB",
    },
    {
      //5+9
      id: 4,
      videoUrl: "https://youtu.be/wtNNfA5fyzs?si=Rk6g-YAP1unFd73U",
    },
    {
      //2+10
      id: 5,
      videoUrl: "https://youtu.be/pdwMCER3gpY?si=YNLdw_m4blic5PxT",
    },
    {
      //7+9
      id: 6,
      videoUrl: "https://youtu.be/nvZx_TcdgFo?si=7U3f3wQL9J366sL5",
    },
    {
      //8+9
      id: 7,
      videoUrl: "https://youtu.be/9r7mBTM9jZU?si=3zObP7Qv4zT-gOwZ",
    },
    {
      //3+8
      id: 8,
      videoUrl: "https://youtu.be/T18SPvf7MGg?si=k1PhM8JygPWUpE0d",
    },
    {
      //3+7
      id: 9,
      videoUrl: "https://youtu.be/D5lHF1EQauo?si=TUJ66Pgs2--lnggW",
    },
    {
      //6+8
      id: 10,
      videoUrl: "https://youtu.be/ZBRQ1WVS7zQ?si=DHg0S6_HpbYyB6CG",
    }
  ],
}


