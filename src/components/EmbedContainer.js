import React, { Fragment, useState, useEffect } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import EmbedTable from "./EmbedTable";
import {EmbedActionBar} from './EmbedActionBar'

export const EmbedContainer = ({vis, visList, updateVisList, handleVisUpdate, type}) => {
    const [openPopover, setOpenPopover] = useState(false)
    const [showMenu3, setShowMenu3] = useState(false)
    const [active, setActive] = useState(false);
    const [faClass, setFaClass] = useState(true);
    const [toggle, setToggle] = useState(true);

    console.log("vis list", vis);

    const handleToggle = (el, o) => {
        let _visList = [...visList];
        let currentVis = _visList.find(({index}) => index === vis.index);
        currentVis['localSelectedFilters'][o] = el.target.value;
        console.log(currentVis)
        console.log(_visList)
        updateVisList(_visList)
        handleVisUpdate(currentVis.index);
    }

    const handlePopover = () => {
        setOpenPopover(!openPopover)
    }

    const slideIt3 = () =>{
        setShowMenu3(!showMenu3)
      }
      const handleClick = () => {
          setToggle(!toggle);
    
          setActive(!active);
    
          setFaClass(!faClass);
    };

    return(
        <>
        <div id="embedWrapper" style={{position:'relative'}} className={showMenu3 ? "whole" : ""}>
            <div className="embed-action-section">                    
                <EmbedActionBar vizType={type} slideIt3={slideIt3} showMenu3={showMenu3} active={active} handleClick={handleClick} faClass={faClass} queryId={vis['query']} title={vis.title} query={vis}/>
            </div>
            {vis['tileFilterOptions'].length > 0?
            <Row className="dimension-selector">
                <Col md={12} lg={5}>            
                    {vis['tileFilterOptions'].map(o => {
                        return (
                            <Form.Select onChange={(el) => handleToggle(el,o['name'])} value={vis['localSelectedFilters'][o['name']]}>
                                {o.options.map(v => {
                                    return (
                                    <option key={v.value} value={v.value}> {v.label}</option>
                                    )
                                })}
                            </Form.Select>
                        )
                    })}
                </Col>
            </Row>                
            :''
            }
            {/* <div class="embed-hide-run"></div> */}
            <EmbedTable queryId={vis.query} vis={vis} />
        </div>
        </>
    )
}
