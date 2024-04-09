import React from 'react'
import { Col, Form } from 'react-bootstrap'
import { sortDateFilterList } from '../../../../utils/globalFunctions';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'

export const DateFilterSelector = ({dateFilter,selectedFilters, updateDateRange, type, setSelectedFilters, dateRange}) => {
    
    const handleSelection = async (e) => {
      console.log(e)
        let filters = {...selectedFilters}
        filters[type] = {}
        filters[type][e.target.value] = 'Yes'
        setSelectedFilters(filters);
        await updateDateRange(dateRange, dateFilter, filters)
      };

    return(
          <div className="grid2">
            <RadioGroup row className='justify-content-center'>
              {sortDateFilterList(dateFilter?.options)?.map(filter => {
                return (
                  <div style={{minWidth:'165px'}}>
                    <FormControlLabel id={filter['name']} 
                      checked={Object.keys(selectedFilters[type]).find(key => key === filter['name'])? true:false} 
                      value={filter['name']} 
                      control={<Radio />} 
                      label={filter['label_short'].replace('(Yes / No)', '')}
                      onChange={handleSelection} 
                    />
                    {/* <Form.Group
                      controlId={filter['name']}>
                      <Form.Check
                        checked={Object.keys(selectedFilters[type]).find(key => key === filter['name'])? true:false}
                        id={filter['name']}
                        value={filter['name']}
                        type="radio"
                        // name="dateFilters"
                        onChange={handleSelection}
                        label={filter['label_short'].replace('(Yes / No)', '')}
                      />
                    </Form.Group> */}
                  </div>
                )
              })}     
            </RadioGroup>
          </div>
    )
}