import { ExtensionContext } from '@looker/extension-sdk-react'
import React from 'react'
import { useContext } from 'react'
import { useEffect, useState } from 'react'
import {Col,Row} from 'react-bootstrap'

export const TransposedTable = ({formatFilters, updatedFilters, vis, selectedTabFilters, reloadData, setReloadData, setData}) => {
    const [tableValues, setTableValues] = useState([])
    const {core40SDK:sdk} = useContext(ExtensionContext)
    useEffect(() => {   
        const getValues = async() => {
            if (vis && reloadData) {
                setTableValues([])
                let {query_values} = vis;

                let _filters = formatFilters({...updatedFilters});
                _filters = {..._filters, ...selectedTabFilters}
                query_values['filters'] = _filters;
                console.log("REBATE QUERY VALUES", query_values)
                let data = await sdk.ok(sdk.run_inline_query({result_format:'json',body:query_values, apply_formatting:true}))
                console.log("Rebate data", data)
                if (data.length > 0) {
                    let _data = []
                    let row = data.find(({show_in_viz}) => show_in_viz === "Yes");
                    setData(row);
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
            setReloadData(false)
        }     

        getValues()
    },[updatedFilters, reloadData])
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