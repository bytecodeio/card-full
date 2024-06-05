import { FormControlLabel, TextField, FormControl, OutlinedInput, InputLabel, InputAdornment } from '@mui/material'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
import { ApplicationContext } from '../../Main2'



export const RebateFilters = ({tabFilters, selectedTabFilters, setSelectedTabFilters, handleTabVisUpdate, setReloadData, updatedFilters, formatFilters, tableValues, data}) => {
    const [targetPercent, setTargetPercent] = useState()
    const [targetPercentMeasure, setTargetPercentMeasure] = useState()
    const [targetValue, setTargetValue] = useState()

    const [type, setType] = useState()
    const [typeValue, setTypeValue] = useState()

    const [addOn, setAddOn] = useState()
    const [addOnMeasure, setAddOnMeasure] = useState()
    const [addOnValue, setAddOnValue] = useState()
    const { getValues } = useContext(ApplicationContext)
    

    useEffect(() => {
        //let _selectedTabFilters = {...selectedTabFilters}
        let _target = tabFilters.find(({type}) => type === "target percent filter")
        if (_target) {
            setTargetPercent(_target)
            setTargetValue(_target?.fields.default_filter_value?.replace(/[^0-9.]/g,''))
        }
        let _type = tabFilters.find(({type}) => type === "type selector filter")
        if (_type) {
            setType(_type)
            setTypeValue(_type?.fields.default_filter_value)
        }
        let _addOn = tabFilters.find(({type}) => type === "add on filter")
        if (_addOn) {
            setAddOn(_addOn)
            setAddOnValue(_addOn?.fields.default_filter_value?.replace(/[^0-9.]/g,''))
        }

        let _addOnMeas = tabFilters.find(({type}) => type === "add on value")
        if (_addOnMeas) {
            setAddOnMeasure(_addOnMeas)
        }

        let _targetMeas = tabFilters.find(({type}) => type === "target percent value")
        if (_targetMeas) {
            setTargetPercentMeasure(_targetMeas)
        }
        //setSelectedTabFilters(_selectedTabFilters)
        //handleTabVisUpdate()
    },[])

    useEffect(() => {
        console.log("rebate estimator tab filters", selectedTabFilters)
    },[selectedTabFilters])

    useEffect(() => {
        if (tableValues) {
            if (typeValue === "pct") {
                console.log("REBATE MEASURE",addOnMeasure)
                if (addOnMeasure) {                    
                    let value = data[addOnMeasure['fields']['name']]
                    console.log("REBATE VALUE", data)
                    console.log("REBATE VALUE", value)
                    setAddOnValue(value?.replace(/[^0-9.]/g,''))
                }

            } else {
                if (targetPercentMeasure) {
                    let value = data[targetPercentMeasure['fields']['name']]
                    setTargetValue(value?.replace(/[^0-9.]/g,'')) 
                }
            }
        }
    },[data])

    const handleTypeChange = (e) => {
        setTypeValue(e)
        let _tabFilters = {...selectedTabFilters};
        _tabFilters[type['fields']['name']] = e;
        if (e === "pct") {
            let _value = targetValue
            _tabFilters[targetPercent['fields']['name']] = _value;
            delete _tabFilters[addOn['fields']['name']];
        } else {
            let _value = addOnValue
            _tabFilters[addOn['fields']['name']] = _value;
            delete _tabFilters[targetPercent['fields']['name']];
        }
        setSelectedTabFilters(_tabFilters)
    }

    const handleTargetInput = (e) => {
        console.log(e)
        setTargetValue(e.target.value)
        let _tabFilters = {...selectedTabFilters};
        _tabFilters[targetPercent['fields']['name']] = e.target.value
        delete _tabFilters[addOn['fields']['name']]
        setSelectedTabFilters(_tabFilters)
    }

    const handleAddOnInput = (e) => {
        console.log(e.target.value)
        setAddOnValue(e.target.value)
        let _tabFilters = {...selectedTabFilters};
        _tabFilters[addOn['fields']['name']] = e.target.value;
        delete _tabFilters[targetPercent['fields']['name']]
        setSelectedTabFilters(_tabFilters)
    }

    const handleUpdateClick = () => {
        setReloadData(true)
        handleTabVisUpdate({})
        //updateValues();
    }

    const updateValues = async () => {
        let _filters = formatFilters({...updatedFilters})
        _filters = {..._filters, ...selectedTabFilters}
        console.log("Rebate values",_filters)
        let _type = typeValue
        if (_type === "pct") {
            let _val = await getValues(addOnMeasure, _filters)
            console.log("Rebate Values", _val)
        } else {
            let _val = await getValues(targetPercentMeasure, _filters)
            console.log("Rebate Values", _val)
        }
    }
    
    return(
        <>  
            {type &&
                <ButtonGroup className='field-button-group-content rebate-group'>
                    {type.fields.enumerations.map(e => (
                        <Button className='field-group-button' onClick={() => handleTypeChange(e.value)} active={typeValue?typeValue === e.value:selectedTabFilters[type['fields']['name']] === e.value} value={e.value}>{e.label}</Button> 
                    ))}           
                </ButtonGroup>
            }
            {targetPercent &&
                <div className='rebate-filter-input'>
                    <InputLabel>{targetPercent['fields']['label_short']}</InputLabel>
                    <FormControl>
                        <OutlinedInput disabled={typeValue==="dlr"?"disabled":''} onChange={handleTargetInput} placeholder='Enter Target Compliance' inputProps={{style:{textAlign:'right'}}}
                        value={targetValue}
                        endAdornment={<InputAdornment position='end'>%</InputAdornment>}
                        />
                    </FormControl>
                </div>
            }
            <div className='d-inline-flex align-items-center'>
                {addOn &&
                    <div className='rebate-filter-input'>
                        <InputLabel>{addOn['fields']['label_short']}</InputLabel>
                        <FormControl>
                            <OutlinedInput disabled={typeValue==="pct"?"disabled":''} onChange={handleAddOnInput} placeholder='Enter Additional SOURCE Purchases'
                            value={addOnValue}
                            startAdornment={<InputAdornment position='start'>$</InputAdornment>}
                            />
                        </FormControl>
                    </div>
                }
                <Button onClick={handleUpdateClick}>Update</Button>
            </div>

        </>
    )
}