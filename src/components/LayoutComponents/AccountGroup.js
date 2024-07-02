import { indexOf } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Checkbox, FormControlLabel, Input, InputAdornment, OutlinedInput, Tooltip } from "@mui/material";

const type = "account group";

const AccountGroup = ({
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
    console.log(_field)
    let filters = {...selectedFilters}
    if (filters[type]?.hasOwnProperty(_field)) {
      if (filters[type][_field].includes(value)) {
        let index = filters[type][_field].indexOf(value)
        filters[type][_field].splice(index,1)
      } else {
        filters[type][_field].push(value)
      }
    } else {
      filters[type] = {...filters[type],...{[_field]:[]}}
      filters[type][_field].push(value)
    }
    if (filters[type][_field].length === 0){
      delete filters[type][_field]
    }
    console.log("filters", filters)
    setSelectedFilters(filters)
  }
  // function handleFieldSelection(value) {
  //   let key = "users.account_name." + value.replace(" ", "_");

  //   let _selectedOptions = [...selectedOptions];
  //   if (_selectedOptions.find((v) => v === value)) {
  //     let index = _selectedOptions.indexOf(value);
  //     _selectedOptions.splice(index, 1);
  //   } else {
  //     _selectedOptions.push(value);
  //   }
  //   let filters = { ...selectedFilters };
  //   filters[account_key][key] = value;
  //   if (_selectedOptions.length === 0) {
  //     filters[account_key] = {};
  //     setSelectedFilters(filters);
  //     setSelectedOptions([]);
  //   } else {
  //     setSelectedOptions(_selectedOptions);
  //     setSelectedFilters(filters);
  //   }
  // }

  const handleFieldsAll = () => {
    let filters = { ...selectedFilters };
    let _fieldOptions = {...fieldOptions}
    let allVals = _fieldOptions["options"]["values"].map((opt) => {
      return Object.values(opt)[0];
    });
    let _filteredVals = allVals.filter(val => val?.toUpperCase().includes(search?.toUpperCase()) || search.trim() == "")
    //setSelectedOptions(allVals);
    filters[type][field] = _filteredVals;
    setSelectedFilters(filters);
  };

  const clearAllAccounts = () => {
    let filters = { ...selectedFilters };
    filters[type] = {};
    setSelectedFilters(filters);
    setSelectedOptions([]);
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

          <span className="allOptions clear second" id="account-group" onClick={clearAllAccounts}>
            Clear All Acct Grps
          </span>

          <span className="allOptions clear" onClick={() => handleMenuExpand()}>
            Expand
          </span>
          <div className="mb-5"></div>
        </>
      ) : (
        ""
      )}
      <div
        className={expandMenu ? "wrapFilters fullScreen" : "wrapFilters pt-2"}
      >
        <i
          class="fal fa-times closeOptions"
          onClick={() => setExpandMenu(false)}
        ></i>
        <OutlinedInput className="filter-input" style={{width:'100%'}} value={search} onChange={handleSearch} placeholder="Search Groups"
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
        {selectedFilters && selectedFilters[type] && selectedFilters[type][field]?
          Object.values(selectedFilters[type][field]).length > 50 && 
            <div className="account-note">Selecting over 50 accounts may slow load times</div>   
            :''
          }
        {Array.isArray(fieldOptions["options"]["values"])
          ? fieldOptions["options"]["values"]?.map((fieldOption) => {
              let [key, value] = Object.entries(fieldOption)[0];
              if (value?.toUpperCase().includes(search?.toUpperCase()) || search.trim() == "" && (value != "" && value != null)){
                return(               
                <div className="one" key={value}>
                    <FormControlLabel control={<Checkbox />}
                      className="check-selector"
                      label={value}
                      checked={isActive(key, value)}
                      name="accountGroups"
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
  );
};

export default AccountGroup;
