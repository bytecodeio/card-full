import { FormControlLabel, TextField, FormControl, OutlinedInput, InputLabel } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'

export const RebateFilters = ({tabFilters, selectedTabFilters, setSelectedTabFilters, handleTabVisUpdate}) => {
    const [targetPercent, setTargetPercent] = useState()
    const [type, setType] = useState()
    const [addOn, setAddOn] = useState()

    useEffect(() => {
        //let _selectedTabFilters = {...selectedTabFilters}
        let _target = tabFilters.find(({type}) => type === "target percent filter")
        if (_target) {
            setTargetPercent(_target)
        }
        let _type = tabFilters.find(({type}) => type === "type selector filter")
        if (_type) {
            setType(_type)
        }
        let _addOn = tabFilters.find(({type}) => type === "add on filter")
        if (_addOn) {
            setAddOn(_addOn)
        }
        //setSelectedTabFilters(_selectedTabFilters)
        //handleTabVisUpdate()
    },[])

    useEffect(() => {
        console.log("rebate estimator tab filters", selectedTabFilters)
    },[selectedTabFilters])
    
    return(
        <>  
            {type &&
                <ButtonGroup className='field-button-group-content rebate-group'>
                    {type.fields.enumerations.map(e => (
                        <Button className='field-group-button' active={selectedTabFilters[type['fields']['name']] === e.value} value={e.value}>{e.label}</Button> 
                    ))}           
                </ButtonGroup>
            }
            {targetPercent &&
                <div className='rebate-filter-input'>
                    <InputLabel>{targetPercent['fields']['label_short']}</InputLabel>
                    <FormControl>
                        <OutlinedInput placeholder='Enter Target Compliance' value={selectedTabFilters[targetPercent['fields']['name']]}/>
                    </FormControl>
                </div>
            }
            {addOn &&
                <div className='rebate-filter-input'>
                    <InputLabel>{addOn['fields']['label_short']}</InputLabel>
                    <FormControl>
                        <OutlinedInput placeholder='Enter Additional SOURCE Purchases' value={selectedTabFilters[addOn['fields']['name']]}/>
                    </FormControl>
                </div>
            }
        </>
    )
}