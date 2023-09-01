import React, {Fragment, useState, useEffect } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import EmbedTable from "./EmbedTable";
import { EmbedContainer } from "./EmbedContainer";

const InnerTableTabs = ({
  tabs,
  setVisList,
  visList,
  setSelectedFields,
  currentInnerTab,
  setCurrentInnerTab,
  handleSingleVisUpdate
}) => {

  const [showMenu3, setShowMenu3] = useState();
  const [active, setActive] = useState(false);
  const [faClass, setFaClass] = useState(true);
  const [toggle, setToggle] = useState(true);
  const handleTabChange = (event) => {
    setCurrentInnerTab(event);
    setSelectedFields(tabs[event]["selected_fields"]);
  };

  const slideIt3 = () =>{
    setShowMenu3(!showMenu3)
  }
  const handleClick = () => {
      setToggle(!toggle);

    setTimeout(() => {
      setActive(!active);

      setFaClass(!faClass);
    }, 600);
    };

  return (
    <Container fluid className="padding-0">
      <Container fluid className={showMenu3 ? "padding-0 innerTab highIndex" : "padding-0 innerTab"}>

        <Tabs
          className="inner"
          fill
          activeKey={currentInnerTab}
          onSelect={(e) => handleTabChange(e)}
        >
          {tabs?.map((t, i) => (
            <Tab eventKey={i} title={t.title} key={t.title}>
        
              <i class="fal fa-sign-out endAbso1"></i>
              <i class="fal fa-print endAbso2"></i>
              <div id="embedWrapper" className={showMenu3 ? "whole" : ""}>

                <p className="small expand" onClick={() => {slideIt3();handleClick()}}> <i className={faClass ? 'fal fa-expand-alt' : 'far fa-compress-arrows-alt'}></i> { active ? "Collapse" : "Expand"}</p>
                <EmbedContainer vis={t} visList={visList} updateVisList={setVisList} handleVisUpdate={handleSingleVisUpdate} />
              </div>
            </Tab>
          ))}
        </Tabs>
      </Container>
    </Container>
  );
};

export default InnerTableTabs;
