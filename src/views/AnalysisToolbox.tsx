// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { css, jsx } from '@emotion/react'
import AnalysisModule from './AnalysisModule';
import { ChartContext } from '../context/ChartProvider';
import { AnalysisType } from '../types/IAnalysisFunction';
import { calculateCurrentPrice, calculateFirstTimeStamp, calculateIncrement, calculateMaxValue } from '../utils/ChartUtils';
import { CurrentPrice, Filter, From, Increment, MaxValue, Planet, Planets, TimeFrame } from '../api/ApiFunctions';

export default function AnalysisToolbox() {
    const { symbol } = React.useContext(ChartContext); //TODO don't use symbol for this. UI might be still loading data when symbol is already clicked
    const { barData } = React.useContext(ChartContext);

    return (
        <div
            css={css`
            display: flex;
            flex-direction: row;
            justify-content: left;
            align-items: top;
          `}>
            <AnalysisModule
                name="W24"
                functions={[{
                    id: "W24 levels",
                    type: AnalysisType.W24_levels,
                    parameters: [
                        { id: Increment, value: calculateIncrement(barData).toString() },
                        { id: MaxValue, value: calculateMaxValue(barData).toString() }
                    ]
                },
                {
                    id: "W24 planetary lines",
                    type: AnalysisType.W24_planetary_lines,
                    parameters: [
                        { id: Planet, value: Planets[0] },
                        { id: CurrentPrice, value: calculateCurrentPrice(barData).toString()},
                        { id: TimeFrame, value: "1d"},
                        { id: From, value: calculateFirstTimeStamp(barData).toString() },
                        { id: Increment, value: calculateIncrement(barData).toString() },
                    ]
                },
                ]}
                isEnabled={symbol != ""}
            />
            <AnalysisModule
                name="Ephemeris"
                functions={[{
                    id: "Retrogrades",
                    type: AnalysisType.Retrogrades,
                    parameters: [
                        { id: Planet, value: Planets[0] },
                        { id: From, value: calculateFirstTimeStamp(barData).toString() },
                        { id: Filter, value: (true).toString() },
                    ]
                }]}
                isEnabled={symbol != ""}
            />
        </div>
    );
}