import React, { Fragment, useState, useEffect } from "react";
import {
  Button,
  Form,
  Modal,
  Spinner,
  Row,
  Col,
  Tooltip,
  Container,
  OverlayTrigger,
} from "react-bootstrap";
import * as $ from "jquery";
import moment from "moment";

export const CurrentSelection2 = ({
  filters,
  selectedFilters,
  setSelectedFilters,
  updatedFilters,
  setUpdatedFilters,
  formatFilters,
}) => {
  const [currentSelection, setCurrentSelection] = useState([]);
  const [updatedSelection, setUpdateSelection] = useState([]);

  useEffect(() => {
    setCurrentSelection(
      formatCurrentSelection(
        JSON.parse(JSON.stringify(selectedFilters)),
        "current"
      )
    );
  }, [selectedFilters]);
  useEffect(() => {
    setUpdateSelection(
      formatCurrentSelection(
        JSON.parse(JSON.stringify(updatedFilters)),
        "updated"
      )
    );
  }, [updatedFilters]);

  function removeAccount(fieldName) {
    setSelectedFilters((prev) => {
      if (prev.includes(fieldName)) {
        return prev.filter((selectedFilters) => selectedFilters !== fieldName);
      } else {
        return [...prev, fieldName];
      }
    });
  }

  const formatCurrentSelection = (filtersSelections, selectionType) => {
    let current = [];
    Object.keys(filtersSelections).map((key) => {
      if (Object.keys(filtersSelections[key]).length > 0) {
        let _filters = [...filters];
        let filter = _filters.find(({ type }) => type === key);
        Object.keys(filtersSelections[key]).map((row) => {
          if (key !== "date filter") {
            if (key === "date range") {
              let obj = {
                key: row,
                type: key,
                label: filtersSelections[key][row],
                value: filtersSelections[key][row],
                removable: false,
                selection_type: selectionType,
              };
              current.splice(0, 0, obj);

              // let first = obj.label.split(' to ')[0];
              // let format1 = moment(first).format('MM-DD-YYYY').toString();
              // const last = obj.label.split(' to ')[1];
              // let format2 = moment(last).format('MM-DD-YYYY').toString();
            } 
            // else if (filter.type === "account group" || filter.type === "account filter") {
            //   let field = filter.fields.find(({ name }) => name === row);
            //   let obj = {
            //     key: row,
            //     type: filter.type,
            //     // label: `${field.label_short}: ${filtersSelections[key][row]}`,
            //     label: ` ${filtersSelections[key][row]}`,
            //     value: filtersSelections[key][row],
            //     removable: true,
            //     selection_type: selectionType,
            //   };

            //   obj.value.split(",").map((d, i) => {
            //     const tempObect = { ...obj, label: `${d}`, value: d };
            //     current.push(tempObect);
            //   });
            // }
             else {
              console.log("row", row)
              console.log('filters', filter)
              //let field = filter.fields.find(({ name }) => name === row);
              //console.log("field", field)
              if (Array.isArray(filtersSelections[key][row])) {
                filtersSelections[key][row].map(value => {
                  let obj = {
                    key: row,
                    type: key,
                    label: `${value}`,
                    value: value,
                    removable: true,
                    selection_type: selectionType,
                  };
                  current.push(obj);
                })
              } else {
                let obj = {
                  key: row,
                  type: key,
                  label: `${filtersSelections[key][row]}`,
                  //label: `${field.label_short}: ${filtersSelections[key][row]}`,
                  value: filtersSelections[key][row],
                  removable: true,
                  selection_type: selectionType,
                };
                console.log("filter selection", obj)
                current.push(obj);
              }
            }
          }
        });
      }
    });
    return current;
  };

  const removeFilter = (selection) => {
    let type =
      selection.selection_type === "updated"
        ? JSON.parse(JSON.stringify(updatedFilters))
        : JSON.parse(JSON.stringify(selectedFilters));
    
    if (Array.isArray(type[selection.type][selection.key])) {
      
      let index = type[selection.type][selection.key].indexOf(selection.value);
      
      console.log("current selection",type[selection.type])
      console.log("current selection",selection.value)
      type[selection.type][selection.key].splice(index,1);
    } else {
      if (type[selection.type][selection.key]) {
        delete type[selection.type][selection.key];
      } else {
        type[selection.type][selection.key] = selection.value;
      }
    }


    if (selection.selection_type === "updated") {
      if (
        JSON.parse(JSON.stringify(selectedFilters))[selection.type][
          selection.key
        ]
      ) {
        let type = JSON.parse(JSON.stringify(selectedFilters));
        if (Array.isArray(type[selection.type][selection.key])) {
          let index = type[selection.type][selection.key].indexOf(selection.value);
          type[selection.type][selection.key].splice(index,1)
        } else {
          delete type[selection.type][selection.key];
        }

        setSelectedFilters(JSON.parse(JSON.stringify(type)));
      } else {
        setUpdatedFilters(JSON.parse(JSON.stringify(type)));
      }
    } else {
      setSelectedFilters(JSON.parse(JSON.stringify(type)));
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      These are pending filters you have selected. Please use the "Update
      Selections" button to update the table.
    </Tooltip>
  );

  return (
    <Fragment>
      {updatedSelection?.map((selection) => {
        return (
          <div
            key={Math.random() * 6}
            className={
              !currentSelection.some((c) => c.label == selection.label && c.type == selection.type)
                ? "theOptions"
                : "theOptions red"
            }
          >
            {/*<p className="mb-0">{currentSelection[selection]}</p>*/}
            <p
              className={
                !currentSelection.some((c) => c.label == selection.label)
                  ? "mb-0 blue strikethrough"
                  : "mb-0 blue"
              }
            >
              {selection?.label?.replace(/\s*\(.*?\)\s*/g, "")}
            </p>
            {selection?.removable ? (
              <i
                onClick={() => removeFilter(selection)}
                class="fal fa-times blue"
              ></i>
            ) : (
              ""
            )}
          </div>
        );
      })}
      {currentSelection
        ?.filter((s) => {
          return !updatedSelection.some((u) => s.label == u.label && u.type == s.type);
        })
        .map((selection) => {
          
          return (
            <>
            <OverlayTrigger key={selection.label}
            placement="right"
            overlay={renderTooltip}
            className="tooltipHover"
          >
            <div className={"theOptions"} key={selection.label}>
              {/*<p className="mb-0">{currentSelection[selection]}</p>*/}
              <p className="mb-0 blue">
                {selection?.label?.replace(/\s*\(.*?\)\s*/g, "")}
              </p>

              <i
                onClick={() => removeFilter(selection)}
                class="fal fa-times blue"
              ></i>
            </div>
          </OverlayTrigger>
            
          </>
          );
        })}
    </Fragment>
  );
};
