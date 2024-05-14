import React, { useState } from "react";
import { useEffect } from "react";

import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Autocomplete, TextField, Typography } from "@mui/material";

const type = 'filter'

const FilterDropdown = ({ handleChange, label, name, options, value }) => {

  return (
    <>
      <p>{label}</p>

      <Form.Select

        onChange={(e) => handleChange(name, e.target.value)}
        value={value}
        >
        <option key="n/a" value="N/A">Please select</option>
        {options?.map((optionText) => (
          <option key={optionText} value={optionText}> {optionText}</option>
        ))}
      </Form.Select>
    </>
  );
};

const Filters = ({
  isLoading,
  filters,
  selectedFilters,
  setSelectedFilters,
  isDefault,
  setIsDefault,
  setIsFilterChanged,
  showActionBtns = true
}) => {
  const [expandMenu, setExpandMenu] = useState(false)


  function handleFilterSelection(filterName, el, newValue) {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      newFilters[type][filterName] = newValue;
      return newFilters;
    });
    //setIsFilterChanged(true);
  }

  const handleMenuExpand = () => {
    setExpandMenu(true)
  }

  const optionTest = ['Test', 'Test2']

  const formatValues = (name,val) => {
    let ret = val.map(v => {
      return v[name]
    })
    let _filtered = ret.filter(v => {
      return v != null || v != undefined
    })
    return _filtered
  }

  const sortData= (data) => {
    if (data) {
      return data.sort((a,b) => {
       var x = a.label_short.toLowerCase();
       var y = b.label_short.toLowerCase();
           return x < y ? -1 : x > y ? 1 : 0;
       });
    }
    return null
   }

  return (
    <>
    {showActionBtns?
      <div className="position-relative d-flex justify-content-end">
          <>
            <span className="allOptions clear mt-3 filter-expand"  onClick={() => handleMenuExpand()}>Expand</span>
          </>
      </div>
      :''
    }
      <FiltersComponent setExpandMenu={setExpandMenu} expandMenu={expandMenu} filters={filters} sortData={sortData} formatValues={formatValues} selectedFilters={selectedFilters} handleFilterSelection={handleFilterSelection}/>
      <Modal show={expandMenu} onHide={() => setExpandMenu(false)}>
        <Modal.Header className="modal-selection-header" closeButton>Filters</Modal.Header>
        <Modal.Body>
          <FiltersComponent setExpandMenu={setExpandMenu} expandMenu={expandMenu} filters={filters} sortData={sortData} formatValues={formatValues} selectedFilters={selectedFilters} handleFilterSelection={handleFilterSelection}/>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>

  );
};

export default Filters;

const FiltersComponent = ({setExpandMenu, expandMenu,filters, sortData, formatValues,selectedFilters,handleFilterSelection}) => {
  return (
    <div  className={expandMenu? "wrapFilters expanded": "wrapFilters"}>
      <i class="fal fa-times closeOptions" onClick={() => setExpandMenu(false)} ></i>
        {sortData(filters)?.options?.map((filterOption) => (
          formatValues(filterOption.field.name,filterOption.values)?.length > 0?
          <div className="one filter-selector" key={filterOption.name}>
            <p variant="h6">{filterOption.field.label_short}</p>
            
                <Autocomplete name={filterOption.name} className="filter-input"
                  id="disable-clearable"
                  PopperComponent={"bottom-start"}                  
                  multiple
                  onChange={(el,v) => handleFilterSelection(filterOption.field.name,el,v)}
                  renderInput={(params) => <TextField {...params} placeholder="Please select" />}
                  value={selectedFilters[type][filterOption['field']['name']] ?? []}
                  options={formatValues(filterOption.field.name,filterOption.values)}
                />           

          </div>
        :''
        )
      )}
  </div>
  )
}
