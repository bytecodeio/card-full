import React from 'react'

export const NoRowsMessage = () => {
    return(
        <div className='embed-message-container' style={{position:'absolute', height:'100%', width:'100%', backgroundColor:'white', paddingTop:'20px'}}>
            <h4>No data available for current selections. Please update and save new selections to populate data.</h4>
        </div>  
    )

}