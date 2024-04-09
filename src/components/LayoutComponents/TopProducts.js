import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

const type = 'top products';

export const TopProducts = ({filterOption,selectedFilters,setSelectedFilters}) => {
    const [value,setValue] = useState(0);
    const [step, setStep] = useState(0)
    const [field, setField] = useState({})

    useEffect(() => {
        if (filterOption?.fields) {            
            setField(filterOption['fields'])
        }
    },[filterOption])

    const handleChange = (event, step) => {
        setStep(step);
        setValue(event.target.value)
        let _filters = {...selectedFilters};
        _filters[type] = {};
        _filters[type][field['name']] = event.target.value;
        setSelectedFilters(_filters)
    }

    return (
        <>
        <p>Select top percentage of products</p>
        <div className='top-products-container'>

            <div style={{'width':'80%'}}>
                <input
                    value={value}
                    onChange={(changeEvent) => handleChange(changeEvent,25)}
                    type="range"
                    min="0"
                    max="100"
                    step={step}
                    list="steplist"
                    className="range-slider mt-2"
                />

                <datalist id="steplist" className="range">
                    <option value={0} label="0">0</option>
                    <option value={25} label="25">25</option>
                    <option value={50} label="50">50</option>
                    <option value={75} label="75">75</option>
                    <option value={100} label="100">100</option>
                </datalist>
            </div>
            <input
                value={value}
                onChange={(changeEvent) => handleChange(changeEvent,1)}
                placeholder={value}
                type="search"
                list="steplist"
                min="0"
                max="100"
                from="0"
                step="1"
                className="value"
            />

        </div>

        </>
    )
}