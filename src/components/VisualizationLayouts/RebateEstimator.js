import React, { useContext, useState } from 'react'
import InnerTableTabs from '../InnerTableTabs'
import { Row,Col } from 'react-bootstrap'
import { EmbedSection } from '../EmbedSection/EmbedSection'
import { TransposedTable } from '../LayoutComponents/TransposedTable'
import { MessageOverlay } from '../LayoutComponents/EmbedMessages/MessageOverlay'
import { RebateFilters } from '../LayoutComponents/RebateFilters'

export const RebateEstimator = ({handleTabVisUpdate,visList,setSelectedFields,setSelectedInnerTab,selectedInnerTab,setVisList,handleSingleVisUpdate, formatFilters, updatedFilters, tabFilters,selectedTabFilters,
  setSelectedTabFilters}) => {
    console.log("REBATE FILTERS",tabFilters)
    const [reloadData, setReloadData] = useState(true)
    const [data, setData] = useState()
    const [tableValues, setTableValues] = useState([])
    return(
        <div>
        {updatedFilters['account filter'] &&
          Object.values(updatedFilters['account filter']).length > 0?
         <>
            <Row h-25>
              <Col lg={2} className='mt-3'>
                <RebateFilters data={data} tableValues={tableValues} formatFilters={formatFilters} setReloadData={setReloadData} tabFilters={tabFilters} selectedTabFilters={selectedTabFilters} setSelectedTabFilters={setSelectedTabFilters} handleTabVisUpdate={handleTabVisUpdate} updatedFilters={updatedFilters}/>
              </Col>
            </Row>
            <Row h-25 className="mb-3" style={{paddingBottom:'40px'}}>
              <Col md={12} lg={8} className="embed-responsive embed-responsive-16by9">
                {visList.filter(({ visId }) => visId === "vis2").length >
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
                <TransposedTable setData={setData} setTableValues={setTableValues} tableValues={tableValues} reloadData={reloadData} setReloadData={setReloadData} formatFilters={formatFilters} updatedFilters={updatedFilters} vis={visList?.find(({visId}) => visId==="vis1")} selectedTabFilters={selectedTabFilters} />
              </Col>
            </Row>
            <Row className="mt-3 mb-3">
              <Col md={12} lg={6} className="embed-responsive embed-responsive-16by9 vis-grid">
                {visList.filter(({ visId }) => visId === "vis3").length >
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
              <Col md={12} lg={6} className="embed-responsive embed-responsive-16by9 vis-grid">
                {visList.filter(({ visId }) => visId === "vis4").length >
                0 ? (
                  <div className='vis-container'>
                    <EmbedSection
                        vis={visList.filter(({ visId }) => visId === "vis4")}
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
            <Row className="mt-3 mb-3">
              <Col md={12} lg={6} className="embed-responsive embed-responsive-16by9 vis-grid">
                {visList.filter(({ visId }) => visId === "vis5").length >
                0 ? (
                  <div className='vis-container'>
                    <EmbedSection
                        vis={visList.filter(({ visId }) => visId === "vis5")}
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
              <Col md={12} lg={6} className="embed-responsive embed-responsive-16by9 vis-grid">
                {visList.filter(({ visId }) => visId === "vis6").length >
                0 ? (
                  <div className='vis-container'>
                    <EmbedSection
                        vis={visList.filter(({ visId }) => visId === "vis6")}
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
            <Row className="mt-3 mb-3">
              <Col md={12} lg={12} className="embed-responsive embed-responsive-16by9 vis-grid">
                {visList.filter(({ visId }) => visId === "vis7").length >
                0 ? (
                  <div className='vis-container'>
                    <EmbedSection
                        vis={visList.filter(({ visId }) => visId === "vis7")}
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