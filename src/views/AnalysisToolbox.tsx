// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { css, jsx } from '@emotion/react'
import AnalysisModule from './AnalysisModule';
import { ChartContext } from '../context/ChartProvider';

export default function AnalysisToolbox() {
    const { symbol } = React.useContext(ChartContext); //TODO don't use symbol for this. UI might be still loading data when symbol is already clicked

    return (
        <div>
            <AnalysisModule
                name="W24"
                functions={[{ id: "W24 levels", parameters: [{ id: "Octave:", value: "10" }] }]}
                isEnabled={symbol != ""}
            />
        </div>
    );
}