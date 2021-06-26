import { AnalysisType, IAnalysisFunctionParameter } from "../types/IAnalysisFunction";

export const generateParameters = (url: string, params: IAnalysisFunctionParameter[]): string =>
    params.length > 0 ? `${url}?${params.map(p => `${p.id}=${p.value}&`).join('')}`.slice(0, -1) : url;

export const getUrl = (type: AnalysisType): string =>
    ApiFunctions.has(type) ? ApiFunctions.get(type) as string : "";

export const generateFullUrl = (type: AnalysisType, params: IAnalysisFunctionParameter[]): string =>
    generateParameters(getUrl(type), params);

const ApiFunctions: Map<AnalysisType, string> = new Map<AnalysisType, string>([
    [AnalysisType.BarData, "https://localhost:5001/api/CandleStick/GetAllData"],
    [AnalysisType.W24_levels, "https://localhost:5001/api/PriceLevels/GetW24PriceLevels"],
    [AnalysisType.Retrogrades, "https://localhost:5001/api/CandleStickMarker/GetRetrogrades"]
])

export const Increment = "Increment"
export const MaxValue = "MaxValue"
export const Planet = "Planet"