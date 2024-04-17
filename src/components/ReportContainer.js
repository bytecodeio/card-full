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

    const [previousFilters, setPreviousFilters] = useState({})
  
    const params = useParams();
  
    const {filters,
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
      showMenu, setShowMenu, propertiesLoading,application} = useContext(ApplicationContext)

      console.log("tab filters", tabFilters)

    //Runs everytime the tab is clicked on
    useEffect(() => {
    const initialize = async () => {
        if (params.path == tabKey) {
        if (!isMounted && !initialLoad) {
            try {
            await fetchDefaultFieldsAndFilters();
            setIsMounted(true);
            } catch (e) {
            console.error("Error fetching default dashboard", e);
            setIsMounted(true);
            }
        } else {
            //handleTabVisUpdate();
        }
        }
    }
    initialize()
    }, [currentNavTab,initialLoad]);   

    useEffect(() => {
      handleTabVisUpdate({...visList})
      setIsFilterChanged(false)
    },[isFilterChanged==true])

    
    //Getting the tiles of each dashboard
      const fetchDefaultFieldsAndFilters = async () => {
        
        let _visList = []
        let index = 0
        let _defaultSelectedInnerTabs = {}
        for await (let visConfig of config) {
          const { id, dashboard_elements, dashboard_filters } = await sdk.ok(
            sdk.dashboard(visConfig['lookml_id'], 'dashboard_elements, dashboard_filters, id')
          ).catch(ret => {return {dashboard_elements:[], dashboard_filters:{}}})
          
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
              let { client_id, vis_config, fields, model, view, pivots, total } = t["result_maker"]["query"];
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
                  vis_config, fields, model, view, pivots,total
                },
                isLoading:false,
                visUrl:"",
                query_id:''
              };
              _visList.push(vis);
    
            }
          } else setInitialLoad(false);
        }
        
        setSelectedInnerTab(_defaultSelectedInnerTabs)
        setVisList(_visList);
    
        setSelectedFields(fields);
        setIsFetchingDefaultDashboard(false);
        loadDefaults(_visList);
      }
    
      const loadDefaults = async (_visList) => {        
        handleTabVisUpdate(_visList);
      };
        
      // Page loading state
      const [isPageLoading, setIsPageLoading] = useState(true);
      useEffect(() => {
        if (!isFetchingDefaultDashboard && !isFetchingLookmlFields) {
          setIsPageLoading(false);
        }
      }, [isFetchingDefaultDashboard, isFetchingLookmlFields]);
        
      //Formatting the filters for a Looker Query
      const formatFilters = (filters,type) => {
        let filter = {};
        Object.keys(filters).map((key) => {
          if (Object.keys(filters[key]).length > 0) {
            if (!(key == "date range" &&Object.keys(filters["date filter"]).length > 0)) {
              let obj = {}
              for (const [key, value] of Object.entries(filters[key])) {
                obj[key] = value.toString();
              }
                filters[key] = obj     
                filter = {...filter, ...filters[key]}             
              
            }
          }
        });
        return filter;
      };

      const queryValidator = async (query) => {
        query['limit'] = 1;
        let res = await sdk.ok(sdk.create_query(query, 'id,slug'));
        query['limit'] = 5000;
        let {slug} = await sdk.ok(sdk.create_query(query,'slug'))
        res['slug'] = slug
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
            urlString+= `&f[${key}]=${value}`
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

        if (payload['vis_config']) {
          urlString += `&vis=${encodeURIComponent(JSON.stringify(payload['vis_config']))}`
        }
        return urlString
      }
    
      // Handle run button click for visualizations on the page
      const handleTabVisUpdate = async (
        _visList = [],
        filterList = { ...selectedFilters },
        type=""
      ) => {
        if (!Array.isArray(_visList)) {
          _visList = [...visList];
        }
        let _updatedFilters = {...updatedFilters};
        
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
        console.log("SAME, NO FILTERS", previousFilters)
        console.log("SAME, NO FILTERS", selectedInnerTab)
        let onlyFields = false;
        if (JSON.stringify(previousFilters) == JSON.stringify(_filteredFilters)) {
          onlyFields = true
        }
        console.log("Selected tab filters", selectedTabFilters)
        let _filters = {};
        _visList = _visList.map((vis) => {
          console.log(vis, "SAME, NO FILTERS")
          if ((onlyFields && vis.index === selectedInnerTab[vis.dashboard_id]) || onlyFields == false || Object.keys(selectedTabFilters).length > 0) {
            console.log("SAME, NO FILTERS",selectedInnerTab)
            vis.isLoading=true;
          }          
          return vis
        });
        setVisList(_visList)
        _filters = await formatFilters(JSON.parse(JSON.stringify(_filteredFilters)));


        setUpdatedFilters(JSON.parse(JSON.stringify(_filteredFilters)))
        // setUpdatedFilters(JSON.parse(JSON.stringify(filterList)));
        updateAppProperties(_filters);
        _filters = {..._filters, ...selectedTabFilters}          
    
        let newVisList = [];
        for (let vis of _visList) {
          if ((onlyFields && vis.index === selectedInnerTab[vis.dashboard_id]) || onlyFields == false || Object.keys(selectedTabFilters).length > 0) {
            const { vis_config, model, view, pivots,total } = vis['query_values'];
            let index = _visList.indexOf(vis)          

            let _fields = [];

            console.log("pivots", pivots)
            
            _fields = vis["selected_fields"];

            let _query = {
              model: model,
              view: view,
              fields: _fields,
              filters: vis["localSelectedFilters"]
                ? { ..._filters, ...vis["localSelectedFilters"] }
                : _filters,
              vis_config,
              pivots,
              total,
              limit:5000
            }
            let _queryVal = {..._query}

            let _urlParams = await createVisualizationUrl(_query)     
            let {id, slug} = await queryValidator(_queryVal);
            vis['query_id'] = id
            vis['query'] = slug
            vis['visUrl'] = _urlParams;
            vis['isLoading'] = false;
            //vis['error'] = _error;
            _visList[index] = vis;
            setVisList(_visList)
          }

        }
        setPreviousFilters({..._filteredFilters})
        //setVisList(newVisList);
        //
      };

      useEffect(() => {
        console.log("Is Loading", isLoading)
      },[isLoading])
    
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
            <SelectionOptions filters={filters} tabFilters={tabFilters}
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
                setUpdatedFilters={setUpdatedFilters}
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

            <TabContext.Provider value={{isLoading, setIsLoading}}>
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

              {layoutProps.layout === "DashboardVisualizations"?
                <DashboardVisualizations 
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

            
          </>
        )}
      </Container>
    </div>
    )
}