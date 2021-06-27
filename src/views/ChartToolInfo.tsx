// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { css, jsx } from '@emotion/react'
import IChartTool, { ChartTool } from '../types/IChartTool';
import Button from 'react-bootstrap/Button'
import { Close } from '@emotion-icons/material'
import Table from 'react-bootstrap/Table'
import { ChartContext } from '../context/ChartProvider';


interface IChartToolProps {
    tool: IChartTool
}



export default function ChartToolInfo(props: IChartToolProps) {

    const [checked, setChecked] = React.useState(true);
    const { removeChartTool } = React.useContext(ChartContext);
    const { updateChartTool } = React.useContext(ChartContext);

    function onChartToolStateChanged(e: React.ChangeEvent<HTMLInputElement>, tool: IChartTool){
        setChecked(e.currentTarget.checked);
        updateChartTool(new ChartTool(tool.fn, e.currentTarget.checked, tool.timeStamp));
    }

    return <div
        css={css`
                display: flex;
                flex-direction: row;
                justify-content: left;
                align-items: top;
                `}>
        <Table size="sm">
            <tbody>
                <tr>
                    <td>
                        <input type="checkbox" checked={checked} onChange={e => onChartToolStateChanged(e, props.tool)} />
                    </td>
                    <td>
                        <details>
                            <summary>{props.tool.fn.id}</summary>
                            <div>
                                <Table size="sm">
                                {props.tool.fn.parameters.map(param => {
                                    return <tr key={param.id}>
                                        <td>{param.id}</td>
                                        <td>{param.value}</td>
                                    </tr>
                                })}
                                </Table>
                            </div>
                        </details>
                    </td>
                    <td>
                        <Button size="sm" onClick={e => removeChartTool(props.tool)}>
                            <Close size="20" />
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    </div>


}