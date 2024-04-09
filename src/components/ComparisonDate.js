import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button, Modal } from 'react-bootstrap'
import moment from 'moment'
import { forEach } from 'lodash'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

export const ComparisonDate = ({tabFilters,selectedTabFilters,setSelectedTabFilters, selectedFilters, filters, handleTabVisUpdate}) => {
    const [reviewField, setReviewField] = useState({})
    const [compareField, setCompareField] = useState({})
    const [open, setOpen] = useState(false)

    useEffect(() => {
        let _review = tabFilters.find(({type}) => type === "comparison filter review")
        setReviewField(_review)
        let _compare = tabFilters.find(({type}) => type === "comparison filter compare")
        setCompareField(_compare)
    },[])

    const handleOpenModal = () => {
        setOpen(!open)
    }

    const updateDates = (_review, _compare) => {
        if (selectedFilters) {
            let _filters = [...filters]
            let _selectedTabFilters = {...selectedTabFilters}
            let dateRange = _filters?.find(({type}) => type === 'date range')
            let currentDateRange = selectedFilters['date range'][dateRange?.options.field.name]                
            _selectedTabFilters[_review['fields']['name']] = currentDateRange;
            let _parseDate = currentDateRange.split(" to ");
            let _compareDate = []
            for(const date of _parseDate) {
                _compareDate.push(moment(date).add('months', 1).format('YYYY-MM-DD'))
            }
            _selectedTabFilters[_compare['fields']['name']] = _compareDate.join(" to ")
            setSelectedTabFilters(_selectedTabFilters)
        }
    }

    useEffect(() => {
        if (selectedFilters && Object.keys(reviewField).length > 0 && Object.keys(compareField).length > 0) {
           updateDates(reviewField,compareField) 
        }        
    },[selectedFilters['date range']])

    const showLabel = (selectedTabFilters) => {
        if (selectedTabFilters) {
            let values = Object.values(selectedTabFilters).map((t,i) => {
                if (i==0) {
                    t = `Review Period ${t.replaceAll("-","/")}`
                } else {
                    t = `Compare Period ${t.replaceAll("-","/")}`
                }
                return t
            })
            
            return values.join(" - ")
        }
        return ''
    }

    const CompareSelectedDates = ({selectedTabFilters}) => {
        return(
            Object.keys(selectedTabFilters).length>0?
            <div className='comparison-date-button'>
                <p>Date comparison: </p>
                <div className='theOptions red' style={{color:'white'}}>
                    {showLabel(selectedTabFilters)}
                </div>
            </div>
            :''
        )
    }

    return (
        <>
        <div className='comparison-date-button'>
           <Button className='btn-clear' onClick={handleOpenModal}>Select date ranges to compare</Button> 
        </div>        
        <Modal size="sm" centered show={open} onHide={handleOpenModal}>
            <Modal.Header closeButton>
                Select comparison date range
            </Modal.Header>
            <Modal.Body>
                <ComparisonModal tabFilters={tabFilters} selectedTabFilters={selectedTabFilters} setSelectedTabFilters={setSelectedTabFilters} selectedFilters={selectedFilters} filters={filters} compareField={compareField} reviewField={reviewField} updateDates={updateDates} />
            </Modal.Body>
            <Modal.Footer>
                <Button>Submit</Button>
            </Modal.Footer>
        </Modal>
        <CompareSelectedDates selectedTabFilters={selectedTabFilters}/>
        <div>
            <Button
                onClick={handleTabVisUpdate}
                className="btn">Update Dates
            </Button>
        </div>
    </>
    )
}

const ComparisonModal = ({tabFilters,selectedTabFilters,setSelectedTabFilters, selectedFilters, filters, compareField, reviewField, updateDates}) => {

    useEffect(() => {
        if (Object.keys(selectedTabFilters).length == 0) {
             let _review = {...reviewField}
             let _compare = {...compareField}
             updateDates(_review,_compare);
            // if (selectedFilters) {
            //     let _filters = [...filters]
            //     let _selectedTabFilters = {...selectedTabFilters}
            //     let dateRange = _filters?.find(({type}) => type === 'date range')
            //     let currentDateRange = selectedFilters['date range'][dateRange?.options.field.name]                
            //     _selectedTabFilters[_review['fields']['name']] = currentDateRange;
            //     let _parseDate = currentDateRange.split(" to ");
            //     let _compareDate = []
            //     for(const date of _parseDate) {
            //         _compareDate.push(moment(date).add('months', 1).format('YYYY-MM-DD'))
            //     }
            //     _selectedTabFilters[_compare['fields']['name']] = _compareDate.join(" to ")
            //     setSelectedTabFilters(_selectedTabFilters)
            // }
        }
    },[])

    useEffect(() => {
        //updateDateRange()
        
    },[selectedFilters['date range']])

    const updateDateRange = () => {
        let _review = tabFilters.find(({type}) => type === "comparison filter review")
        setReviewField(_review)
        let _compare = tabFilters.find(({type}) => type === "comparison filter compare")
        setCompareField(_compare)
        if (selectedFilters['date range']) {
            let _filters = [...filters]
            let _selectedTabFilters = {...selectedTabFilters}
            let dateRange = _filters?.find(({type}) => type === 'date range')
            
            _selectedTabFilters[_review['fields']['name']] = selectedFilters['date range'][dateRange['options']['field']['name']]
            
            let _parseDate = dateRange?.options.values.split(" to ");
            let _compareDate = []
            for(const date of _parseDate) {
                _compareDate.push(moment(date).add('months', 1).format('YYYY-MM-DD'))
            }
            _selectedTabFilters[_compare['fields']['name']] = _compareDate.join(" to ")
            setSelectedTabFilters(_selectedTabFilters)
        }
    }

    const splitSelectedDateRange = (type) => {
        let _field = type === "review"? reviewField:compareField
        if (Object.keys(_field).length > 0 && Object.keys(selectedTabFilters).length > 0) {
          return selectedTabFilters[_field['fields']['name']]?.split(" to ");
        }
        return ["", ""];
      };

      const onDateSelection = (e, type, fieldType) => {
        let filters = {...selectedTabFilters}
        let _field = fieldType === 'review'?reviewField:compareField
        if (type == "start") {
          let splitDate = splitSelectedDateRange(fieldType);
          splitDate[0] = e.target.value;
          filters[_field['fields']['name']] = splitDate.join(" to ")
          setSelectedTabFilters(filters);
        }
        if (type == "end") {
          let splitDate = splitSelectedDateRange(fieldType);
          splitDate[1] = e.target.value;
          filters[_field['fields']['name']] = splitDate.join(" to ")
          setSelectedTabFilters(filters);
        }
        //filters[date_filter_type] = {}
        //setSelectedFilters(filters);
      };
    
      return (
        <>
        <Row>
        <h6>Review Date</h6>
        <Col md={12} lg={4} className="position-relative">

        <div className="d-flex mt-1 ml2">

          <div className="columnStart mr2">
            <label>Start Date</label>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker 
                  value={moment(splitSelectedDateRange('review')[0])}
                  onChange={(e) => onDateSelection(e, "start",'review')}
                />
              </LocalizationProvider>   
            {/* <Form.Control
            type="date"
            value={splitSelectedDateRange('review')[0]}
            onChange={(e) => onDateSelection(e, "start", 'review')}

            /> */}

          </div>
          <div className="columnStart">
            <label>End Date</label>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker 
                  value={moment(splitSelectedDateRange('review')[1])}
                  onChange={(e) => onDateSelection(e, "end", 'review')}
                />
              </LocalizationProvider>   
            {/* <Form.Control
            type="date"
            value={splitSelectedDateRange('review')[1]}
            onChange={(e) => onDateSelection(e, "end", 'review')}
            /> */}

          </div>


        </div>

        <div className="endAbsolute">


 
      </div>

      </Col>
    </Row> 
    <Row>
    <h6>Comparison Date</h6>
    <Col md={12} lg={4} className="position-relative">

    <div className="d-flex mt-1 ml2">

        <div className="columnStart mr2">
        <label>Start Date</label>
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker 
                value={moment(splitSelectedDateRange('compare')[0])}
                onChange={(e) => onDateSelection(e, "start", 'compare')}
            />
        </LocalizationProvider>   
        {/* <Form.Control
        type="date"
        value={splitSelectedDateRange('compare')[0]}
        onChange={(e) => onDateSelection(e, "start",'compare')}

        /> */}

        </div>
        <div className="columnStart">
        <label>End Date</label>
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker 
                value={moment(splitSelectedDateRange('compare')[1])}
                onChange={(e) => onDateSelection(e, "end", 'compare')}
            />
        </LocalizationProvider>   
        {/* <Form.Control
        type="date"
        value={splitSelectedDateRange('compare')[1]}
        onChange={(e) => onDateSelection(e, "end",'compare')}
        /> */}

        </div>


    </div>

    <div className="endAbsolute">



    </div>

    </Col>
    </Row>
    </> 
        //<div>Test</div>
    )
}