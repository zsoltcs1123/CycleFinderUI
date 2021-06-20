// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { css, jsx } from '@emotion/react'
import IChartTool from '../types/IChartTool';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import {Close} from '@emotion-icons/material'


interface IChartToolProps {
    tool: IChartTool
}

export default function ChartTool(props: IChartToolProps) {

    //TODO parameter display code is duplicated

    return <div
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: left;
        `}>
        <Form>
            <Form.Row>
                <Form.Check type="checkbox" />
                <Form.Label>
                    <details>
                        <summary>{props.tool.fn.name}</summary>
                        <div>
                            {props.tool.fn.parameters.map(param => {
                                return <Form.Group key={param.id} as={Row} controlId={param.id}>
                                    <Form.Row>
                                        <Form.Label column="sm" lg={2}>
                                            {param.id}
                                        </Form.Label>
                                    </Form.Row>
                                    <Col xs="auto">
                                        <Form.Control
                                            size="sm"
                                            type="text" //TODO change to Range input
                                            placeholder={param.id}
                                            defaultValue={param.value} />
                                    </Col>
                                </Form.Group>
                            })}
                        </div>
                    </details>
                </Form.Label>
                <Button onClick={e => alert("shit happened")}>
                    <Close size="24" />            
                </Button>
            </Form.Row>
        </Form>
    </div>
}