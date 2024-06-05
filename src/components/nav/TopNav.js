import React,{useContext} from "react";

import { Accordion, Button } from "react-bootstrap";
import { getApplicationTabs, getApplications } from "../../utils/writebackService";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { groupBy } from "../../utils/globalFunctions";
import { useState } from "react";
import { Lock } from "@styled-icons/material-outlined";

function TopNav({navList}) {
  const extensionContext = useContext(ExtensionContext);
  const sdk = extensionContext.core40SDK;
  const [show5, setShow5] = React.useState();
  const [filteredNav, setFilteredNav] = useState([])

  //const [navList, setNavList] = useState([])

  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
     const initialize = async () => {
      let _allowedReports = await getAllowedReports()
      let _context = [...navList];
      console.log("NavList", _context)     
      console.log("allowed reports", _allowedReports)
      if (_context?.length > 0) {
          if (_context[0].hasOwnProperty('name_attribute')) {              
              _context = _context.map((row) => {
                    console.log('ROW', row)
                      row.unlocked =_allowedReports.some(report => report.includes(row.name_attribute))
                      return row                    
                  }
              )
          } 
          console.log("Navlist", _context)
          setFilteredNav(_context)    
      } 
    }   
     initialize()
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };

  }, [navList]);

  const getAllowedReports = async () => {
    let _allowedReports = await extensionContext.extensionSDK.userAttributeGetItem("allowed_reports")
    if (_allowedReports) {
        let _array = _allowedReports.replace(/'/g, "").split(",");
        console.log("allowed_reports array", _array)
        if (!_array.includes('PurchasesReview')) {
            _array.push('PurchasesReview')
        }
        return _array;
    }
    return ['PurchasesReview']
}

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShow5(false);
    }
  };

  const handleClick = (app, tab) => {
    let host = extensionContext.extensionSDK.lookerHostData;
    let project = extensionContext.extensionSDK.lookerHostData.extensionId
    let type = host.hostType == "spartan"? "spartan":"extensions"
    let url = `${host.hostUrl}/embed/${type}/${project.split("::")[0]}::${app['route']}/${tab['route']}`
    
    extensionContext.extensionSDK.openBrowserWindow(url)
  }

  return (
    <div>
      <div id="slideOut5" className={show5 ? "show" : ""} ref={wrapperRef}>
        <div className="back">
          <div
            id="one5"
            className=""
            role="button"
            tabIndex="0"
            onClick={() => setShow5(true)}
          >
            <p>
              <i aria-hidden="true" className="far fa-arrow-left"></i> View All
              Reports
            </p>
          </div>
        </div>

        <div className="modal-content mt-1">
          <div className="modal-header">
            <p className="strong">All Reports</p>
            <div className="closeThisPlease" id="close1">
              <Button
                role="button"
                className="close"
                data-dismiss="modal"
                id="closeThisPlease1"
                onClick={() => setShow5(false)}
              >
                <i className="fal fa-angle-double-left"></i>
              </Button>
            </div>
          </div>
          <div className="modal-body">
            <Accordion defaultActiveKey={0} className="square">
            {filteredNav?.map(n => (
              <>
                {n.unlocked?
                <Accordion.Item eventKey={n['sort_order']}>
                  <Accordion.Header>{n['name']}</Accordion.Header>
                  <Accordion.Body>
                    {n['tabs']?.map(tab => (
                      <a className="blue" onClick={() => handleClick(n,tab)}>{tab['title']}</a>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>              
                :
                <div className="accordion-item">
                  <h2 className="accordion-header d-flex">
                    <button className={`accordion-button collapsed locked`}>{n['name']}</button>
                    <Lock id="lock"/>
                  </h2>
                </div>
                  
                }
              
              </>

            ))}
            </Accordion>
              {/* <Accordion.Item eventKey="1">
                <Accordion.Header>Functional Build</Accordion.Header>
                <Accordion.Body>
                  <a className="blue">Tab 1</a>
                  <a className="blue">Tab 2</a>
                  <a className="blue">Tab 3</a>
                  <a className="blue">Tab 4</a>
                </Accordion.Body>
              </Accordion.Item> */}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
