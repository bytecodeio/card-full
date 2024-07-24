import React, {
    useState,
    useContext,
    useEffect,
    useRef,
} from "react";
import {
    Col,
    Container,
    Row,
    Spinner,
} from "react-bootstrap";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import _ from "lodash";
import { ApplicationContext } from "../Main2";
import { TopRow } from "./LayoutComponents/TopRow/TopRow";
import { SelectionOptions } from "./LayoutComponents/SelectionOptions/SelectionOptions";
import { CurrentSelectionRow } from "./LayoutComponents/CurrentSelectionRow/CurrentSelectionRow";
import { OneTabVisualization } from "./VisualizationLayouts/OneTabVisualization";
import { DashboardVisualizations } from "./VisualizationLayouts/DashboardVisualizations";
import { FullLookMLDashboard } from "./VisualizationLayouts/FullLookMLDashboard";
import { LoadingComponent } from "./LoadingComponent";
import { OneTabVisualizationWithVizAbove } from "./VisualizationLayouts/OneTabVisualizationWithVizAbove";
import { OneTabVisualizationWithVizAbove2 } from "./VisualizationLayouts/OneTabVisualizationWithVizAbove2";
import { DashboardVisualizations221 } from "./VisualizationLayouts/DashboardVisualizations221";
import { RebateEstimator } from "./VisualizationLayouts/RebateEstimator";
import { StackedVisualization } from "./VisualizationLayouts/StackedVisualization";
import { RebateEstimatorTopRow } from "./LayoutComponents/RebateEstimatorRow/RebateEstimatorTopRow";
import { MessageOverlay } from "./LayoutComponents/EmbedMessages/MessageOverlay";
import moment from "moment";

export const TabContext = React.createContext({})

//ReportContainer is the parent component of each tab that controls each tabs' states
export const ReportContainer = ({
    currentNavTab,
    fields,
    properties,
    tabKey,
    config,
    description,
    isActive,
    tabFilters,
    attributes,
    fieldGroups,
    layoutProps
}) => {
    const { extensionSDK,core40SDK: sdk } = useContext(ExtensionContext);
    const wrapperRef = useRef(null);
    const [selectedFields, setSelectedFields] = useState([]);
    //AccountGroupsFieldOptions
    const defaultChecked = true;
    const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
    const [currentInnerTab, setCurrentInnerTab] = useState(0);
    const [visList, setVisList] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    const [faClass, setFaClass] = useState(true);
    // const [toggle, setToggle] = useState(true);
    // const [active, setActive] = useState(false);

    const [selectedTabFilters,setSelectedTabFilters] = useState({})

    const [selectedInnerTab, setSelectedInnerTab] = useState({})

    const [isFilterChanged,setIsFilterChanged] = useState(false)
    // Fetch default selected fields and filters + query for embedded visualization from Looker dashboard on load
    const [isFetchingDefaultDashboard, setIsFetchingDefaultDashboard] = useState(true);

    const [isLoading, setIsLoading] = useState({})
  
    const [isLoadingInitialVis, setIsLoadingInitialVis] = useState(true)

    const [previousFilters, setPreviousFilters] = useState({})

    const params = useParams();

    const {filters, setFilters,
      parameters,
      updateAppProperties,
      isFetchingLookmlFields,
      keyword,
      selectedFilters,
      setSelectedFilters,
      updatedFilters,
      setUpdatedFilters,
      initialLoad,
      setInitialLoad,
      savedFilters,
      removeSavedFilter,
      upsertSavedFilter,
      showMenu, setShowMenu, propertiesLoading,application,isFilterLoading, updatedFields} = useContext(ApplicationContext)

      useEffect(() => {
        console.log("Total filters",filters)
      },[filters])

    //Runs everytime the tab is clicked on
    useEffect(() => {
    const initialize = async () => {
        if (params.path == tabKey) {
          if (!isMounted && !initialLoad) {
              try {
              fetchDefaultFieldsAndFilters();
              setIsMounted(true);
              } catch (e) {
              console.error("Error fetching default dashboard", e);
              setIsMounted(true);
              }
          } else {
              handleTabVisUpdate({}, selectedFilters, "", true);
          }
        }
    }
    initialize()
    }, [currentNavTab,initialLoad]);

    // useEffect(() => {
    //   handleTabVisUpdate({...visList}, {...selectedFilters}, '', true)
    //   setIsFilterChanged(false)
    // },[isFilterChanged==true])


    //Getting the tiles of each dashboard
      const fetchDefaultFieldsAndFilters = async () => {
        let _visList = []
        let index = 0
        let _defaultSelectedInnerTabs = {}
        await Promise.all(config?.map(async (visConfig) => {
        //for await (let visConfig of config) {
          console.log("vis config", visConfig)
          const { id, dashboard_elements, dashboard_filters } = await sdk.ok(
            sdk.dashboard(visConfig['lookml_id'], 'dashboard_elements, dashboard_filters, id')
          ).catch(ret => {return {dashboard_elements:[], dashboard_filters:{}}})
          console.log("vis config", dashboard_elements)
          if (dashboard_elements.length > 0) {
            //if (dashboard_elements.length > 1){
              //console.log("test", _defaultSelectedInnerTabs)
              _defaultSelectedInnerTabs[id] = 0;
            //}
            for await (let t of dashboard_elements) {
              let tileFilters = t["result_maker"]["query"]["filters"];
              let _tileFilterOptions = [];
              let _selectedFilters = {};
              if (tileFilters) {
               for await(let key of Object.keys(tileFilters)) {
                    //let list = parameters.filter(({fields}) => fields['name'] === key)
                    //console.log("parameters", parameters)
                   for await(let p of parameters){
                    //console.log("parameters", key + ' ' + p.fields['name']);
                    if (key === p.fields["name"]) {
                      _selectedFilters[key] = tileFilters[key];
                      _tileFilterOptions.push({
                        name: p.fields["name"],
                        options: p["value"],
                      });
                    }
                  };
                }
              };

              let vis = {};
              let { client_id, slug, vis_config, fields, model, view, pivots, total, limit, dynamic_fields, sorts, has_table_calculations } = t["result_maker"]["query"];
              console.log("vis config", t)
              console.log("client id", client_id)
              vis = {
                visId: visConfig["vis_name"],
                title: t["title"],
                query: client_id,
                default_fields: [...fields],
                selected_fields: [...fields],
                tileFilterOptions: _tileFilterOptions,
                localSelectedFilters: _selectedFilters,
                index: index++,
                dashboard_id: id,
                error:false,
                query_values : {
                  vis_config, fields, model, view, pivots,total, limit, dynamic_fields, sorts, has_table_calculations
                },
                isLoading:false,
                visUrl:"",
                query_id:'',
                previous_vis:client_id
              };
              _visList.push(vis);
            }
          } else setInitialLoad(false);
          return true
        }))

        setSelectedInnerTab(_defaultSelectedInnerTabs)
        setVisList(_visList);

        setSelectedFields(fields);
        setIsFetchingDefaultDashboard(false);
        loadDefaults(_visList);
      }

      const [isPageLoading, setIsPageLoading] = useState(true);

      const loadDefaults = async (_visList) => {
        if (tabFilters.length > 0) {
          let _selectedTabFilters = {...selectedTabFilters}
          console.log("Rebate tab filters", tabFilters)
          await tabFilters.map(filters => {
            if (filters.fields.default_filter_value) {
              _selectedTabFilters[filters['fields']['name']] = filters['fields']['default_filter_value']
            }
          })
          setSelectedTabFilters(_selectedTabFilters)
        }
        console.log("DEBUGGING DEFAULTS")
        if (layoutProps.layout !== "Rebate Estimator") {          
          handleTabVisUpdate(_visList,{...selectedFilters},'', true);
        }
      };

      // Page loading state
      useEffect(() => {
        if (!isFetchingDefaultDashboard && !isFetchingLookmlFields) {
          setIsPageLoading(false);
        }
      }, [isFetchingDefaultDashboard, isFetchingLookmlFields]);

      //Formatting the filters for a Looker Query
      const formatFilters = (filters,type) => {
        let filter = {};
        Object.keys(filters).map((keyProp) => {
          if (Object.keys(filters[keyProp]).length > 0) {
            if (!(keyProp == "date range" &&Object.keys(filters["date filter"]).length > 0)) {
              let obj = {}                            
              for (const [key, value] of Object.entries(filters[keyProp])) {
                console.log("format filter key", keyProp)
                if (keyProp == "date range" || keyProp == "contract expiration filter") {
                  if (value != "") {
                    let _split = value.split(" to ");
                    _split[1] = moment(_split[1]).add(1,'day').format('YYYY-MM-DD');
                    let _newValue = _split.join(" to ")
                    obj[key] = _newValue.toString()
                  }
                } else {                    
                  obj[key] = value.toString();
                }
              }  
              
              if (Object.entries(obj).map(([key,value]) => {
                if (value == '') {
                  delete obj[key]
                }
              }))   
              console.log("FORMAT FILTER REPORTCONTAINER", obj)         
              //if (Object.values(obj) != '') {
                filters[keyProp] = obj
                filter = {...filter, ...filters[keyProp]}
              //}
            }
          }
        });
        console.log("format filter key", filter)
        return filter;
      };

      const queryValidator = async (query) => {
        let limit = query['limit']
        query['limit'] = 1;
        let res = await sdk.ok(sdk.create_query(query, 'id,slug'));
        query['limit'] = limit;
        let {client_id} = await sdk.ok(sdk.create_query(query,'client_id'))
        res['client_id'] = client_id
        return res
        // if (result.length > 0) {
        //   return {status:false}
        // }
        // if (result.length == 0) {
        //   return {status:true, reason:'empty'};
        // }
        // return {status:true, reason:'error'};
      }

      useEffect(() => {
        console.log("list of vis",visList)
      },[visList])

      const createVisualizationUrl = async (payload) => {
        let urlString="";
        if (payload['fields']?.length > 0) {
          urlString += `&fields=${payload['fields'].toString()}`
        }
        if (Object.keys(payload['filters'])?.length > 0) {
          for await (let [key,value] of Object.entries(payload['filters'])) {
            urlString+= `&f[${key}]=${encodeURIComponent(value)}`
          }
        }
        if (payload['limit']) {
          urlString += `&limit=${payload['limit']}`
        }

        if (payload['pivots']?.length > 0) {
          urlString += `&pivots=${payload['pivots'].toString()}`
        }
        if (payload['total']) {
          urlString += `&total=${payload['total'].toString()}`
        }
        if (payload['sorts']) {
          urlString += `&sorts=${payload['sorts'].toString()}`
        }
        if (payload['dynamic_fields']) {
          urlString += `&dynamic_fields=${payload['dynamic_fields'].toString()}`
        }

        if (payload['vis_config']) {
          urlString += `&vis=${encodeURIComponent(JSON.stringify(payload['vis_config']))}`
        }
        return urlString
      }

      useEffect(() => {
        console.log("SAME, NO FILTERS previous update", previousFilters)
      },[previousFilters])
      let _previousFilter = {}

      // Handle run button click for visualizations on the page
      const handleTabVisUpdate = async (
        _visList = [],
        filterList = { ...selectedFilters },
        type="",
        loadInitialVis=false
      ) => {
        if (!Array.isArray(_visList)) {
          _visList = [...visList];
        }
        let _updatedFilters = {...updatedFilters};
        let _previousFilter = _updatedFilters
        console.log("SAME, NO FILTERS previous", _previousFilter)

        console.log("Comparison dates", tabFilters)

        let _filteredFilters = {}
        for await(let key of Object.keys(filterList)){
          if (type=="date") {
            if (key.includes('date')) {
              _filteredFilters[key] = filterList[key]
            } else {
              _filteredFilters[key] = _updatedFilters[key]
            }
          } else if (type=="selections") {
            if (!key.includes('date')) {
              _filteredFilters[key] = filterList[key]
            } else {
              _filteredFilters[key] = _updatedFilters[key]
            }
          } else {
            _filteredFilters[key] = filterList[key]
          }
        }

        console.log("filtered filters", JSON.parse(JSON.stringify(_filteredFilters)))
        console.log("SAME, NO FILTERS previous", _previousFilter)
        console.log("SAME, NO FILTERS filtered", _filteredFilters)
        console.log("SAME, NO FILTERS load", loadInitialVis)
        console.log("SAME, NO FILTERS", JSON.stringify(_previousFilter) === JSON.stringify(_filteredFilters) && !loadInitialVis)
        let onlyFields = false;
        if (JSON.stringify(_previousFilter) === JSON.stringify(_filteredFilters) && !loadInitialVis) {
          console.log("DEBUGGING DEFAULTS ONLY FIELDS")
          onlyFields = true
        }
        console.log("selected inner tab", onlyFields)
        console.log("Selected inner tab", selectedInnerTab)
        console.log("selected inner tab", visList)
        let _filters = {};
        _visList = _visList.map((vis) => {
          if ((onlyFields && vis.index == selectedInnerTab[vis.dashboard_id]) || onlyFields == false || Object.keys(selectedTabFilters).length > 0) {
            vis.isLoading=true;
          }
          return vis
        });
        setVisList(_visList)
        _filters = await formatFilters(JSON.parse(JSON.stringify(_filteredFilters)));


        setUpdatedFilters(JSON.parse(JSON.stringify(_filteredFilters)))
        // setUpdatedFilters(JSON.parse(JSON.stringify(filterList)));
        updateAppProperties(_filters);
        let _selectedTabFilters = {...selectedTabFilters}
        if (tabFilters?.find(({type}) => type ==="comparison filter compare") && tabFilters?.find(({type}) => type ==="comparison filter review")) {
          let _compare = tabFilters?.find(({type}) => type ==="comparison filter compare")
          let _review = tabFilters?.find(({type}) => type ==="comparison filter review")
          if (selectedTabFilters[_compare['fields']['name']]) {
            let _compareVal = _selectedTabFilters[_compare['fields']['name']].split(" to ")
            _compareVal[1] = moment(_compareVal[1]).add(1,'day').format('YYYY-MM-DD')
            _selectedTabFilters[_compare['fields']['name']] = _compareVal.join(" to ");
          }

          if (selectedTabFilters[_review['fields']['name']]) {
            let _reviewVal = _selectedTabFilters[_review['fields']['name']].split(" to ")
            _reviewVal[1] = moment(_reviewVal[1]).add(1,'day').format('YYYY-MM-DD')
            _selectedTabFilters[_review['fields']['name']] = _reviewVal.join(" to ");
          }

          console.log("comparison date filters", _filters)
          let dateRangeName =  filters?.find(({type}) =>  type==='date range')
          let dateFilterName =  filters?.find(({type}) =>  type==='date filter')
          console.log("comparison date filters", dateRangeName)
          console.log("comparison date filters", dateFilterName)
          dateRangeName?.fields.map(field => delete _filters[field['name']])
          dateFilterName?.fields.map(field => delete _filters[field['name']])
          _filters['intersecting_rows_1'] = 'Yes'
          console.log("comparison date date addition", tabFilters)
        }
        console.log("tab filters", tabFilters)
        if (tabFilters?.find(({type}) => type=="default date filter")) {
          console.log("default date filters", _filters)
          let _default_date = tabFilters?.find(({type}) => type=="default date filter");
          console.log("default date filters", _default_date)
          let dateRangeName =  filters?.find(({type}) =>  type==='date range')
          let dateFilterName =  filters?.find(({type}) =>  type==='date filter')
          dateRangeName?.fields.map(field => delete _filters[field['name']])
          dateFilterName?.fields.map(field => delete _filters[field['name']])
          //_filters[_default_date['fields']['name']] = _default_date.default_value
        }
        
        _filters = {..._filters, ..._selectedTabFilters}
        console.log("CHECK FILTERS", _filters)
        console.log("DEBUGGING DEFAULTS", _visList)
        console.log("FIELD CHANGES", updatedFields)  
        if (updatedFields[currentNavTab]) {
          _visList = await updateVislistForFieldsAndFilters(_visList, {...updatedFields[currentNavTab]});
        }

        for (let vis of _visList) {
          console.log("DEBUGGING DEFAULTS IF ELSE", (onlyFields && vis.index === selectedInnerTab[vis.dashboard_id]) || onlyFields == false || Object.keys(selectedTabFilters).length > 0)
          if ((onlyFields && vis.index === selectedInnerTab[vis.dashboard_id]) || onlyFields == false || Object.keys(selectedTabFilters).length > 0) {
            const { vis_config, model, view, pivots,total, limit, dynamic_fields, sorts } = vis['query_values'];
            let index = _visList.indexOf(vis)
            console.log("DEBUGGING DEFAULTS", vis)
            console.log("DEBUGGING DEFAULTS", _filters)
            let _addTabFilters = {}
            if (layoutProps.layout === "Rebate Estimator") {
              let _tabFilters = tabFilters?.filter(({type}) => type === "default tab filter") 
              await _tabFilters?.map(filter => {
                if (filter.sub_tab.trim() == "") {
                  console.log("Rebate FILTER VALS blank subtab")
                  let name = filter['fields']['name']
                  _addTabFilters[name] = filter.default_value
                } else if (filter.sub_tab === vis.title) {
                  console.log("Rebate FILTER VALS sub tab match")
                  let name = filter['fields']['name']
                  _addTabFilters[name] = filter.default_value
                }
              })  
              console.log("Rebate FILTER VALS", _addTabFilters)      
            }


            let _fields = [];

            console.log("pivots", pivots)

            _fields = vis["selected_fields"];
            let _dynamic_fields = ""
            if (layoutProps.layout == "Rebate Estimator" || layoutProps.layout == "OneTabVisualizationWithVizAbove") {
              _dynamic_fields = dynamic_fields
            }

            let _query = {
              model: model,
              view: view,
              fields: _fields,
              filters: vis["localSelectedFilters"]
                ? { ..._filters, ...vis["localSelectedFilters"], ..._addTabFilters }
                : {..._filters, ..._addTabFilters},
              vis_config,
              pivots,
              total,
              dynamic_fields: _dynamic_fields,
              limit:limit,
              sorts
            }
            let _queryVal = {..._query}

            let _urlParams = await createVisualizationUrl(_query)     
            let {id, client_id} = await queryValidator(_queryVal);
            vis['previous_vis'] = vis['query'];
            vis['query_id'] = id
            vis['query'] = client_id
            vis['visUrl'] = _urlParams;
            vis['isLoading'] = false;
            //vis['error'] = _error;
            _visList[index] = vis;
            setVisList(_visList)
          }

          setPreviousFilters({..._filteredFilters})
        }          
        _visList=[]
        _filters={}
        //setVisList(newVisList);
        //
      };

      //Handles update for a single viz with something like a parameter
      const handleSingleVisUpdate = async (_index) => {
        let _visList = [...visList];
        let currentVis = _visList.find(({ index }) => index === _index);
        currentVis['isLoading'] = true;
        setVisList(_visList)

        let _filters = {};
        _filters = await formatFilters(JSON.parse(JSON.stringify(updatedFilters)));
        _filters = { ..._filters, ...currentVis["localSelectedFilters"] };


        const { vis_config, model, view, pivots } = currentVis['query_values'];

        let _fields = [];
        _fields = currentVis["selected_fields"];

        const _query = {
              model: model,
              view: view,
              fields: _fields,
              filters: _filters,
              vis_config,
              pivots:pivots,
              limit:5000
            }

        // const { client_id } = await sdk.ok(
        //   sdk.create_query({
        //     model: model,
        //     view: view,
        //     fields: _fields,
        //     filters: _filters,
        //     vis_config,
        //     pivots:pivots,
        //     limit:5000
        //   })
        // );

        let _urlParams = await createVisualizationUrl(_query)
        //currentVis["query"] = client_id;
        currentVis['visUrl'] = _urlParams;
        currentVis["isLoading"] = false;
        setVisList([..._visList]);
      };

      // async function doClearAll() {
      //   setIsDefaultProduct(false);
      //   setUpdateButtonClicked(true);

      //   let filters = JSON.parse(JSON.stringify(selectedFilters));
      //   for (let name in filters) {
      //     if (name !== "date range") filters[name] = {};
      //   }
      //   setSelectedFilters(filters);
      //   setUpdatedFilters(filters);

      //   // setIsFilterChanged(true);
      // }

      useEffect((e) => {
        document.addEventListener("click", handleClickOutside, false);
        return () => {
          document.removeEventListener("click", handleClickOutside, false);
        };
      }, []);

      const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        }
      };

    const updateFieldsAndFilters = async (_updatedFields, _updatedFilters) => {
      console.log("FIELD CHANGES", _updatedFields)
      let _fieldsWithinTabs = {..._updatedFields[currentNavTab]};
      console.log("FIELD CHANGES", currentNavTab)
      console.log("FIELD CHANGES", _fieldsWithinTabs)
      let _visList = [...visList]
      let _list = []
      _list = await updateVislistForFieldsAndFilters(_visList, _fieldsWithinTabs)
      console.log("FIELD CHANGES", _list)
      handleTabVisUpdate(_list, _updatedFilters)
    }

    const updateVislistForFieldsAndFilters = async(_visList, _fieldsWithinTabs) => {
      return await _visList.map(v => {
        let _fieldChanges = _fieldsWithinTabs[v.title];
        if (_fieldChanges && _fieldChanges.length > 0) {           
          _fieldChanges.map(changes => {
            console.log("FIELD CHANGES CHANGES", changes) 
            if (changes.type == "add") {
                if (!v.selected_fields.includes(changes.field)) {
                  v.selected_fields.push(changes.field)
                  console.log("FIELD CHANGES", changes)  
                }
            } else if (changes.type == "remove") {
              if (v.selected_fields.includes(changes.field)) {
                let index = v.selected_fields.indexOf(changes.field)
                v.selected_fields.splice(index,1)
                console.log("FIELD CHANGES", changes)  
              }
            }
          })      
          console.log("FIELD CHANGES", _fieldChanges)          
        }
        return v
      })
    }



    console.log("description", application)

      // const AccountGroupsFieldOptions = useMemo(() => {

      //   let cfilter = _.cloneDeep(filters);
      //   let obj = cfilter?.find(({ type }) => type === "account group");
      //   if (Array.isArray(obj?.options?.values)) {
      //     obj.options.values = obj?.options?.values?.filter((item) =>
      //       item["users.account_name"]
      //         ?.toLowerCase()
      //         .includes(keyword?.toLowerCase())
      //     );
      //   }
      //   return obj;
      // }, [keyword, filters]);

    return(
    <div className={isActive ? "tab-pane active" : "hidden"}>
      <Container fluid className="test">
        {isPageLoading ? (
          <LoadingComponent />
        ) : (
          <>
            <SelectionOptions filters={filters} setFilters={setFilters} tabFilters={tabFilters}
                fields={fields} handleTabVisUpdate={handleTabVisUpdate}
                visList={visList}setVisList={setVisList}
                selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}
                fieldGroups={fieldGroups} savedFilters={savedFilters}
                removeSavedFilter={removeSavedFilter} upsertSavedFilter={upsertSavedFilter}
                attributes={attributes} selectedInnerTab={selectedInnerTab}
                updateButtonClicked={updateButtonClicked} setUpdateButtonClicked={setUpdateButtonClicked}
                setIsFilterChanged={setIsFilterChanged}
                layoutProps={layoutProps}
                showMenu={showMenu} setShowMenu={setShowMenu}
                updatedFilters={updatedFilters}
                setUpdatedFilters={setUpdatedFilters}
                isFilterLoading={isFilterLoading}
                formatFilters={formatFilters}
                currentTab={currentNavTab}
                updateFieldsAndFilters={updateFieldsAndFilters}
            />
            <Row className="fullW">
              <Col md={12} lg={12}>
                  <TopRow
                    dateFilter={filters.find(
                      ({ type }) => type === "date filter"
                    )}
                    dateRange={filters.find(
                      ({ type }) => type === "date range"
                    )}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    selectedTabFilters={selectedTabFilters}
                    setSelectedTabFilters={setSelectedTabFilters}
                    handleTabVisUpdate={handleTabVisUpdate}
                    description={application.tooltip_description}
                    filters={filters}
                    tabFilters={tabFilters}
                    layoutProps={layoutProps}
                  />
              </Col>
            </Row>
            

            <CurrentSelectionRow  properties={properties} propertiesLoading={propertiesLoading}
             filters={filters}
             selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}
             updatedFilters={updatedFilters} setUpdatedFilters={setUpdatedFilters}
             formatFilters={formatFilters}  faClass={faClass}
             layoutProps={layoutProps}/>

            {
              ((application?.account_required == "true" && Object.values(updatedFilters['account filter']).length > 0) || application?.account_required != "true")?

            <TabContext.Provider value={{isLoading, setIsLoading, isLoadingInitialVis}}>
              {layoutProps.layout === "OneTabVisualization"?
                <OneTabVisualization
                    setSelectedFields={setSelectedFields}
                    selectedInnerTab={selectedInnerTab}
                    setSelectedInnerTab={setSelectedInnerTab}
                    setVisList={setVisList}
                    visList={visList}
                    handleSingleVisUpdate={handleSingleVisUpdate}/>
                :''}

              {layoutProps.layout === "OneTabVisualizationWithVizAbove"?
                <OneTabVisualizationWithVizAbove
                    setSelectedFields={setSelectedFields}
                    selectedInnerTab={selectedInnerTab}
                    setSelectedInnerTab={setSelectedInnerTab}
                    setVisList={setVisList}
                    visList={visList}
                    handleSingleVisUpdate={handleSingleVisUpdate}/>
                :''}


                {layoutProps.layout === "OneTabVisualizationWithVizAbove2"?
                  <OneTabVisualizationWithVizAbove2
                      setSelectedFields={setSelectedFields}
                      selectedInnerTab={selectedInnerTab}
                      setSelectedInnerTab={setSelectedInnerTab}
                      setVisList={setVisList}
                      visList={visList}
                      handleSingleVisUpdate={handleSingleVisUpdate}/>
                  :''}

              {layoutProps.layout === "DashboardVisualizations"?
                <DashboardVisualizations
                    setSelectedFields={setSelectedFields}
                    selectedInnerTab={selectedInnerTab}
                    setSelectedInnerTab={setSelectedInnerTab}
                    setVisList={setVisList}
                    visList={visList}
                    handleSingleVisUpdate={handleSingleVisUpdate}/>
                :''}

              {layoutProps.layout === "DashboardVisualizations221"?
                <DashboardVisualizations221
                    setSelectedFields={setSelectedFields}
                    selectedInnerTab={selectedInnerTab}
                    setSelectedInnerTab={setSelectedInnerTab}
                    setVisList={setVisList}
                    visList={visList}
                    handleSingleVisUpdate={handleSingleVisUpdate}/>
                :''}

              {layoutProps.layout === "Rebate Estimator"?
                <RebateEstimator
                    setSelectedFields={setSelectedFields}
                    selectedInnerTab={selectedInnerTab}
                    setSelectedInnerTab={setSelectedInnerTab}
                    setVisList={setVisList}
                    visList={visList}
                    handleSingleVisUpdate={handleSingleVisUpdate}
                    updatedFilters={updatedFilters}
                    formatFilters={formatFilters}
                    tabFilters={tabFilters}
                    selectedTabFilters={selectedTabFilters}
                    setSelectedTabFilters={setSelectedTabFilters}
                    handleTabVisUpdate={handleTabVisUpdate}
                    />
                :''}

              {layoutProps.layout === "StackedVisualization"?
                <StackedVisualization
                    setSelectedFields={setSelectedFields}
                    selectedInnerTab={selectedInnerTab}
                    setSelectedInnerTab={setSelectedInnerTab}
                    setVisList={setVisList}
                    visList={visList}
                    handleSingleVisUpdate={handleSingleVisUpdate}/>
                :''}
              {layoutProps.layout === "FullLookMLDashboard"?
                <FullLookMLDashboard
                    config={config}
                  />
                :''}
            </TabContext.Provider>
            
              :
              <MessageOverlay string={"Please select Account(s) to show data"} />}

          </>
        )}
      </Container>
    </div>
    )
}
