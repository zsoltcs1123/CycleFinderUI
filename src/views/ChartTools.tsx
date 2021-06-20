// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { css, jsx } from '@emotion/react'
import { ChartContext } from '../context/ChartProvider';
import ChartTool from './ChartTool';

export default function ChartTools(){
    const { chartTools } = React.useContext(ChartContext);

    return <div>
        {chartTools.map(tool => {
            return <ChartTool key={tool.id} tool={tool} />
        } )}
    </div>
}