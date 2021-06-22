// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { css, jsx } from '@emotion/react'
import AnalysisModule from './AnalysisModule';
import { ChartContext } from '../context/ChartProvider';
import { AnalysisType } from '../types/IAnalysisFunction';

export default function AnalysisToolbox() {
    const { symbol } = React.useContext(ChartContext); //TODO don't use symbol for this. UI might be still loading data when symbol is already clicked
    const { barData} = React.useContext(ChartContext);

    const calculateMaxValue = () => barData.length > 0 ? barData[barData.length -1].high * 3 : 1;
    const calculateIncrement = () => barData.length > 0 ? barData[barData.length -1].high < 100000 ? 1000 : 100 : 1

    return (
        <div>
            <AnalysisModule
                name="W24"
                functions={[{ 
                    id: "W24 levels", 
                    type: AnalysisType.W24_levels, 
                    parameters: [
                        { id: "Increment", value: calculateIncrement().toString() },
                        { id: "MaxValue", value: calculateMaxValue().toString() }
                    ] }]}
                isEnabled={symbol != ""}
            />
        </div>
    );
}