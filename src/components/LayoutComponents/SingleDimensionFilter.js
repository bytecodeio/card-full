import { Checkbox, FormControlLabel, Input, InputAdornment, OutlinedInput, Tooltip } from "@mui/material";
import { indexOf } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";

const SingleDimensionFilter = ({
  type,
  label,
  fieldOptions,
  selectedFilters,
  setSelectedFilters,
  showActionBtns = true,
}) => {
  const [field, setField] = useState("");
  const [fullField, setFullField] = useState({})
  const [expandMenu, setExpandMenu] = useState(false);
  const [search, setSearch] = useState("")

  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (fieldOptions["options"] && fieldOptions["options"]["field"]?.name) {
      setField(fieldOptions["options"]["field"]?.name);
      setFullField(fieldOptions['options']['field'])
      setOptions(fieldOptions["options"]["values"]);
    }
  }, [fieldOptions]);


  const handleFieldSelection = (value) => {
    console.log(value)
    let _field = field;
    let filters = {...selectedFilters}
    if (filters[type]?.hasOwnProperty(_field)) {
      console.log("has own Prop")
      if (filters[type][_field].includes(value)) {
        console.log("includes")
        let index = filters[type][_field].indexOf(value)
        filters[type][_field].splice(index,1)
      } else {
        filters[type][_field].push(value)
      }
    } else {
      console.log("Create new field")
      filters[type] = {...filters[type],...{[_field]:[]}}
      filters[type][_field].push(value)
    }
    if (filters[type][_field].length === 0){
      console.log("No Length")
      delete filters[type][_field]
    }
    console.log("account filters", filters)
    setSelectedFilters(filters)
  }

  const handleFieldsAll = () => {
    let filters = { ...selectedFilters };
    let _fieldOptions = {...fieldOptions}
    let allVals = _fieldOptions["options"]["values"].map((opt) => {
      return Object.values(opt)[0];
    });
    let _filteredVals = allVals?.filter(val => val?.toUpperCase().includes(search?.toUpperCase()) || search.trim() == "")
    console.log("DEBUG FILTERS", _filteredVals)
    console.log("DEBUG FILTERS", filters)
    if (!filters.hasOwnProperty(type)) {
      filters[type] = {}
    }
    filters[type][field] = _filteredVals;
    
    console.log("DEBUG FILTERS", filters);
    setSelectedFilters(filters);
  };

  const clearAllAccounts = () => {
    let filters = { ...selectedFilters };
    filters[type] = {};
    setSelectedFilters(filters);
    //setSelectedOptions([]);
  };

  const handleMenuExpand = () => {
    setExpandMenu(true);
  };

  const isActive = (key, v) => {
    const val = v;   
    if(fullField['suggest_dimension'] == key){
      if (!selectedFilters[type]?.hasOwnProperty(field)) {
        return false
      }
      if (selectedFilters[type][field]?.includes(val)) {
        return true
      }
      return false
    }
    if (!selectedFilters[type]?.hasOwnProperty(key)) {
      return false
    }
    if (selectedFilters[type][key]?.includes(val)) {
      return true
    }
    return false
  }

  const handleSearch =(e) => {
    setSearch(e.target.value)
  }

  const handleSearchClear = () => {
    setSearch("")
  }

  return (
    <>
      {showActionBtns ? (
        <>
          <span className="allOptions clear first" onClick={handleFieldsAll}>
            Select All
          </span>

          <span className="allOptions clear second" onClick={clearAllAccounts}>
            Clear Filters
          </span>

          <span className="allOptions clear" onClick={() => handleMenuExpand()}>
            Expand
          </span>
          <div className="mb-5"></div>
        </>
      ) : (
        ""
      )}
      {/* <div
        className={expandMenu ? "wrapFilters fullScreen" : "wrapFilters pt-2"}
      >
        <i
          class="fal fa-times closeOptions"
          onClick={() => setExpandMenu(false)}
        ></i>
        <OutlinedInput className="filter-input" style={{width:'100%'}} value={search} onChange={handleSearch} placeholder="Search Accounts"
          endAdornment={
            search != ""?
            <InputAdornment position="end">
              <a onClick={handleSearchClear}>
                <i className="fal fa-times"></i>
              </a>              
            </InputAdornment>
            :''
          }
        />
        
        {Array.isArray(fieldOptions["options"]["values"])
          ? fieldOptions["options"]["values"]?.map((fieldOption) => {
              let [key, value] = Object.entries(fieldOption)[0];
              if (value?.toUpperCase().includes(search?.toUpperCase()) || search.trim() == ""){
                return(               
                <div className="one" key={value}>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      className=""
                      label={value}
                      checked={isActive(key, value)}
                      name="accountFilters"
                      // id={fieldOption}
                      value={value}
                      onClick={() => handleFieldSelection(value)}
                    />
                  </Form.Group>
                </div>)  
              }
            })
          : ""}
      </div> */}
      <SingleDimensionFilterComponent label={label} isActive={isActive} expandMenu={expandMenu} setExpandMenu={setExpandMenu} search={search} handleSearch={handleSearch} handleSearchClear={handleSearchClear} fieldOptions={fieldOptions} handleFieldSelection={handleFieldSelection}/>
      <Modal show={expandMenu} onHide={() => setExpandMenu(false)}>
        <Modal.Header className="modal-selection-header" closeButton>Filter</Modal.Header>
        <Modal.Body>
          <SingleDimensionFilterComponent label={label} isActive={isActive} expandMenu={expandMenu} setExpandMenu={setExpandMenu} search={search} handleSearch={handleSearch} handleSearchClear={handleSearchClear} fieldOptions={fieldOptions} handleFieldSelection={handleFieldSelection}/>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default SingleDimensionFilter;

export const SingleDimensionFilterComponent = ({isActive,setExpandMenu,expandMenu, search, handleSearch, handleSearchClear, fieldOptions, handleFieldSelection,label}) => {
  return (        
  <>
    <div className="filter-input-container">
          <OutlinedInput className="filter-input" style={{width:'100%'}} value={search} onChange={handleSearch} placeholder={`Search ${label}`}
            endAdornment={
              search != ""?
              <InputAdornment position="end">
                <a onClick={handleSearchClear}>
                  <i className="fal fa-times"></i>
                </a>              
              </InputAdornment>
              :''
            }/> 
        </div>
      <div
        className={expandMenu?"wrapFilters expanded":"wrapFilters"}
      >
        <i
          class="fal fa-times closeOptions"
          onClick={() => setExpandMenu(false)}
        ></i>


               
        {Array.isArray(fieldOptions["options"]["values"])
          ? fieldOptions["options"]["values"]?.map((fieldOption) => {
              let [key, value] = Object.entries(fieldOption)[0];
              if ((value?.toUpperCase().includes(search?.toUpperCase()) || search.trim() == "") && (value != "" && value != null)){
                return(               
                <div className="one" key={value}>
                    <FormControlLabel control={<Checkbox />}
                      className="check-selector"
                      label={value}
                      checked={isActive(key, value)}
                      name="accountFilters"
                      // id={fieldOption}
                      value={value}
                      onChange={() => handleFieldSelection(value)}
                    />
                </div>)  
              }
            })
          : ""}
      </div>
    </>
  )
}
