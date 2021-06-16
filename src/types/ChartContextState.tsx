import IChartTool from "./IChartTool";
import ISymbol from "./ISymbol";

export type ChartContextState = {
  symbol: string
  setSymbol: (symbol: string) => void
  chartTools: IChartTool[]
  addChartTool: (tool: IChartTool) => void
}