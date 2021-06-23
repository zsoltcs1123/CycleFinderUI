// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { css, jsx } from '@emotion/react'
import AnalysisModule from './AnalysisModule';
import { ChartContext } from '../context/ChartProvider';
import { AnalysisType } from '../types/IAnalysisFunction';
import { calculateIncrement, calculateMaxValue } from '../utils/ChartUtils';
import { Increment, MaxValue } from '../api/ApiFunctions';

export default function AnalysisToolbox() {
    const { symbol } = React.useContext(ChartContext); //TODO don't use symbol for this. UI might be still loading data when symbol is already clicked
    const { barData} = React.useContext(ChartContext);

    return (
        <div>
            <AnalysisModule
                name="W24"
                functions={[{ 
                    id: "W24 levels", 
                    type: AnalysisType.W24_levels, 
                    parameters: [
                        { id: Increment, value: calculateIncrement(barData).toString() },
                        { id: MaxValue, value: calculateMaxValue(barData).toString() }
                    ] }]}
                isEnabled={symbol != ""}
            />
        </div>
    );
}