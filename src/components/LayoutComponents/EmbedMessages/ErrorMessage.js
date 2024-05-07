import React from 'react'

export const ErrorMessage = () => {
    return (
        <div className='embed-message-container' style={{position:'absolute', height:'100%', width:'100%', backgroundColor:'white', paddingTop:'20px', zIndex:1}}>
            <h5>Error loading report. Please refresh the page or try again later. Please call into the Service Center for assistance if problems persist: 1-800-ECOMHLP(326-6457).</h5>
        </div> 
    )

}