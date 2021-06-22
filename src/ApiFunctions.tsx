export const getAllDataUrl = (symbol: string): string => 
`https://localhost:5001/api/CandleStick/GetAllData?symbol=${symbol}&timeFrame=1d`;

export const getW24LevelsUrl = (maxValue: number, increment: number): string => 
`https://localhost:5001/api/PriceLevels/GetW24PriceLevels?maxValue=${maxValue}&increment=${increment}}`;