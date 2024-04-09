import { waveform } from "ldrs"
import React from "react"; 
waveform.register();
export const LoadingComponent = ({sz,style,color="black"}) => {
    return (
    <>
        {sz == 'sm'?
            <div className='loading-container' style={style}>
                <l-waveform size="30" stroke="3.5" speed="1" color={color} />
            </div>    
        :
            <div className="loading-overlay" style={style}>
                <div className='loading-container'>
                    <l-waveform size="50" stroke="3.5" speed="1" color={color} />
                </div>          
            </div>
        }
    </>

    )

}