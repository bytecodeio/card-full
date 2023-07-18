import React, { useState, useRef, useEffect } from "react";


import { Accordion, AccordionButton, AccordionCollapse, AccordionContext, Alert, Anchor, Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, ButtonToolbar, Card, CardGroup, CardImg, Carousel, CarouselItem, CloseButton, Col, Collapse, Container, Dropdown, DropdownButton, Fade, Figure, FloatingLabel, Form, FormCheck, FormControl, FormFloating, FormGroup, FormLabel, FormSelect, FormText, Image, InputGroup, ListGroup, ListGroupItem, Modal, ModalBody, ModalDialog, ModalFooter, ModalHeader, ModalTitle, Nav, NavDropdown, NavItem, NavLink, Navbar, NavbarBrand, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Overlay, OverlayTrigger, PageItem, Pagination, Placeholder, PlaceholderButton, Popover, PopoverBody, PopoverHeader, ProgressBar, Ratio, Row, SSRProvider, Spinner, SplitButton, Stack, Tab, TabContainer, TabContent, TabPane, Table, Tabs, ThemeProvider, Toast, ToastBody, ToastContainer, ToastHeader, ToggleButton, ToggleButtonGroup, Tooltip} from 'react-bootstrap';




function TopNav(props) {

  const [show5, setShow5] = React.useState();

  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);

    };
  }, []);

  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShow5(false);

    }
  };

  return (

  <div>



    <div id="slideOut5" className={show5 ? "show" : ""} ref={wrapperRef}>
      <div className="back">

        <div id="one5" className="" role="button" tabindex="0" onClick={() => setShow5(true)}>

          <p class="blue"><i aria-hidden="true" class="far fa-arrow-left"></i> View All Reports</p>

        </div>

      </div>

      <div className="modal-content mt-1">
        <div className="modal-header">
          <p className="strong">All Reports</p>
          <div className="closeThisPlease" id="close1">

            <Button role="button" className="close" data-dismiss="modal" id="closeThisPlease1" onClick={() => setShow5(false)}>
              <i class="fal fa-angle-double-left"></i>
            </Button>
          </div>

        </div>
        <div className="modal-body">

          <Accordion defaultActiveKey={0} className="square">

            <Accordion.Item eventKey="1">
              <Accordion.Header>Functional Build</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>


            <Accordion.Item eventKey="2">
              <Accordion.Header>Department Billing</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>CICD</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>Executive Dashboard</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>


            <Accordion.Item eventKey="5">
              <Accordion.Header>Source Opportunities</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>Contract Opportunity</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="7">
              <Accordion.Header>Separation of Duties</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
              <Accordion.Header>Back Order Report</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="9">
              <Accordion.Header>Invoice Approval</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="10">
              <Accordion.Header>QBR</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="11">
              <Accordion.Header>Rebate Estimator</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="12">
              <Accordion.Header>Service Level Review</Accordion.Header>
              <Accordion.Body>
                <a className="blue">Tab 1</a>
                <a className="blue">Tab 2</a>
                <a className="blue">Tab 3</a>
                <a className="blue">Tab 4</a>
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>



        </div>
      </div>

    </div>
  </div>


  );
}


export default TopNav;
