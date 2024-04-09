import React, { useContext } from 'react'
import InnerTableTabs from '../InnerTableTabs'
import { Row,Col, Container } from 'react-bootstrap'
import { EmbedContainer } from '../EmbedContainer'
import { EmbedSection } from '../EmbedSection/EmbedSection'

export const DashboardVisualizations = ({visList,setSelectedFields,setSelectedInnerTab,selectedInnerTab,setVisList,handleSingleVisUpdate}) => {
    return(
        <>
        <Container className='grid dashboard-grid-layout' style={{minHeight:'1500px', maxWidth:'95%'}}>
            
            <div className="mb-3 dashboard-grid-left" style={{paddingTop:'10px'}}>
              <div className="embed-responsive embed-responsive-16by9">
                {visList.find(({ visId }) => visId === "vis5")?
                  <div className="vis-container">
                    <EmbedSection
                        vis={visList.filter(({ visId }) => visId === "vis5")}
                        visList={visList}
                        setVisList={setVisList}
                        setSelectedFields={setSelectedFields}
                        selectedInnerTab={selectedInnerTab}
                        setSelectedInnerTab={setSelectedInnerTab}
                        handleSingleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>:''}
                {visList.filter(({ visId }) => visId === "vis6").length > 0 ?
                  <div className="vis-container">
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
                  : ''                  
                }

              </div>
            </div>
            <div className='dashboard-grid-right' style={{paddingTop:'10px'}}>
              <div>
                {visList.find(({ visId }) => visId === "vis1")?
                  <div className="vis-container">
                    <EmbedSection
                        vis={visList.filter(({ visId }) => visId === "vis1")}
                        visList={visList}
                        setVisList={setVisList}
                        setSelectedFields={setSelectedFields}
                        selectedInnerTab={selectedInnerTab}
                        setSelectedInnerTab={setSelectedInnerTab}
                        handleSingleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>:''}
                {visList.find(({ visId }) => visId === "vis2")?
                  <div className="vis-container">
                    <EmbedSection
                        vis={visList.filter(({ visId }) => visId === "vis2")}
                        visList={visList}
                        setVisList={setVisList}
                        setSelectedFields={setSelectedFields}
                        selectedInnerTab={selectedInnerTab}
                        setSelectedInnerTab={setSelectedInnerTab}
                        handleSingleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>:''}
                {visList.find(({ visId }) => visId === "vis3")?
                  <div className="vis-container">
                    <EmbedSection
                        vis={visList.filter(({ visId }) => visId === "vis3")}
                        visList={visList}
                        setVisList={setVisList}
                        setSelectedFields={setSelectedFields}
                        selectedInnerTab={selectedInnerTab}
                        setSelectedInnerTab={setSelectedInnerTab}
                        handleSingleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>:''}
                {visList.find(({ visId }) => visId === "vis4")?
                  <div className="vis-container">
                    <EmbedSection
                        vis={visList.filter(({ visId }) => visId === "vis4")}
                        visList={visList}
                        setVisList={setVisList}
                        setSelectedFields={setSelectedFields}
                        selectedInnerTab={selectedInnerTab}
                        setSelectedInnerTab={setSelectedInnerTab}
                        handleSingleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>:''}
              </div>
            </div>          
        </Container>
        </>
    )
}