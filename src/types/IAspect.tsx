import {IAbstractItem} from "../components/ListViewRenderPropGeneric"

export default interface IAspect extends IAbstractItem {
    time: string;
    description: string;
  }