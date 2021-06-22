// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import axios from 'axios';
import ListViewRenderPropGeneric from '../components/ListViewRenderPropGeneric';
import ISymbol from '../types/ISymbol';
import ClipLoader from "react-spinners/ClipLoader";
import { css, jsx } from '@emotion/react'


interface ISymbolListProps{
  onSymbolClicked: (symbol: string) => void
}

const override = css` 
  display: block;
  margin: 0 auto;
  border-color: blue;
`;

const defaultSymbols:ISymbol[] = [];

export default function SymbolList(props: ISymbolListProps) {

    const [symbols, setSymbols]: [ISymbol[], (symbols: ISymbol[]) => void] = React.useState(defaultSymbols);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = React.useState("");

    React.useEffect(() => {
        axios
        
        .get<ISymbol[]>("https://localhost:5001/api/CandleStick/GetSymbols", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          //data coming from api doesn't have a key attribute, which is required for ListViewRenderPropGeneric
          const dataWithKeys = response.data.map(symbol => {return {key: symbol.name, name: symbol.name, quoteAsset: symbol.quoteAsset} as ISymbol})

          setSymbols(dataWithKeys.filter(symbol => symbol.name == "BTCUSDT" || symbol.name == "ETHUSDT"));
          setLoading(false);
        })
        .catch(ex => {
          if (ex.response) {
            // client received an error response (5xx, 4xx)
          } else if (ex.request) {
            // client never received a response, or request never left
          } else {
            // anything else
          }
          //setError(error);
          setLoading(false);
        });
      }, []);

    return (
        <div>
            <h2>Binance Symbols</h2>
            <ClipLoader loading={loading} css={override}  size={150} />
            <ListViewRenderPropGeneric 
              items={symbols}
              renderer={(item) => <div>{item.name}</div>}
              onItemClicked = {props.onSymbolClicked}
            /> 
        </div>

    )
}
