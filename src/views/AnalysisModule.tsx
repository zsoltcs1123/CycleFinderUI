// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { css, jsx } from '@emotion/react'
import axios from 'axios';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { ChartContext } from '../context/ChartProvider';
import { IAnalysisFunction } from '../types/IAnalysisFunction';

interface IAnalysisModuleProps {
    name: string,
    functions: IAnalysisFunction[]
}

const defaultFunction: IAnalysisFunction= {
    name: "",
    url: "",
    parameters: []
};

export default function AnalysisModule(props: IAnalysisModuleProps) {

    const { addChartTool } = React.useContext(ChartContext);

    const [showParameters, setShowParameters] = React.useState(false);

    const [currentFunction, setCurrentFunction]: [IAnalysisFunction, (currentFunction: IAnalysisFunction) => void]
         = React.useState(defaultFunction)

    const handleClose = () => {
        setShowParameters(false)
    };

    const handleSubmit = () => {
        addChartTool({
            id: currentFunction.name + JSON.stringify(currentFunction.parameters),
            fn: currentFunction,
            isActive: true
          })
        setShowParameters(false)
    };

    const handleShow = (fn: IAnalysisFunction) => {
        setCurrentFunction(fn)
        setShowParameters(true);
    }

    const onInput = (id: string, newValue: string) => {
        const newParams = currentFunction.parameters.map(param => param.id == id ? {id: param.id, value: newValue} : {id: param.id, value: param.value})
        const newFn : IAnalysisFunction = {
            name: currentFunction.name,
            url: currentFunction.url,
            parameters: newParams
        }
        setCurrentFunction(newFn)
    }

    return (
        <div>
            <DropdownButton key={props.name} title={props.name}>
                {props.functions.map(fn => {
                    return <Dropdown.Item key={fn.name} onClick={() => handleShow(fn)}>{fn.name}</Dropdown.Item>;
                })}
            </DropdownButton>

            <Modal show={showParameters} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Parameters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentFunction.parameters.map(param => {
                        return <Form.Group key={param.id} as={Row} controlId={param.id}>
                            <Form.Row>
                                <Form.Label column sm={2}>
                                    {param.id}
                                </Form.Label>
                            </Form.Row>
                            <Col sm={10}>
                                <Form.Control
                                    type="text"
                                    placeholder={param.id} 
                                    defaultValue={param.value}
                                    onChange={e => onInput(param.id, e.target.value)} />
                            </Col>
                        </Form.Group>
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}