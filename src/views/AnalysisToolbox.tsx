// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { css, jsx } from '@emotion/react'
import AnalysisModule from './AnalysisModule';

export default function AnalysisToolbox(){
    return (
        <div>
            <AnalysisModule 
                name = "W24"
                functions = {[{name: "Add W24 levels...", url: "", parameters: [{id: "Octave:", value: "10"}]}]}
            />
        </div>
    );
}