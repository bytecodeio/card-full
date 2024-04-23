import React from 'react'
import { EmbedContainer } from '../EmbedContainer'
import InnerTableTabs from '../InnerTableTabs'
export const EmbedSection = ({vis,
    visList,
    setVisList,
    setSelectedFields,
    selectedInnerTab,
    setSelectedInnerTab,
    handleSingleVisUpdate}) => {
        console.log("vis",vis)
    return(
        <>
            {vis.length > 1?            
            <InnerTableTabs 
                tabs={vis}
                setVisList={setVisList}
                visList={visList}
                setSelectedFields={setSelectedFields}
                setSelectedInnerTab={setSelectedInnerTab}
                selectedInnerTab={selectedInnerTab}
                handleSingleVisUpdate={handleSingleVisUpdate}
            />
            :
            <div style={{paddingTop:'7px', boxShadow:'0px 11px 11px 1px rgba(0, 0, 0, 0.1)'}}>
                <EmbedContainer 
                    vis={vis[0]} 
                    visList={visList} 
                    updateVisList={setVisList} 
                    handleVisUpdate={handleSingleVisUpdate}
                    type={'single'}
                />
            </div>

            }
        </>
    )
}