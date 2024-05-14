import React, { useContext } from 'react'
import InnerTableTabs from '../InnerTableTabs'
import { Row,Col } from 'react-bootstrap'
import { EmbedSection } from '../EmbedSection/EmbedSection'
import { TransposedTable } from '../LayoutComponents/TransposedTable'
import { MessageOverlay } from '../LayoutComponents/EmbedMessages/MessageOverlay'
import { RebateFilters } from '../LayoutComponents/RebateFilters'

export const RebateEstimator = ({handleTabVisUpdate,visList,setSelectedFields,setSelectedInnerTab,selectedInnerTab,setVisList,handleSingleVisUpdate, formatFilters, updatedFilters, tabFilters,selectedTabFilters,
  setSelectedTabFilters}) => {
    console.log("REBATE FILTERS",tabFilters)
    return(
        <div>
        {Object.values(updatedFilters['account filter']).length > 0?
        <>
            <Row h-25>
              <Col lg={2} className='mt-3'>
                <RebateFilters tabFilters={tabFilters} selectedTabFilters={selectedTabFilters} setSelectedTabFilters={setSelectedTabFilters} handleTabVisUpdate={handleTabVisUpdate}/>
              </Col>
            </Row>
            <Row h-25 className="mb-3" style={{paddingBottom:'40px'}}>
              <Col md={12} lg={8} className="embed-responsive embed-responsive-16by9">
                {visList.filter(({ visId }) => visId === "vis1").length >
                0 ? (
                  <div className='vis-container'>
                        <EmbedSection
                          vis={visList.filter(({ visId }) => visId === "vis2")}
                          visList={visList}
                          setVisList={setVisList}
                          setSelectedFields={setSelectedFields}
                          selectedInnerTab={selectedInnerTab}
                          setSelectedInnerTab={setSelectedInnerTab}
                          handleSingleVisUpdate={handleSingleVisUpdate}
                      />
                  </div>

                ) : (
                  ""
                )}
              </Col>
              <Col md={12} lg={4} className=''>
                <TransposedTable formatFilters={formatFilters} updatedFilters={updatedFilters} vis={visList?.find(({visId}) => visId==="vis1")} />
              </Col>
            </Row>
            <Row className="mt-3 mb-3">
              <Col md={12} className="embed-responsive embed-responsive-16by9 vis-grid">
                {visList.filter(({ visId }) => visId === "vis2").length >
                0 ? (
                  <div className='vis-container'>
                    <EmbedSection
                        vis={visList.filter(({ visId }) => visId === "vis3")}
                        visList={visList}
                        setVisList={setVisList}
                        setSelectedFields={setSelectedFields}
                        selectedInnerTab={selectedInnerTab}
                        setSelectedInnerTab={setSelectedInnerTab}
                        handleSingleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>
                ) : (
                  ""
                )}
              </Col>
            </Row>
        </>
        :<MessageOverlay string={"Please select Account(s) to show data"} />
        }
        </div>
    )
}