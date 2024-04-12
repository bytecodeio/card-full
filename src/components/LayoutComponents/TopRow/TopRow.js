import React from 'react'
import { DateFilterSelector } from './components/DateFilterSelector'
import { DateRangeSelector } from './components/DateRangeSelector';
import moment from 'moment';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ComparisonDate } from '../../ComparisonDate';


const date_range_type = 'date range';
const date_filter_type = 'date filter';
export const TopRow = ({
    dateRange,
    dateFilter,
    handleTabVisUpdate,
    selectedFilters,
    setSelectedFilters,
    description,
    selectedTabFilters,
    setSelectedTabFilters,
    layoutProps,
    filters,
    tabFilters
}) => {

    
    let dateFilterOptions = [
        {
          'title':'Previous Month',
          'date': [
            moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
          ]
        },
        {
          'title':'Previous Quarter',
          'date': [
            moment().subtract(1, 'quarter').startOf('quarter').format('YYYY-MM-DD'),
            moment().subtract(1, 'quarter').endOf('quarter').format('YYYY-MM-DD')
          ]
        },
        {
          'title':'Previous Year',
          'date': [
            moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
            moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD')
          ]
        },
        {
          'title':'View All Data (36 Months)',
          'date': [
            moment().subtract(3, 'year').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ]
        },
        {
          'title':'Month to Date',
          'date': [
            moment().startOf('month').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ]
        },
        {
          'title':'Quarter to Date',
          'date': [
            moment().startOf('quarter').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ]
        },
        {
          'title':'Year to Date',
          'date': [
            moment().startOf('year').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ]
        }
      ]

    const updateDateRange = async (dateRange, dateFilters, selectedFilters) => {
        let _dateRange = { ...dateRange };
        let _filters = JSON.parse(JSON.stringify(selectedFilters))
        if (_filters['date filter']) {
          let dateFilterField = dateFilters.options.find(
            ({ name }) => name == Object.keys(_filters['date filter'])[0]
          );
          let newRange = dateFilterOptions.find(({title}) => dateFilterField['label_short'].includes(title))
          if (newRange) {
            _filters[date_range_type][_dateRange['options']['field']["name"]] = newRange.date.join(' to ')
            setSelectedFilters(_filters)
          }
        }
      }

    return (
        <Container fluid className="padding-0">
            <Row className="fullW mb-1">
              {layoutProps['description']?
                <Col md={12} lg={5}>
                    <p className="mt-0 mb-2 mediumFont app-description">
                        {description}
                    </p>
                </Col>:''}
                {layoutProps['date filter']?
                  <Col md={6} lg={4}>                        
                      <DateFilterSelector dateFilter={dateFilter} selectedFilters={selectedFilters} dateRange={dateRange} updateDateRange={updateDateRange} type={date_filter_type} setSelectedFilters={setSelectedFilters}/>
                  </Col>
                :''}    

                {layoutProps['date range'] && selectedFilters['date range']?
                  <Col md={6} lg={3} className="position-relative">
                  {tabFilters?.find(({type}) => type ==="comparison filter compare") && tabFilters?.find(({type}) => type ==="comparison filter review")?
                    <ComparisonDate selectedFilters={selectedFilters} selectedTabFilters={selectedTabFilters} setSelectedTabFilters={setSelectedTabFilters} tabFilters={tabFilters} filters={filters} handleTabVisUpdate={handleTabVisUpdate}/>
                  :
                  <>                
                    <DateRangeSelector  dateRange={dateRange} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}/>
                        <div className="endAbsolute">
                        <Button
                            onClick={() => handleTabVisUpdate({},selectedFilters,'date')}
                            className="btn">Update Dates
                        </Button>
                    </div>
                  </>
                  }                
                </Col>
                :''}
            </Row>
        </Container>
    )
}