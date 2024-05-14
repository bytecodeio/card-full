import React from 'react'

export const MessageOverlay = ({string}) => {
    return(
        <div className='message-overlay'>
            <h4>{string}</h4>
        </div>
    )
}