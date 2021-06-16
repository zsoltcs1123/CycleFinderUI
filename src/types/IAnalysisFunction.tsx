export interface IAnalysisFunction {
    name: string,
    url: string,
    parameters: IAnalysisFunctionParameter[]
}

export interface IAnalysisFunctionParameter {
    //Cannot use 'key', because it is a React internal name.
    id: string,
    value: string,
}