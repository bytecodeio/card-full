import React, {useEffect, useRef, useState} from 'react'
import { Row,Col } from 'react-bootstrap'
import { CurrentSelection2 } from '../CurrentSelection2'
import { PropertyContainer } from './components/PropertyContainer';
import * as $ from "jquery";


export const CurrentSelectionRow = ({properties,filters,selectedFilters,setSelectedFilters,updatedFilters,setUpdatedFilters,formatFilters,faClass,layoutProps,propertiesLoading}) => {
  const [toggle, setToggle] = useState(true);
  const [active, setActive] = useState(false);
  const selectionRef = useRef(null)
  const [listLength, setListLength] = useState(0)
  const [selectionHeight, setSelectionHeight] = useState(0)
  const [showToggle, setShowToggle] = useState(false);
  const handleClick = () => {
        setToggle(!toggle);    
        setActive(!active);    
        setFaClass(!faClass);
      };

  useEffect(() => {
    if (layoutProps['current selection']) {
      console.log("height",selectionRef.current.clientHeight)
      setSelectionHeight(selectionRef.current.clientHeight)
      let _updated = document.querySelectorAll('.tab-pane.active .theSelected .theOptions');
      let _selected = document.querySelectorAll('.tab-pane.active.show .theSelected .dateChoice');
      setListLength(_updated.length + _selected.length);
    }
  },[selectionRef?.current?.clientHeight])

                  // //jquery will be removed and changed, leave for now
    
                  // $(document).on("click", function () {
                  //   if ($(".theSelected").height() > 74.8) {
                  //     $(".theSelected")
                  //       .addClass("theEnd")
                  //       .css({ maxHeight: "76px", overflow: "hidden" });
                  //     $(".hideThisEnd, .whiteBar").show();
                  //   } else {
                  //     $(".theSelected")
                  //       .removeClass("theEnd")
                  //       .css({ maxHeight: "unset", overflow: "unset" });
                  //     $(".hideThisEnd, .whiteBar").hide();
                  //   }
                
                  //   $("#numberCounter").html(
                  //     $(".tab-pane.active .theSelected .theOptions").length +
                  //       $(".tab-pane.active.show .theSelected .dateChoice").length
                  //   );
                  // });
                  // $(window).resize(function () {
                  //   $(document).trigger("click");
                  // });

    return (
        <>
            <Row className="fullW d-flex align-items-center">
              <Col md={12} lg={12}>
                <PropertyContainer properties={properties} propertiesLoading={propertiesLoading} />
              </Col>
            </Row>            
            {layoutProps['current selection']?
            <Row className="fullW mt-1 position-relative" ref={selectionRef}>
              <Col xs={12} md={11}>
                <div 
                  className={
                    toggle
                      ? "d-flex justify-content-start align-items-center flex-wrap theSelected slide-up"
                      : "d-flex justify-content-start align-items-center flex-wrap theSelected slide-down"
                  }
                >
                  <p class="mr-3">
                    <b>Current Selections:</b>
                  </p>
                    <CurrentSelection2
                        filters={filters}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                        updatedFilters={updatedFilters}
                        setUpdatedFilters={setUpdatedFilters}
                        formatFilters={formatFilters}
                    />
                    

                </div>
              </Col>
              {selectionHeight >= 76?
                <div className="see-all-toggle" onClick={handleClick}>
                  <i
                    className={
                      faClass ? "fas fa-plus-circle" : "fas fa-minus-circle"
                    }
                  >
                    &nbsp;
                    <span className='see-all-text'>
                      {" "}
                      {active ? "See Less" : "See All"}({listLength}){" "}
                    </span>
                  </i>
                </div>
              :''}

            </Row>
            :''}
        </>
    )
}