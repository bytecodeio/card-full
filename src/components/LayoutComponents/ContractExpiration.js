import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import React,{ useState, useRef, useEffect }  from 'react'
import { Col } from 'react-bootstrap';
import {DatePicker, LocalizationProvider, MobileDatePicker} from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import * as moment from 'moment'

let contract_type='contract expiration filter'
export const ContractExpiration = ({filterOption, selectedFilters, setSelectedFilters}) => {
    const [isChecked, setIsChecked] = useState(false);
    const [dateRange, setDateRange] = useState(`${moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')} to ${moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')}`);
    const [field, setField] = useState()

    useEffect(() => {
        let _rawDate = filterOption['fields'][0]
        console.log("expiration date range", _rawDate)
        setField(_rawDate)        
    },[])

    const handleCheckboxSelect = () => {
        console.log("Checked date range", dateRange);
        let filters = {...selectedFilters}
        if (!isChecked) {
            let _dateRange = dateRange
            filters[contract_type] = {[field.name]:_dateRange};
            console.log("Checked date range",filters)
            setSelectedFilters(filters)
        } else {
            filters[contract_type] = {};
            setSelectedFilters(filters)
        }
        setIsChecked(!isChecked);
    }

    const onDateSelection = (e, type) => {
        console.log("filters",e)
        let filters = JSON.parse(JSON.stringify(selectedFilters))
        console.log("filters",filters)
        if (type == "start") {
          let splitDate = splitSelectedDateRange();
          splitDate[0] = e.format('YYYY-MM-DD');
          setDateRange(splitDate.join(" to "))
          if (isChecked) {
            filters[contract_type] = {}
            filters[contract_type] = {[field.name]:splitDate.join(" to ")};
            setSelectedFilters(filters);
          }
          //
        }
        if (type == "end") {
          let splitDate = splitSelectedDateRange();
          splitDate[1] = e.format('YYYY-MM-DD');
          setDateRange(splitDate.join(" to "))
          if (isChecked) {
            filters[contract_type] = {}
            filters[contract_type] = {[field.name]:splitDate.join(" to ")};
            setSelectedFilters(filters);
          }
          //setSelectedFilters(filters);
        }
      };
    
      const splitSelectedDateRange = () => {
        // if (selectedFilters[type]) {
        //   if (selectedFilters[type][type['name']]) {
        //     return selectedFilters[type][type['name']].split(" to ");
        //   }
        // }
        // return ["", ""];
        return dateRange.split(" to ")
      };
    
      const minDateFn = () => {
        let _date = moment().subtract(3, 'year')
        console.log("minDate", _date)
        return _date;
      }

    return (
        <div>
        <Col>
          <div className="mt-1 ml2 date-selection-options-container">
            <div className="columnStart mr2">
              <label>Start Date</label>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <MobileDatePicker
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
                <MobileDatePicker 
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
            <FormControlLabel control={<Checkbox />} value={isChecked} label={"Use Contract Expiration Date Range"} onClick={handleCheckboxSelect}/>
        </div>
    )
}