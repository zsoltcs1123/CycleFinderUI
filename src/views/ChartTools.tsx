// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { css, jsx } from '@emotion/react'
import { ChartContext } from '../context/ChartProvider';
import ChartToolInfo from './ChartToolInfo';
import IChartTool from '../types/IChartTool';

interface IChartToolsProps{
    chartTools: IChartTool[]
}

export default function ChartTools(props: IChartToolsProps){

    return <div>
        {props.chartTools.map(tool => {
            return <ChartToolInfo key={tool.id} tool={tool} />
        } )}
    </div>
}