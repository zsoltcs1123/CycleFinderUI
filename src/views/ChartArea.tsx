// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import SymbolList from './SymbolList';
import Chart from '../components/Chart';
import { css, jsx } from '@emotion/react'
import AnalysisToolbox from './AnalysisToolbox';
import ChartProvider from '../context/ChartProvider';

const defaultSymbol = "";


export default function ChartArea() {

  const [currentSymbol, setSymbol]: [string, (symbols: string) => void] = React.useState(defaultSymbol);

  function onSymbolClicked(key: string) {
    setSymbol(key)
  }

  return (
    <ChartProvider>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: left;
          align-items: top;
        `}>
        <div css={css`
            width: 200px;
          `}>
          <SymbolList onSymbolClicked={onSymbolClicked} />
        </div>
        <div>
          <AnalysisToolbox />
          <Chart symbol={currentSymbol} />
        </div>
      </div>
    </ChartProvider>
  );
}