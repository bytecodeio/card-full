import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import moment from 'moment'
import { forEach } from 'lodash'

export const ComparisonDate = ({tabFilters,selectedTabFilters,setSelectedTabFilters, selectedFilters, filters}) => {
    const [reviewField, setReviewField] = useState({})
    const [compareField, setCompareField] = useState({})

    useEffect(() => {
        let _review = tabFilters.find(({type}) => type === "comparison filter review")
        setReviewField(_review)
        let _compare = tabFilters.find(({type}) => type === "comparison filter compare")
        setCompareField(_compare)
        console.log("selectedTab", tabFilters)
        if (selectedFilters) {
            let _filters = [...filters]
            let _selectedTabFilters = {...selectedTabFilters}
            let dateRange = _filters?.find(({type}) => type === 'date range')
            _selectedTabFilters[_review['fields']['name']] = dateRange?.options.values;
            let _parseDate = dateRange?.options.values.split(" to ");
            let _compareDate = []
            for(const date of _parseDate) {
                _compareDate.push(moment(date).add('months', 1).format('YYYY-MM-DD'))
            }
            _selectedTabFilters[_compare['fields']['name']] = _compareDate.join(" to ")
            setSelectedTabFilters(_selectedTabFilters)
        }
    },[])

    useEffect(() => {
        //updateDateRange()
        console.log("selectedTabFilters", selectedTabFilters)
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
            console.log("date range", dateRange)
            _selectedTabFilters[_review['fields']['name']] = selectedFilters['date range'][dateRange['options']['field']['name']]
            console.log("date range",_selectedTabFilters)
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
        if (Object.keys(_field).length > 0) {
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
            <Form.Control
            type="date"
            value={splitSelectedDateRange('review')[0]}
            onChange={(e) => onDateSelection(e, "start", 'review')}

            />

          </div>
          <div className="columnStart">
            <label>End Date</label>
            <Form.Control
            type="date"
            value={splitSelectedDateRange('review')[1]}
            onChange={(e) => onDateSelection(e, "end", 'review')}
            />

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
        <Form.Control
        type="date"
        value={splitSelectedDateRange('compare')[0]}
        onChange={(e) => onDateSelection(e, "start",'compare')}

        />

        </div>
        <div className="columnStart">
        <label>End Date</label>
        <Form.Control
        type="date"
        value={splitSelectedDateRange('compare')[1]}
        onChange={(e) => onDateSelection(e, "end",'compare')}
        />

        </div>


    </div>

    <div className="endAbsolute">



    </div>

    </Col>
    </Row>        
    <Button
        //onClick={handleTabVisUpdate}
        className="btn">Update Dates
    </Button>
    </>
    )
}