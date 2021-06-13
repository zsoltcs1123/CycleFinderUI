// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import {render} from 'react-dom';
import SymbolList from './components/SymbolList';
import Chart from './components/Chart';
import './index.css';
import { css, jsx } from '@emotion/react'


//TODO load bootstrap from CDN instead, see https://www.w3schools.com/bootstrap/bootstrap_get_started.asp
import 'bootstrap/dist/css/bootstrap.min.css';


const rootElement = document.getElementById("root");

function renderSymbolList(){
  render(
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
          <SymbolList/>
        </div>
        <Chart />
    </div>, rootElement)
}

renderSymbolList();

  


