import * as React from 'react';
import axios from 'axios';
import {ListViewRenderPropGeneric} from './ListViewRenderPropGeneric';
import ISymbol from '../types/ISymbol';

const defaultSymbols:ISymbol[] = [];

const [symbols, setSetSymbols]: [ISymbol[], (symbols: ISymbol[]) => void] = React.useState(defaultSymbols);
const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
const [error, setError]: [string, (error: string) => void] = React.useState("");

React.useEffect(() => {
    axios
    .get<ISymbol[]>("https://jsonplaceholder.typicode.com/posts", {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      //data coming from api doesn't have a key attribute, which is required for ListViewRenderPropGeneric
      const dataWithKeys = response.data.map(symbol => {return {key: symbol.name, name: symbol.name, quoteAsset: symbol.quoteAsset} as ISymbol})
      setSetSymbols(dataWithKeys);
      setLoading(false);
    })
    .catch(ex => {
      const error =
      ex.response.status === 404
        ? "Resource Not found"
        : "An unexpected error has occurred";
      setError(error);
      setLoading(false);
    });
  }, []);

export default function SymbolList() {
    return (
        <ListViewRenderPropGeneric
        items={defaultSymbols}
        renderer={(item) => <div>{item.name}</div>}
      /> 
    )
}
