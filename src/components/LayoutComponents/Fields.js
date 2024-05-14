import { Checkbox, FormControlLabel } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const Fields = ({
  fieldOptions,
  setTabList,
  tabList,
  currentInnerTab,
  updateBtn,
  setUpdateBtn,
  showActionBtns = true

}) => {
  const [expandMenu, setExpandMenu] = useState(false);

  useEffect(() => {
    console.log("fields options", fieldOptions)
  },[fieldOptions])

  function handleFieldSelection(fieldName) {
    
    // setUpdateBtn(false);
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    if (currentTab["selected_fields"].includes(fieldName)) {
      let index = currentTab["selected_fields"].indexOf(fieldName);
      currentTab["selected_fields"].splice(index, 1);
    } else {
      currentTab["selected_fields"].push(fieldName);
    }
    setTabList(tabs);
  }

  const handleFieldsAll = () => {
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    currentTab['selected_fields'] = fieldOptions.map(fo => {return fo['name']})
    setTabList(tabs)
  }

  const handleRestoreDefault = () => {
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    currentTab['selected_fields'] = [...currentTab['default_fields']]
    setTabList(tabs)
  }

  const handleMenuExpand = () => {
    setExpandMenu(true)
  }

  const sortData= (data) => {
    console.log(data)
    if (data) {
      return data.sort((a,b) => {
       var x = a.label_short.toLowerCase();
       var y = b.label_short.toLowerCase();
           return x < y ? -1 : x > y ? 1 : 0;
       });
    }
    return null
   }


   console.log(fields, "fields")


  return (
    <>
    {showActionBtns?
      <div className="mb-5">
          <>
            <span className="allOptions clear first" onClick={handleFieldsAll}>Select All</span>

            <span className="allOptions clear restore" onClick={handleRestoreDefault}>Restore Defaults</span>

            <span className="allOptions clear" onClick={() => handleMenuExpand()}>Expand</span>
          </>
      </div>
      :''
    }
    {/* <div  className={expandMenu ? "wrapFilters fullScreen" : "wrapFilters"}>
      <i class="fal fa-times closeOptions" onClick={() => setExpandMenu(false)} ></i>
      {sortData(fieldOptions)?.map((fieldOption) => (
        <div className="one" key={fieldOption.name}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              className=""
              label={fieldOption.label_short}
              checked={tabList.length > 0?tabList[currentInnerTab]["selected_fields"].includes(
                fieldOption.name
              ):false}
              name="Fields"
              // id={fieldOption.name}
              value={fieldOption.fields}
              onChange={() => handleFieldSelection(fieldOption.name)}
            />
          </Form.Group>
        </div>
      ))}
    </div> */}
    <FieldsComponent setExpandMenu={setExpandMenu} expandMenu={expandMenu} sortData={sortData} fieldOptions={fieldOptions} handleFieldSelection={handleFieldSelection} tabList={tabList} currentInnerTab={currentInnerTab} />
    <Modal show={expandMenu} onHide={() => setExpandMenu(false)}>
      <Modal.Header className="modal-selection-header" closeButton>Fields</Modal.Header>
      <Modal.Body>
        <FieldsComponent setExpandMenu={setExpandMenu} expandMenu={expandMenu} sortData={sortData} fieldOptions={fieldOptions} handleFieldSelection={handleFieldSelection} tabList={tabList} currentInnerTab={currentInnerTab} />
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  </>
    // set value to name
  );
};

export default Fields;

const FieldsComponent = ({setExpandMenu, expandMenu, sortData, fieldOptions, handleFieldSelection, tabList, currentInnerTab}) => {
    return (
      <div  className={expandMenu?"wrapFilters expanded":"wrapFilters"}>
        <i class="fal fa-times closeOptions" onClick={() => setExpandMenu(false)} ></i>
        {sortData(fieldOptions)?.map((fieldOption) => (
          <div className="one field-select" key={fieldOption.name}>
              <FormControlLabel control={<Checkbox />}
                className="check-selector"
                label={fieldOption.label_short}
                checked={tabList.length > 0?tabList[currentInnerTab]["selected_fields"].includes(
                  fieldOption.name
                ):false}
                name="Fields"
                // id={fieldOption.name}
                value={fieldOption.fields}
                onChange={() => handleFieldSelection(fieldOption.name)}
              />
          </div>
        ))}
      </div>
    )
}
