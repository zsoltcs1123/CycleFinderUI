// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import axios from 'axios';
import ListViewRenderPropGeneric from '../components/ListViewRenderPropGeneric';
import ClipLoader from "react-spinners/ClipLoader";
import { css, jsx } from '@emotion/react'
import IAspect from '../types/IAspect';


const override = css` 
  display: block;
  margin: 0 auto;
  border-color: blue;
`;

const defaultAspects:IAspect[] = [];

export default function AspectList() {

    const [aspects, setAspects]: [IAspect[], (aspects: IAspect[]) => void] = React.useState(defaultAspects);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = React.useState("");

    React.useEffect(() => {
        axios
        
        .get<IAspect[]>("https://localhost:5001/api/AstroEvent/GetAspectsForPeriod?from=1640995261&to=1643673661", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          //data coming from api doesn't have a key attribute, which is required for ListViewRenderPropGeneric
          const dataWithKeys = response.data.map(aspect => {return {key: aspect.time, time: aspect.time, description: aspect.description} as IAspect})

          console.log(dataWithKeys);
          setAspects(dataWithKeys);
          setLoading(false);
        })
        .catch(ex => {
          if (ex.response) {
            // client received an error response (5xx, 4xx)
          } else if (ex.request) {
            // client never received a response, or request never left
          } else {
            // anything else
          }
          //setError(error);
          setLoading(false);
        });
      }, []);

    return (
        <div>
            <h2>JANUARY ASPECTS</h2>
            <ClipLoader loading={loading} css={override}  size={150} />
            <ListViewRenderPropGeneric 
              items={aspects}
              renderer={(item) => <div>{item.time + "-" + item.description}</div>}
            /> 
        </div>

    )
}
