import React, {Fragment, useState, useEffect } from "react";
import { Container,
  Tab,
  Tabs
 } from "react-bootstrap";
import EmbedTable from "./EmbedTable";
import { EmbedContainer } from "./EmbedContainer";
import { EmbedActionBar } from "./EmbedActionBar";
//import { Tabs, Tab } from "@mui/material";

const InnerTableTabs = ({
  tabs,
  setVisList,
  visList,
  setSelectedFields,
  selectedInnerTab,
  setSelectedInnerTab,
  handleSingleVisUpdate
}) => {

  console.log("tabs",tabs)

  const [showMenu3, setShowMenu3] = useState();
  const [active, setActive] = useState(false);
  const [faClass, setFaClass] = useState(true);
  const [toggle, setToggle] = useState(true);
  const handleTabChange = (event) => {
    console.log(event)
    console.log(selectedInnerTab)
    let _tab = tabs[event]
    selectedInnerTab[_tab.dashboard_id] = event
    setSelectedInnerTab(selectedInnerTab);
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
          activeKey={selectedInnerTab?selectedInnerTab[tabs[0].dashboard_id]:0}
          onSelect={(e) => handleTabChange(e)}
        >
          {tabs?.map((t, i) => (
            <Tab eventKey={i} title={t.title} key={t.title}>

              <div id="embedWrapper" className={showMenu3 ? "whole" : ""}>
                <EmbedContainer vis={t} visList={visList} updateVisList={setVisList} handleVisUpdate={handleSingleVisUpdate} type={"tabbed"} />
              </div>
            </Tab>
          ))}
        </Tabs>
      </Container>
    </Container>
  );
};

export default InnerTableTabs;
