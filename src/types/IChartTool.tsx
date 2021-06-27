import { IAnalysisFunction } from "./IAnalysisFunction";

export default interface IChartTool {
    readonly id: string,
    fn: IAnalysisFunction,
    isActive: boolean,
    timeStamp: number;
}

export class ChartTool implements IChartTool {

    id: string;
    fn: IAnalysisFunction;
    isActive: boolean;
    timeStamp: number;

    constructor(fn: IAnalysisFunction, isActive: boolean, timeStamp?: number){
        this.fn = fn;
        this.isActive = isActive;
        this.id = fn.id + JSON.stringify(fn.parameters)
        this.timeStamp = timeStamp == undefined ? Date.now() : timeStamp;
    }
}