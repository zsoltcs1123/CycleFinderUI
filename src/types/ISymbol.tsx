import AbstractItem from "./IAbstractItem"

export default interface ISymbol extends AbstractItem {
    name: string;
    quoteAsset: string;
  }