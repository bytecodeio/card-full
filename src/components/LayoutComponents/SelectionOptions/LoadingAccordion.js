import React from 'react'
import { Col } from 'react-bootstrap'
import { LoadingComponent } from '../../LoadingComponent'
export const LoadingAccordion = ({title}) => {
    return(
        <>
        <Col xs={12} md={12}>
            <div className='accordion-item' style={{'position':'relative'}}>
                <div className='loading-wrapper'>
                    <LoadingComponent sz={'sm'} style={{'height':'100%'}} color='lightgrey'/>
                </div>
                <h2 className='accordion-header accordion-loading'>
                    <button type="button" aria-expanded="false" class="accordion-button collapsed">{title}</button>
                </h2>
            </div>
        </Col>
        </>
    )

}