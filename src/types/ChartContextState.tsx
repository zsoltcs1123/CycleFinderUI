import { BarData } from "lightweight-charts";
import IChartTool from "./IChartTool";

export type ChartContextState = {
  symbol: string
  setSymbol: (symbol: string) => void

  chartTools: IChartTool[]
  addChartTool: (tool: IChartTool) => void
  removeChartTool: (tool: IChartTool) => void

  barData: BarData[]
  setBardata: (data: BarData[]) => void
}