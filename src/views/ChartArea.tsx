// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import SymbolList from './SymbolList';
import Chart from './Chart';
import { css, jsx } from '@emotion/react'
import AnalysisToolbox from './AnalysisToolbox';
import { ChartContext } from '../context/ChartProvider';
import ChartTools from './ChartTools';
import AspectList from './AspectList';


export default function ChartArea() {

  const { setSymbol } = React.useContext(ChartContext);
  const { chartTools } = React.useContext(ChartContext);

  function onSymbolClicked(key: string) {
    setSymbol(key)
  }

  return (
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
        <AspectList/>
      </div>
    </div>
  );
}