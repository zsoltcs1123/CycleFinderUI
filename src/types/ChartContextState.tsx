import IChartTool from "./IChartTool";

export type ChartContextState = {
  chartTools: IChartTool[]
  addChartTool: (tool: IChartTool) => void
}