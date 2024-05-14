import { ExtensionContext } from '@looker/extension-sdk-react'
import React from 'react'
import { useContext } from 'react'
import { useEffect, useState } from 'react'
import {Col,Row} from 'react-bootstrap'

export const TransposedTable = ({formatFilters, updatedFilters, vis}) => {
    const [tableValues, setTableValues] = useState([])
    const {core40SDK:sdk} = useContext(ExtensionContext)
    useEffect(() => {   
        const getValues = async() => {
            if (vis) {
                let {query_values} = vis;
                query_values['filters'] = formatFilters({...updatedFilters});
                query_values['limit'] = 1
                console.log("REBATE QUERY VALUES", query_values)
                let data = await sdk.ok(sdk.run_inline_query({result_format:'json',body:query_values}))
                if (data.length > 0) {
                    let _data = []
                    let row = data[0];
                    let {series_labels, column_order} = query_values['vis_config']
                    await column_order?.map(col => {
                        let label = series_labels[col];
                        let value = row[col];
                        _data.push([label,value])
                    })
                    setTableValues(_data)
                }
                console.log("VIS", data)
            }
        }     

        getValues()
    },[updatedFilters])
    return(
        <div className='transposed-table'>
            {tableValues.map(col => (
                <Row>
                    <Col className='transposed transposed-label' lg={9}>{col[0]}</Col>
                    <Col className='transposed transposed-value' lg={3}>{col[1]}</Col>
                </Row>
            ))}
        </div>
    )
}