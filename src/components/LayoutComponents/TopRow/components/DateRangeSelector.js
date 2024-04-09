import React, { useState, useContext } from "react";
// import DatePicker from "react-datepicker";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { useEffect } from "react";
import { ExtensionContext } from "@looker/extension-sdk-react";
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import * as moment from 'moment'

const date_range_type = 'date range';
const date_filter_type = 'date filter';
export const DateRangeSelector = ({
  dateRange,
  selectedFilters,
  setSelectedFilters
}) => {

  const [dateRangeField, setDateRangeField] = useState({})
  const { core40SDK: sdk } = useContext(ExtensionContext);

  useEffect(() => {
    
    let dRange = Object.assign({}, dateRange)
    if (dRange['options']) {      
      setDateRangeField(dRange['options']['field'])
    }
  }, [])

  const onDateSelection = (e, type) => {
    console.log(e)
    let filters = JSON.parse(JSON.stringify(selectedFilters))
    if (type == "start") {
      let splitDate = splitSelectedDateRange();
      splitDate[0] = e.format('YYYY-MM-DD');
      filters[date_range_type][dateRangeField['name']] = splitDate.join(" to ")
      setSelectedFilters(filters);
    }
    if (type == "end") {
      let splitDate = splitSelectedDateRange();
      splitDate[1] = e.format('YYYY-MM-DD');
      filters[date_range_type][dateRangeField['name']] = splitDate.join(" to ")
      setSelectedFilters(filters);
    }
    filters[date_filter_type] = {}
    setSelectedFilters(filters);
  };

  const splitSelectedDateRange = () => {
    if (selectedFilters[date_range_type]) {
      if (selectedFilters[date_range_type][dateRangeField['name']]) {
        return selectedFilters[date_range_type][dateRangeField['name']].split(" to ");
      }
    }
    return ["", ""];
  };

  const minDateFn = () => {
    let _date = moment().subtract(3, 'year')
    console.log("minDate", _date)
    return _date;
  }

  return (
        <Col>
          <div className="d-flex mt-1 ml2">
            <div className="columnStart mr2">
              <label>Start Date</label>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker 
                  minDate={minDateFn()}
                  maxDate={moment()}
                  value={moment(splitSelectedDateRange()[0])}
                  onChange={(e) => onDateSelection(e, "start")}
                />
              </LocalizationProvider>              
              {/* <Form.Control
              min={minDate()}
              max={moment().format('YYYY-MM-DD')}
              type="date"
              value={splitSelectedDateRange()[0]}
              onChange={(e) => onDateSelection(e, "start")}
              /> */}
            </div>
            <div className="columnStart">
              <label>End Date</label>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker 
                  minDate={minDateFn()}
                  maxDate={moment()}
                  value={moment(splitSelectedDateRange()[1])}
                  onChange={(e) => onDateSelection(e, "end")}
                />
              </LocalizationProvider>    
              {/* <Form.Control
              min={minDateFn()}
              max={moment().format('YYYY-MM-DD')}
              type="date"
              value={splitSelectedDateRange()[1]}
              onChange={(e) => onDateSelection(e, "end")}
              /> */}
            </div>
          </div>
        </Col>
  );
};
