import React, { useState } from "react";
import { useEffect } from "react";

import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Autocomplete, CircularProgress, TextField, Typography } from "@mui/material";
import { LoadingComponent } from "../LoadingComponent";
import { useContext } from "react";
import { ApplicationContext } from "../../Main2";
import { filter } from "lodash";
import { sortFilters } from "../../utils/globalFunctions";
import { TabContext } from "../ReportContainer";
import { all_dashboards } from "@looker/sdk";

const type = 'filter'

// const FilterDropdown = ({ handleChange, label, name, options, value }) => {

//   return (
//     <>
//       <p>{label}</p>

//       <Form.Select

//         onChange={(e) => handleChange(name, e.target.value)}
//         value={value}
//         >
//         <option key="n/a" value="N/A">Please select</option>
//         {options?.map((optionText) => (
//           <option key={optionText} value={optionText}> {optionText}</option>
//         ))}
//       </Form.Select>
//     </>
//   );
// };

const Filters = ({
  isLoading,
  allFilters,
  filters,
  setFilters,
  selectedFilters,
  setSelectedFilters,
  updatedFilters,
  isDefault,
  setIsDefault,
  setIsFilterChanged,
  showActionBtns = true,
  isFilterLoading,
  formatFilters
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

 

  console.log(filters, "filters")

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
      <FiltersComponent formatFilters={formatFilters} updatedFilters={updatedFilters} allFilters={allFilters} setFilters={setFilters}  isFilterLoading={isFilterLoading} setExpandMenu={setExpandMenu} expandMenu={expandMenu} filters={filters} formatValues={formatValues} selectedFilters={selectedFilters} handleFilterSelection={handleFilterSelection}/>
      <Modal show={expandMenu} onHide={() => setExpandMenu(false)}>
        <Modal.Header className="modal-selection-header" closeButton>Filters</Modal.Header>
        <Modal.Body>
          <FiltersComponent formatFilters={formatFilters} updatedFilters={updatedFilters} allFilters={allFilters} setFilters={setFilters} isFilterLoading={isFilterLoading} setExpandMenu={setExpandMenu} expandMenu={expandMenu} filters={filters} formatValues={formatValues} selectedFilters={selectedFilters} handleFilterSelection={handleFilterSelection}/>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>

  );
};

export default Filters;

const FiltersComponent = ({allFilters, setFilters, setExpandMenu, expandMenu,filters,formatValues,selectedFilters,updatedFilters,handleFilterSelection, isFilterLoading, formatFilters}) => {
  useEffect(() => {
    let index = allFilters.indexOf(filters);
    let _changed = allFilters[index]?.options?.map(o => {
      o['values'] = []
      return o
    })
    console.log("UPDATEd filters for filters", _changed);
  },[updatedFilters])
  
  console.log("FILTERS", filters)
  return (
    <div  className={expandMenu? "wrapFilters expanded": "wrapFilters"}>
      <i class="fal fa-times closeOptions" onClick={() => setExpandMenu(false)} ></i>
        {sortFilters(filters?.options)?.map((filterOption) => (
          //formatValues(filterOption.field.name,filterOption.values)?.length > 0?
          <AutoCompleteFilter updatedFilters={updatedFilters} formatFilters={formatFilters} allFilters={allFilters} setFilters={setFilters} filters={filters} filterOption={filterOption} selectedFilters={selectedFilters} handleFilterSelection={handleFilterSelection} formatValues={formatValues}/>
        //:''
        )

      )}        
      {isFilterLoading?
          <div className="one filter-selector" style={{'position':'relative', 'paddingTop':'100px'}}>
              <LoadingComponent />
          </div>
          :''
      }
  </div>
  )
}

const AutoCompleteFilter = ({allFilters, filters, setFilters, filterOption, selectedFilters, updatedFilters, handleFilterSelection, formatValues, formatFilters}) => {  
  const {application, getValues} = useContext(ApplicationContext);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true;
    if (loading) {
      return undefined;
    }
    if (filterOption.values.length > 0) {
      return undefined
    }
    
    (async () => {
      if (active && open && filterOption.values.length === 0) {
        let _options = []
        let index = allFilters.indexOf(filters)
        setLoading(true)
        let values = []
        if (filterOption.field.enumerations) {
          values = filterOption.field.enumerations?.map(e => {return {[filterOption.field['name']]:e.value}})
        } else {
          let _updatedFilters = formatFilters({...updatedFilters})
          console.log("UPDATED FORMAT FILTERS", _updatedFilters)
          values = await getValues(filterOption.field, _updatedFilters, application)
        }
        //_values.push({ field: filterOption.field, values: values });
        setFilters(filters => filters.map((f,i) => {
          if (i === index) {
            let fields_index = filters[index]['options'].findIndex((option) => option.field === filterOption.field)
            console.log("LOADING FILTER VALUES INDEX",fields_index)
            f['options'][fields_index]['values'] = values;
            return f;
          } else return f}))
        //setOptions(res)
        console.log("LOADING FILTER VALUES", values)
        setLoading(false)
      }
    })();
    return () => {
      active=false
    }
  },[open])

  return(
    <div className="one filter-selector" key={filterOption.name}>
    <p variant="h6">{filterOption.field?.label_short}</p>            
        <Autocomplete name={filterOption.name} className="filter-input"
          disableCloseOnSelect
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          id="disable-clearable" //disablePortal={true}
          PopperComponent={"bottom-start"}                  
          multiple
          onChange={(el,v) => handleFilterSelection(filterOption.field.name,el,v)}
          renderInput={(params) => 
            <TextField {...params}
              placeholder={"Please select"}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading? <CircularProgress color="inherit" size={20} style={{marginRight:'30px'}} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          }
          value={selectedFilters[type][filterOption['field']['name']] ?? []}
          //options={formatValues(filterOption.field.name, options)}
          options={formatValues(filterOption.field.name,filterOption.values)}
        />           

  </div>
  )
}
