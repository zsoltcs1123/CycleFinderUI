import { IAnalysisFunction } from "./IAnalysisFunction";

export default interface IChartTool {
    id: string,
    fn: IAnalysisFunction,
    isActive: boolean
}