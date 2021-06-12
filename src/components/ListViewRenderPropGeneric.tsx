import * as React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import AbstractItem from "../types/IAbstractItem"

interface PropsType<T> {
    items: T[];
    renderer: (item: T) => React.ReactNode;
  }

  function alertClicked() {
    alert('You clicked the ListGroupItem');
  }

  //TODO export default, extract interfaces to other files
  export default function ListViewRenderPropGeneric<T extends AbstractItem>(props: PropsType<T>) {
    return (
      <ListGroup>
        {props.items.map((item) => {
          return <ListGroup.Item key={item.key} action onClick={alertClicked}>{props.renderer(item)}</ListGroup.Item>;
        })}
      </ListGroup>
    );
  }