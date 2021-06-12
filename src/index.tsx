import * as React from 'react';
import {render} from 'react-dom';
import {ListViewRenderPropGeneric} from './components/ListViewRenderPropGeneric';
import './index.css';
import CSS from 'csstype';
import axios from "axios";
import ISymbol from './types/ISymbol';


//TODO load bootstrap from CDN instead, see https://www.w3schools.com/bootstrap/bootstrap_get_started.asp
import 'bootstrap/dist/css/bootstrap.min.css';

const divStyle: CSS.Properties = {
  width: "100px"
}

const rootElement = document.getElementById("root");

let symbols:ISymbol[] = [];

axios
  .get<ISymbol[]>("https://localhost:5001/api/CandleStick/GetSymbols", {
    headers: {
      "Content-Type": "application/json"
    },
  })
  .then(response => {
    //data coming from api doesn't have a key attribute, which is required for ListViewRenderPropGeneric
    symbols = response.data.map(symbol => {return {key: symbol.name, name: symbol.name, quoteAsset: symbol.quoteAsset}})
    console.log(JSON.stringify(symbols, null, '\t'));
    renderSymbolList()
  })
  .catch((err => {
    if (err.response) {
      // client received an error response (5xx, 4xx)
    } else if (err.request) {
      // client never received a response, or request never left
    } else {
      // anything else
    }
  })); 

function renderSymbolList(){
  render(
    <div style={divStyle}>
      <ListViewRenderPropGeneric
        items={symbols}
        renderer={(item) => <div>{item.name}</div>}
      /> 
    </div>, rootElement)
}

renderSymbolList();

  


