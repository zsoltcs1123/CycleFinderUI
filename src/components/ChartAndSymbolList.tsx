// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import SymbolList from './SymbolList';
import Chart from './Chart';
import { css, jsx } from '@emotion/react'

const defaultSymbol = "";


export default function ChartAndSymbolList(){

    const [currentSymbol, setSymbol]: [string, (symbols: string) => void] = React.useState(defaultSymbol);

    function onSymbolClicked(key: string) {
        setSymbol(key)
      }

    return(
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
            <SymbolList onSymbolClicked={onSymbolClicked}/>
          </div>
          <Chart symbol={currentSymbol} />
      </div>);
}