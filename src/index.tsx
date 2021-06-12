import * as React from 'react';
import {render} from 'react-dom';
import SymbolList from './components/SymbolList';
import './index.css';
import CSS from 'csstype';


//TODO load bootstrap from CDN instead, see https://www.w3schools.com/bootstrap/bootstrap_get_started.asp
import 'bootstrap/dist/css/bootstrap.min.css';

const divStyle: CSS.Properties = {
  width: "200px"
}

const rootElement = document.getElementById("root");

function renderSymbolList(){
  render(
    <div style={divStyle}>
      <SymbolList/>
    </div>, rootElement)
}

renderSymbolList();

  


