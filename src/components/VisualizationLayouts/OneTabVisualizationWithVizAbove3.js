import React, { useContext } from 'react'
import InnerTableTabs from '../InnerTableTabs'
import { Row,Col } from 'react-bootstrap'
import { EmbedSection } from '../EmbedSection/EmbedSection'

export const OneTabVisualizationWithVizAbove3 = ({visList,setSelectedFields,setSelectedInnerTab,selectedInnerTab,setVisList,handleSingleVisUpdate}) => {
    return(
        <>
            <Row h-25 className="mb-3" style={{paddingBottom:'40px'}}>
              <Col md={12} lg={9} className="embed-responsive embed-responsive-16by9">
                {visList.filter(({ visId }) => visId === "vis1").length >
                0 ? (
                  <div className='vis-container'>
                        <EmbedSection
                          vis={visList.filter(({ visId }) => visId === "vis1")}
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
            {visList.filter(({ visId }) => visId === "vis2").length >
              0 ? (
            <Row className="mt-3 mb-3">
              <Col md={12} className="embed-responsive embed-responsive-16by9 vis-grid">

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
                 
              </Col>
            </Row>): (
                  ""
                )}                
            {visList.filter(({ visId }) => visId === "tabbedVis1").length >
                0 ? (
            <Row className="mt-3 mb-3">
              <Col md={12} className="embed-responsive embed-responsive-16by9 vis-grid">

                  <div className='vis-container'>
                    <EmbedSection
                        vis={visList.filter(({ visId }) => visId === "tabbedVis1")}
                        visList={visList}
                        setVisList={setVisList}
                        setSelectedFields={setSelectedFields}
                        selectedInnerTab={selectedInnerTab}
                        setSelectedInnerTab={setSelectedInnerTab}
                        handleSingleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>

              </Col>
            </Row>                
            ) : (
                  ""
                )}
        </>
    )
}