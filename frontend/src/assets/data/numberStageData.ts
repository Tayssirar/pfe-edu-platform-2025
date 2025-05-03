// numberStageData.ts
export interface NumberStageData {
    first: number
    second: number
  }
  
export interface StageDataMap {
  range1: NumberStageData[]
  range2: NumberStageData[]
}
  
  export const numberStageData: StageDataMap = {
    range1: [
      { first: 1, second: 2 },
      { first: 2, second: 2 },
      { first: 4, second: 4 },
      { first: 3, second: 4 },
      { first: 2, second: 3 },
      { first: 4, second: 2 },
      { first: 3, second: 3 },
      { first: 5, second: 3 },
      { first: 4, second: 5 },
      { first: 2, second: 5 },
      { first: 5, second: 2 },
      { first: 2, second: 2 },
      { first: 3, second: 5 },
      { first: 2, second: 4 },
      { first: 4, second: 4},
      { first: 1, second: 2 },
      { first: 3, second: 3 },
      { first: 4, second: 3 },
      { first: 4, second: 5 },
      { first: 2, second: 3},

    ],
    range2:[
    { first: 2, second: 6 }, 
    { first: 5, second: 7 }, 
    { first: 9, second: 9 }, 
    { first: 6, second: 8 }, 
    { first: 7, second: 6 }, 
    { first: 8, second: 3 }, 
    { first: 7, second: 9 }, 
    { first: 5, second: 8 }, 
    { first: 8, second: 8 }, 
    { first: 6, second: 6 }, 
    { first: 7, second: 9 }, 
    { first: 5, second: 6 }, 
    { first: 2, second: 6 }, 
    { first: 8, second: 7 },
    { first: 5, second: 9 },
    { first: 9, second: 9 },   
    { first: 7, second: 8 }, 
    { first: 9, second: 3 }, 
    { first: 4, second: 6 }, 
    { first: 8, second: 8 }, 
    { first: 7, second: 6 }, 
      // ... 20 items
    ],
  }