// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { ChartContextState } from '../types/ChartContextState';
import IChartTool from '../types/IChartTool';
import { css, jsx } from '@emotion/react'
import PropTypes from 'prop-types';

const contextDefaultValues: ChartContextState = {
    chartTools: [],
    addChartTool: () => { /*initialize*/ }
};

export const ChartContext = React.createContext<ChartContextState>(
    contextDefaultValues
);

const ChartProvider: React.FC = ({ children }) => {
    const [chartTools, setChartTools] = React.useState<IChartTool[]>([]);

    const addChartTool = (tool: IChartTool) => {
        const newTool: IChartTool = {
            id: tool.id,
            isActive: tool.isActive
        }
        setChartTools([...chartTools, newTool])
        alert("Chart tool added");
    }

    return (
        <ChartContext.Provider
            value={{
                chartTools,
                addChartTool
            }}
        >
            {children}
        </ChartContext.Provider>
    );
}

ChartProvider.propTypes = {
    children: PropTypes.node,
}

export default ChartProvider;