import { Input, InputAdornment, OutlinedInput, FormControlLabel, Checkbox } from "@mui/material";
import { indexOf } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";

const type = "short reason";

const ShortReasons = ({
  fieldOptions,
  selectedFilters,
  setSelectedFilters,
}) => {
  const [field, setField] = useState("");
  const [fullField, setFullField] = useState({})
  const [expandMenu, setExpandMenu] = useState(false);
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (fieldOptions?.["options"] && fieldOptions?.["fields"]?.name) {
      setField(fieldOptions["fields"]?.name);
      setFullField(fieldOptions['fields'])
    }
  }, [fieldOptions]);


  const handleFieldSelection = (value) => {
    let _field = field;
    let filters = {...selectedFilters}
    console.log(filters)
    console.log(_field + value)
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
    setSelectedFilters(filters)
  }


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

  return (
    <>
      <div
        className={expandMenu ? "wrapFilters fullScreen" : "wrapFilters pt-2"}
      >
        <i
          class="fal fa-times closeOptions"
          onClick={() => setExpandMenu(false)}
        ></i>        
        {Array.isArray(fieldOptions?.["options"])
          ? fieldOptions["options"].map((fieldOption) => {
              let [key, value] = Object.entries(fieldOption)[0];
              if (value?.toUpperCase().includes(search?.toUpperCase()) || search.trim() == ""){
                return(               
                <div className="one" key={value}>
                    <FormControlLabel control={<Checkbox />}
                      className="check-selector"
                      label={value}
                      checked={isActive(key, value)}
                      name="shortReason"
                      // id={fieldOption}
                      value={value}
                      onChange={() => handleFieldSelection(value)}
                    />
                  {/* <Form.Group>
                    <Form.Check
                      type="checkbox"
                      className=""
                      label={value}
                      checked={isActive(key, value)}
                      name="shortReason"
                      // id={fieldOption}
                      value={value}
                      onClick={() => handleFieldSelection(value)}
                    />
                  </Form.Group> */}
                </div>)  
              }
            })
          : ""}
      </div>
    </>
  );
};

export default ShortReasons;
