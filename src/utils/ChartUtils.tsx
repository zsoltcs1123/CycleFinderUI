import { BarData, Time } from "lightweight-charts";

export const calculateMaxValue = (barData: BarData[]) : number => barData.length > 0 ? barData[barData.length -1].high * 3: 1;

export const calculateIncrement = (barData: BarData[]) : number => {
    if (barData.length < 1) return 0;
    const max = calculateMaxValue(barData);
    const latest = barData[barData.length -1].high;
    const range = max - latest;

    if (range < 200000 && range > 10000) return 1000;
    else if (range < 10000 && range > 1000) return 100;
    else if (range < 1000 && range > 100) return 10;
    else if (range < 100 && range > 10) return 1;
    else if (range < 10 && range > 1) return 0.1;
    else if (range < 1 && range > 0.1) return 0.01;
    else if (range < 0.1 && range > 0.01) return 0.001;
    else if (range < 0.01 && range > 0.001) return 0.0001;
    else if (range < 0.001 && range > 0.0001) return 0.00001;
    else if (range < 0.0001 && range > 0.00001) return 0.000001;
    else if (range < 0.00001 && range > 0.000001) return 0.0000001;

    else return 0;
}

export const calculateFirstTimeStamp = (barData: BarData[]): Time => barData.length > 0 ? barData[0].time : 0 as Time;

export const calculateCurrentPrice = (barData: BarData[]): number =>  barData.length > 0 ? barData[barData.length -1].high : 0;