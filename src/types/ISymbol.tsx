import {IAbstractItem} from "../components/ListViewRenderPropGeneric"

export default interface ISymbol extends IAbstractItem {
    name: string;
    quoteAsset: string;
  }