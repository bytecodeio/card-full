import React, { useContext } from 'react'
import InnerTableTabs from '../InnerTableTabs'
import { Row,Col } from 'react-bootstrap'
import { EmbedSection } from '../EmbedSection/EmbedSection'

export const OneTabVisualization = ({visList,setSelectedFields,setSelectedInnerTab,selectedInnerTab,setVisList,handleSingleVisUpdate}) => {
    return(
        <>
            <Row className="mt-3 mb-3">
              <Col md={12} className="embed-responsive embed-responsive-16by9 vis-grid">
                {visList.filter(({ visId }) => visId === "tabbedVis1").length >
                0 ? (
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

                //   <InnerTableTabs
                //     tabs={visList.filter(({ visId }) => visId === "tabbedVis1")}
                //     setSelectedFields={setSelectedFields}
                //     currentInnerTab={currentInnerTab}
                //     setCurrentInnerTab={setCurrentInnerTab}
                //     setVisList={setVisList}
                //     visList={visList}
                //     handleSingleVisUpdate={handleSingleVisUpdate}
                //   />
                ) : (
                  ""
                )}
              </Col>
            </Row>
        </>
    )
}