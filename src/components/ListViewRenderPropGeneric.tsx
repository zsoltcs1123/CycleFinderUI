// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import IAbstractItem from "../types/IAbstractItem"
import { css, jsx } from '@emotion/react'

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
      <ListGroup css={css`
          max-height: 800px;
          margin-bottom: 10px;
          overflow:scroll;
          -webkit-overflow-scrolling: touch;
      `}>
        {props.items.map((item) => {
          return <ListGroup.Item key={item.key} action onClick={() => onItemClicked(item.key)}>{props.renderer(item)}</ListGroup.Item>;
        })}
      </ListGroup>
    );
  }