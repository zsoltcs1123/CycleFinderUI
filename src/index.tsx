// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { render } from 'react-dom';
import './index.css';
import { css, jsx } from '@emotion/react'


//TODO load bootstrap from CDN instead, see https://www.w3schools.com/bootstrap/bootstrap_get_started.asp
import 'bootstrap/dist/css/bootstrap.min.css';
import ChartArea from './views/ChartArea';
import ChartProvider from './context/ChartProvider';

const rootElement = document.getElementById("root");

function renderSymbolList() {
  render(
    <ChartProvider>
      <ChartArea />
    </ChartProvider>
    , rootElement)
}

renderSymbolList();




