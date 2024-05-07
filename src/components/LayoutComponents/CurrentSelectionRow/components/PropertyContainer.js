import React, {useEffect} from 'react'
import { LoadingComponent } from '../../../LoadingComponent'
import { waveform } from 'ldrs'
waveform.register()

export const PropertyContainer = ({properties,propertiesLoading}) => {

    useEffect(() => {
        console.log("property check", properties)
    },[properties])
    const formatNumber = (value) => {
        let number = value.toLocaleString()
        return number
    }
    return(
        <>
            {properties?.find(({ group }) => group === "property") && Object.values(properties?.find(({group}) => group === "property")?.value)?.length > 0 ? (
                
                <p>
                    <b>
                        {
                        properties?.find(({ group }) => group === "property")
                            ?.text
                        }
                    </b>{" "}
                    <span className="highlight large">
                        {propertiesLoading?
                            <l-waveform size="20" stroke="2" speed="1" color="black" />                    
                        :                        
                            formatNumber(Object.values(
                                properties?.find(({ group }) => group === "property")
                                    ?.value)
                                )}
                    </span>
                </p>
            ) : (
                ""
            )}
        </>
    )
}