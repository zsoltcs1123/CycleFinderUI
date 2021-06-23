import { IAnalysisFunction } from "./IAnalysisFunction";

export default interface IChartTool {
    readonly id: string,
    fn: IAnalysisFunction,
    isActive: boolean
}

export class ChartTool implements IChartTool {

    id: string;
    fn: IAnalysisFunction;
    isActive: boolean;

    constructor(fn: IAnalysisFunction, isActive: boolean){
        this.fn = fn;
        this.isActive = isActive;
        this.id = fn.id + JSON.stringify(fn.parameters)
    }
}