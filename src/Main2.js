import React, { useState, useContext, useEffect } from "react";
import { Container, Tab, Tabs, Nav, NavItem } from "react-bootstrap";
import SideForm from "./components/nav/Form.js";
import PurchasesReview from "./pageTemplates/PurchasesReview/PurchasesReview.js";
import InflationDeflation from "./pageTemplates/InflationDeflation/InflationDeflation.js";
import ToTopButton from "./components/ToTopButton.js";
import NavbarMain from "./components/NavbarMain.js";
import Footer from "./components/Footer.js";
import { ExtensionContext } from "@looker/extension-sdk-react";
import moment from "moment";
import Template1 from "./pageTemplates/Template1/Template1.js";
import TopNav from "./components/nav/TopNav.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import {
  LOOKER_MODEL,
  LOOKER_EXPLORE,
  LOOKML_FIELD_TAGS,
  PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
} from "./utils/constants2.js";

import { Link, useRouteMatch } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.js";
import { getApplication, getApplicationTags, getApplicationTabs, getTabVisualizations, getTabTags } from "./utils/writebackService.js";
import { LayoutSelector } from "./LayoutSelector.js";

export const Main2 = () => {
  const [extensionId, setExtensionId] = useState()
  const extensionContext = useContext(ExtensionContext);
  const sdk = extensionContext.core40SDK;


  const [currentNavTab, setCurrentNavTab] = useState("dashboard");

  const [isFetchingLookmlFields, setIsFetchingLookmlFields] = useState(true);

  const [showMenu, setShowMenu] = useState();
  const [keyword, setKeyword] = useState("");

  const [filters, setFilters] = useState([]);
  const [fields, setFields] = useState([])
  const [properties, setProperties] = useState([])
  const [parameters, setParameters] = useState([])

  const [initialLoad, setInitialLoad] = useState(true)
  //here
  const [selectedFilters, setSelectedFilters] = useState({})
  const [updatedFilters, setUpdatedFilters] = useState({})

  const [tabs, setTabs] = useState([])
  const [application, setApplication] = useState({})

  const params = useParams();

  const route = useRouteMatch()

  const slideIt = (show) => {
    setShowMenu(show);
  };

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    console.log("updated", updatedFilters)
  }
    , [updatedFilters])

  // Initialize the states
  useEffect(() => {
    function groupFieldsByTags(fields) {
      const fieldsByTag = {};
      fields.forEach((field) => {
        if (field.tags != "") {
          field.tags
            .toString()
            .split(",")
            .forEach((tag) => {
              tag = tag.trim();

              if (fieldsByTag[tag] === undefined) {
                fieldsByTag[tag] = [field];
              } else {
                fieldsByTag[tag].push(field);
              }
            });
        }
      });
      return fieldsByTag;
    }

    const initializeTabs = async (tabs, tabTags, fieldsByTag) => {
      if (tabs) {
        if (tabs.length > 0) {
          setTabs(tabs)

          let _fields = tabTags.map((f) => {
            let _tab = f.title;
            let _tag = f.tag_name;
            return { tab: _tab, fields: fieldsByTag[_tag] }
          })
          setFields(_fields)
        }
      }
    }

    const createFilters = async (applicationTags, fieldsByTag) => {
      let _filters = [];
      for await (let f of applicationTags.filter(({ tag_group }) => tag_group == "filters")) {
        let _type = f.type;
        let _tag = f.tag_name;
        let _fields = fieldsByTag[_tag];
        let _options = []
        if (f.option_type === "date range") {
          _options = { field: _fields[0], values: await getDefaultDateRange() }
        }
        _filters.push({ type: _type, fields: fieldsByTag[_tag], options: _options, option_type: f.option_type })
      }
      setFilters(_filters)

      let defaultSelected = {}
      console.log('hre', _filters, defaultSelected)
      _filters.map(f => defaultSelected[f.type] = {})
      console.log('Default filters', defaultSelected)
      setSelectedFilters(defaultSelected)

      getOptionValues(_filters);
    }

    const createAppProperties = async (applicationTags, fieldsByTag) => {
      let _appProperties = []
      for await (let p of applicationTags.filter(({ tag_group }) => tag_group == "property")) {
        let _type = p.type;
        let _text = p.misc;
        let _tag = p.tag_name;
        let _fields = fieldsByTag[_tag]
        let _options = ""
        if (p.option_type === "single_value") {
          let value = await getValues(_fields[0], {});
          _options = value[0]
        }
        _appProperties.push({ type: _type, text: _text, fields: _fields[0], value: _options })
      }
      setProperties(_appProperties)
    }


    const createParameters = async (applicationTags, fieldsByTag) => {
      let _appToggles = []
      for await (let p of applicationTags.filter(({ tag_group }) => tag_group == "toggle")) {
        let _type = p.type;
        let _tag = p.tag_name;
        let _fields = fieldsByTag[_tag]
        let _options = _fields[0].enumerations;
        _appToggles.push({ type: _type, fields: _fields[0], value: _options })
      }
      setParameters(_appToggles)
    }

    const initializeAppTags = async (applicationTags, fieldsByTag) => {
      if (applicationTags) {
        createFilters(applicationTags, fieldsByTag)
        createAppProperties(applicationTags, fieldsByTag)
        createParameters(applicationTags, fieldsByTag)
      }
    }

    const fetchLookMlFields = async (model, explore) => {
      const response = await sdk.ok(
        sdk.lookml_model_explore(model, explore, "fields")
      );
      const {
        fields: { dimensions, filters, measures, parameters },
      } = response;

      const lookmlFields = [
        ...dimensions,
        ...filters,
        ...measures,
        ...parameters,
      ];
      return groupFieldsByTags(lookmlFields);
    }

    const initialize = async () => {
      setExtensionId(extensionContext.extensionSDK.lookerHostData.extensionId.split("::")[1])
      let contextData = getContextData();
      console.log("getContext", contextData)
      if (contextData) {
        let { application, application_tags, tabs, tab_tags } = contextData;
        let fieldsByTag = await fetchLookMlFields(application.model, application.explore);
        console.log("fieldsByTag", fieldsByTag)
        initializeTabs(tabs, tab_tags, fieldsByTag);
        initializeAppTags(application_tags, fieldsByTag);
        setIsFetchingLookmlFields(false);
      }
    };

    try {
      initialize();
    } catch (e) {
      console.error("Error fetching Looker filters and fields", e);
    }
  }, []);

  useEffect(() => {
    console.log("field toggles", parameters)
  }, [parameters])

  const getOptionValues = async (filters) => {
    let _filters = []
    let filterArr = [...filters]
    console.log("getOptionValues", filters)
    for await (let f of filterArr) {
      let _options = []
      console.log(f)
      if (f.option_type === "fields") {
        _options = f.fields;
      }
      if (f.option_type === "values") {
        for await (let field of f.fields) {
          let values = await getValues(field, {})
          _options.push({ field: field, values: values })
        }
      }
      if (f.option_type === "single_dimension_value") {
        console.log("account groups", f.fields)
        if (f.fields.length > 0) {
          let value = await getValues(f.fields[0], {})
          console.log("account groups", value)
          _options = ({ field: f.fields[0], values: value })
        }
      }
      if (f.option_type === "date range") {
        _options = f.options
      }
      console.log("options", _options)
      f['options'] = _options;
      _filters.push(f)
    }
    console.log(_filters)
    setFilters(_filters)
  }

  const getDefaultDateRange = () => {
    let prevMonth = moment().subtract(1, "month");
    let startOfMonth = prevMonth
      .startOf("month")
      .format("YYYY-MM-DD")
      .toString();
    let endOfMonth = prevMonth.endOf("month").format("YYYY-MM-DD").toString();
    return `${startOfMonth} to ${endOfMonth}`;
  };

  const getValues = (field, filters) => {
    return sdk.ok(
      sdk.run_inline_query({
        result_format: "json",
        body: {
          model: LOOKER_MODEL,
          view: LOOKER_EXPLORE,
          fields: [field["name"]],
          filters: filters,
          limit: 1000
        },
      })
    );
  };
  const handleUpdateFilter = () => {
    console.log('handleUpdateFilter');
  }

  const updateAppProperties = async (filters) => {
    let newProps = []
    for await (let prop of properties) {
      let _value = await getValues(prop['fields'], filters)
      prop.value = _value[0]
      newProps.push(prop)
    }
    setProperties(newProps)
  }

  const updateContextData = (data) => {
    extensionContext.extensionSDK.saveContextData(data)
  }

  const getContextData = () => {
    return extensionContext.extensionSDK.getContextData();
  }

  const handleDataRefresh = async () => {
    let contextData = {}
    let app = await getApplication(extensionId, sdk)
    if (app.length > 0) {
      contextData['application'] = app[0];
      let _appTags = await getApplicationTags(app[0].id, sdk);
      contextData['application_tags'] = _appTags
      let _tabs = await getApplicationTabs(app[0].id, sdk);
      let _tabTagsList = []
      for await (let t of _tabs) {
        let visConfig = await getTabVisualizations(t.id, sdk);
        t['config'] = visConfig;
        let _tabTags = await getTabTags(t.id, sdk);
        _tabTagsList = _tabTagsList.concat(_tabTags)
      }
      contextData['tab_tags'] = _tabTagsList
      contextData['tabs'] = _tabs;
    }
    console.log(contextData)
    updateContextData(contextData)
  }

  return (
    <>
      <NavbarMain handleDataRefresh={handleDataRefresh} />
      <Container fluid className="mt-50 padding-0">
        <TopNav />
        <div className={showMenu ? "largePadding" : "slideOver largePadding"}>
          <div id="nav2">
            <Tab.Container
              defaultActiveKey={currentNavTab}
              onSelect={(k) => setCurrentNavTab(k)}>
              <Nav className="inner nav nav-tabs nav-fill">
                {tabs?.map(t =>
                  <Nav.Item>
                    <Nav.Link active={t.route === params.path} eventKey={t.route} as={Link} to={`${t.route}`}>{t.title}</Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </Tab.Container>
            <div className="show">
              <Tab.Content>
                <>
                  {tabs?.map((t, i) =>
                    <LayoutSelector key={i}
                      isActive={params.path === t.route}
                      tabProps={t}
                      currentNavTab={currentNavTab}
                      filters={filters}
                      fields={fields}
                      properties={properties}
                      parameters={parameters}
                      updateAppProperties={updateAppProperties}
                      isFetchingLookmlFields={isFetchingLookmlFields}
                      showMenu={showMenu}
                      setShowMenu={setShowMenu}
                      selectedFilters={selectedFilters}
                      setSelectedFilters={setSelectedFilters}
                      updatedFilters={updatedFilters}
                      setUpdatedFilters={setUpdatedFilters}
                      initialLoad={initialLoad}
                      setInitialLoad={setInitialLoad}
                      keyword={keyword}
                      handleChangeKeyword={handleChangeKeyword}
                    />
                  )}
                  {/* <Route path={`${route.url}/`}>
                  <Test />
                  </Route> */}
                </>
              </Tab.Content>
            </div>
            {/* <Tabs
              defaultActiveKey={currentNavTab}
              onSelect={(k) => setCurrentNavTab(k)}
              className="mb-0"
              fill
            >
               {/* <Tab eventKey="dashboard" title="Purchases Review">
                <PurchasesReview
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  currentNavTab={currentNavTab}
                  currentInvoiceCount={currentInvoiceCount}
                  updateInvoiceCount={updateInvoiceCount}
                  getAllFilters={getAllFilters}
                  setSelectedAccountGroup={setSelectedAccountGroup}
                  accountGroupOptions={accountGroupOptions}
                  selectedAccountGroup={selectedAccountGroup}
                  accountGroupField={accountGroupField}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  dimensionToggleFields={dimensionToggleFields}
                  quickFilterOptions={quickFilterOptions}
                />
              </Tab>
              <Tab eventKey="product-movement" title="Product Movement Report">
                <Template1
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  config={{ tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID }}
                  tabKey={"product-movement"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  currentInvoiceCount={currentInvoiceCount}
                  updateInvoiceCount={updateInvoiceCount}
                  getAllFilters={getAllFilters}
                  setSelectedAccountGroup={setSelectedAccountGroup}
                  accountGroupOptions={accountGroupOptions}
                  selectedAccountGroup={selectedAccountGroup}
                  accountGroupField={accountGroupField}
                  keyword={keyword}
                  handleChangeKeyword={handleChangeKeyword}
                  quickFilterOptions={quickFilterOptions}
                  setSelectedQuickFilter={setSelectedQuickFilter}
                  selectedQuickFilter={selectedQuickFilter}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment1}} />}}
                />
              </Tab>
              <Tab eventKey="invoice" title="Invoice Report">
                <Template1
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  config={{ tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID }}
                  tabKey={"invoice"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  currentInvoiceCount={currentInvoiceCount}
                  updateInvoiceCount={updateInvoiceCount}
                  getAllFilters={getAllFilters}
                  setSelectedAccountGroup={setSelectedAccountGroup}
                  accountGroupOptions={accountGroupOptions}
                  selectedAccountGroup={selectedAccountGroup}
                  accountGroupField={accountGroupField}
                  quickFilterOptions={quickFilterOptions}
                  setSelectedQuickFilter={setSelectedQuickFilter}
                  selectedQuickFilter={selectedQuickFilter}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment2}} />}}
                />
              </Tab>
              <Tab eventKey="auto-sub" title="Auto-Sub Report">
                <Template1
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  config={{ tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID }}
                  tabKey={"auto-sub"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  currentInvoiceCount={currentInvoiceCount}
                  updateInvoiceCount={updateInvoiceCount}
                  getAllFilters={getAllFilters}
                  setSelectedAccountGroup={setSelectedAccountGroup}
                  accountGroupOptions={accountGroupOptions}
                  selectedAccountGroup={selectedAccountGroup}
                  accountGroupField={accountGroupField}
                  quickFilterOptions={quickFilterOptions}
                  setSelectedQuickFilter={setSelectedQuickFilter}
                  selectedQuickFilter={selectedQuickFilter}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment3}} />}}
                />
              </Tab>
              <Tab eventKey="id" title="Inflation/Deflation Report">
                <InflationDeflation
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  config={{
                    tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
                    vis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
                  }}
                  tabKey={"id"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  currentInvoiceCount={currentInvoiceCount}
                  updateInvoiceCount={updateInvoiceCount}
                  getAllFilters={getAllFilters}
                  setSelectedAccountGroup={setSelectedAccountGroup}
                  accountGroupOptions={accountGroupOptions}
                  selectedAccountGroup={selectedAccountGroup}
                  accountGroupField={accountGroupField}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment4}} />}}
                />
              </Tab>
              <Tab eventKey="product_movement" title="Product Movement Report" mountOnEnter={true} unMountOnExit={false}>
                <Template2
                  currentNavTab={currentNavTab}
                  filters={filters}
                  fields={fields.find(({tab}) => tab === "Product Movement Report")}
                  properties={properties}
                  updateAppProperties={updateAppProperties}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  config={{ tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID }}
                  tabKey={"product_movement"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment1}} />}}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  initialLoad={initialLoad}
                  setInitialLoad={setInitialLoad}
                />
              </Tab>
              <Tab eventKey="invoice_report" title="Invoice Report" mountOnEnter={true} unMountOnExit={false}>
                <Template2
                  currentNavTab={currentNavTab}
                  filters={filters}
                  fields={fields.find(({tab}) => tab === "Product Movement Report")}
                  properties={properties}
                  updateAppProperties={updateAppProperties}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  config={{ tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID }}
                  tabKey={"invoice_report"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment2}} />}}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                />
              </Tab>
              <Tab eventKey="auto_sub" title="Auto Sub Report" mountOnEnter={true} unMountOnExit={false}>
                <Template2
                  currentNavTab={currentNavTab}
                  filters={filters}
                  fields={fields.find(({tab}) => tab === "Product Movement Report")}
                  properties={properties}
                  updateAppProperties={updateAppProperties}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  config={{ tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID }}
                  tabKey={"auto_sub"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment3}} />}}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                />
              </Tab>
              <Tab eventKey="id" title="Inflation/Deflation Report" mountOnEnter={true} unMountOnExit={false}>
                <Template3
                  currentNavTab={currentNavTab}
                  filters={filters}
                  fields={fields.find(({tab}) => tab === "Product Movement Report")}
                  properties={properties}
                  updateAppProperties={updateAppProperties}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  config={{
                    tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
                    vis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID
                   }}
                  tabKey={"id"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment3}} />}}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                />
              </Tab>
            </Tabs> */}
          </div>
        </div>
      </Container>
      <ToTopButton />
      <SideForm />
      <Footer />
    </>
  );
};
