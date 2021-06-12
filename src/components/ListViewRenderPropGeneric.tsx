import * as React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import IAbstractItem from "../types/IAbstractItem"

interface PropsType<T> {
    items: T[];
    renderer: (item: T) => React.ReactNode;
  }

  function onItemClicked(key: string) {
    alert('You clicked the ListGroupItem' + key);
  }

  //TODO export default, extract interfaces to other files
  export default function ListViewRenderPropGeneric<T extends IAbstractItem>(props: PropsType<T>) {
    return (
      <ListGroup>
        {props.items.map((item) => {
          return <ListGroup.Item key={item.key} action onClick={() => onItemClicked(item.key)}>{props.renderer(item)}</ListGroup.Item>;
        })}
      </ListGroup>
    );
  }