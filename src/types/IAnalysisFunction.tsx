export enum AnalysisType {
    BarData,
    W24_levels,
    SQ9_levels,
    Retrogrades,
    None, //Required for initialization
}

export interface IAnalysisFunction {
    id: string,
    type: AnalysisType
    parameters: IAnalysisFunctionParameter[]
}

export interface IAnalysisFunctionParameter {
    //Cannot use 'key', because it is a React internal name.
    id: string,
    value: string,
}
