import React, { useState, useEffect } from "react";

import { Button, ButtonGroup, Form, Modal, Spinner } from "react-bootstrap";

const type = 'quick filter'

const QuickFilter = ({ quickFilters, selectedFilters, selection, setSelectedFilters, updateBtn, setUpdateBtn, setIsFilterChanged }) => {
  const handleSelection = (e, name) => {
    let quickFilters = {...selectedFilters}
    if (quickFilters[type]?.hasOwnProperty(name)) {
      if (quickFilters[type][name].includes(e.target.id)) {
        let index = quickFilters[type][name].indexOf(e.target.id)
        quickFilters[type][name].splice(index,1)
      } else {
        quickFilters[type][name].push(e.target.id)
      }
    } else {
      quickFilters[type] = {...quickFilters[type],...{[name]:[]}}
      quickFilters[type][name].push(e.target.id)
    }
    if (quickFilters[type][name].length === 0){
      delete quickFilters[type][name]
    }
    setSelectedFilters(quickFilters)
    //setIsFilterChanged(true)
  }

  const isActive = (key, v) => {
    const val = v.join(',')
    if (!selectedFilters[type]?.hasOwnProperty(key)) {
      return false
    }
    if (selectedFilters[type][key]?.includes(val)) {
      return true
    }
    return false
  }

  return (
    <>
      {quickFilters?.options.map(f => {
        return (
          <>
            {/* <div className="quick-filter-label">{f['field']['label']}</div> */}
            <ButtonGroup key={f['field']['label']} className="pb-2">
              {f['values']?.map(v =>
                <Button
                  key={Object.values(v)}
                  active={isActive(f['field']['name'], Object.values(v))}
                  id={Object.values(v)}
                  type="radio"
                  name="filters"
                  onClick={(e) => handleSelection(e, f['field']['name'])}
                >{Object.values(v)}</Button>
              )}
            </ButtonGroup>
          </>
        )
      })}
    </>
  )
};

export default QuickFilter;
