import React, { useState, useContext, useEffect } from "react";
import { Container, Tab, Tabs, Nav } from "react-bootstrap";
import SideForm from "./components/nav/Form.js";
import ToTopButton from "./components/ToTopButton.js";
import NavbarMain from "./components/NavbarMain.js";
import Footer from "./components/Footer.js";
import { ExtensionContext } from "@looker/extension-sdk-react";
import moment from "moment";
import TopNav from "./components/nav/TopNav.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.js";
import {
  getSavedFilterService,
  removeSavedFilterService,
  insertSavedFilterService,
  updateSavedFilterService,
  getApplication, getApplicationTags, getApplicationTabs, getTabVisualizations, getTabTags, getTabAttributes, getApplications
} from "./utils/writebackService.js";
import { LayoutSelector } from "./LayoutSelector.js";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import context from "react-bootstrap/esm/AccordionContext.js";

//Create context for child components to use states
export const ApplicationContext = React.createContext({})


//Main2 is the main component of the app in which it initializes the application, the tabs and all of the attributes associated with the tabs
export const Main2 = () => {
  const extensionContext = useContext(ExtensionContext);
  const sdk = extensionContext.core40SDK;

  const hostUrl = extensionContext.extensionSDK.lookerHostData.hostUrl;
  LookerEmbedSDK.init(hostUrl);

  const [currentNavTab, setCurrentNavTab] = useState("dashboard");

  const [isFetchingLookmlFields, setIsFetchingLookmlFields] = useState(true);

  const [showMenu, setShowMenu] = useState();
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState({});

  const [filters, setFilters] = useState([]);
  const [fields, setFields] = useState([]);
  const [properties, setProperties] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [tabFilters, setTabFilters] = useState([]);
  const [fieldGroups, setFieldGroups] = useState([])

  const [initialLoad, setInitialLoad] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(true);
  //here
  const [selectedFilters, setSelectedFilters] = useState({});
  const [updatedFilters, setUpdatedFilters] = useState({});

  const [tabs, setTabs] = useState([]);
  const [applicationInfo, setApplicationInfo] = useState({});
  const [savedFilters, setSavedFilters] = useState([]);
  const [isDefaultFilters, setIsDefaultFilters] = useState();

  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [navigationList, setNavigationList] = useState([])

  const params = useParams();

  const route = useRouteMatch();

  const history = useHistory();

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  
  const priorityOrder = ['date range', 'date filter','default_date_filter', 'default_filter', 'quick filter', 'account filter', 'account group', 'contract filter', 'filters'];

  const sortPriority = (tags) => {
    return tags.sort((a,b) => {
      let index1 = priorityOrder.indexOf(a['type']);
      let index2 = priorityOrder.indexOf(b['type']);
      return index1 == -1?1:index2== -1? -1 :index1 - index2;
    })
  }

  
  useEffect(() => {
    //getOptionValues(filters,applicationInfo)
    getOptionValues
  },[initialLoad === false])

  // Group each field with their respective tags
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
      console.log("fields", fieldsByTag)
      return fieldsByTag;
    }

    // Creating the tab state along with tab specific tags
    const initializeTabs = async (tabs, tabTags, fieldsByTag, application) => {
      if (tabs) {
        if (tabs.length > 0) {
          let _fields = tabTags.filter(({tag_group}) => tag_group === "fields").map(f => {            
            let _tab = f.title;
            let _tag = f.tag_name;
            let _subTab = f.sub_tab_name;
            return { tab: _tab, fields: fieldsByTag[_tag], sub_tab:_subTab }
          })
          console.log("fields", _fields)

          setFields(_fields);

          let _appProperties = [];
          
          for await (let p of tabTags.filter(
            ({ tag_group }) => tag_group == "property"
          )) {
            if (
              !_appProperties.filter((prop) => prop.type == p.type).length > 0
            ) {
              let _type = p.type;
              let _text = p.att1;
              let _tag = p.tag_name;
              console.log("prop", p)
              let _group = p.tag_group;
              let _fields = fieldsByTag[_tag];
              let _options = "";
              if (p.option === "single_value") {
                //let value = await getValues(_fields[0], {}, application);
                //console.log("prop value", value)
                //_options = value[0];
                _options = {}
              }
              if (_options != []) {
                _appProperties.push({
                  type: _type,
                  text: _text,
                  fields: _fields[0],
                  value: _options,
                  group: _group,
                });
              }
            }
          }
          console.log("properties", _appProperties)
          setProperties(_appProperties);

          let _tabFilters = [];
          for await (let f of tabTags.filter(
            ({ tag_group }) => tag_group === "filters"
          )) {
            let _tab = f.title;
            let _type = f.type;
            let _tag = f.tag_name;
            let _group = f.tag_group;
            let _fields = fieldsByTag[_tag];
            let _subTab = f.sub_tab_name
            let _options = "";
            if (f.option == "single_dimension_value") {
              _options = await getValues(_fields[0],{},application)
            }            
            if (_fields?.length > 0) {
              _tabFilters.push({
                tab: _tab,
                sub_tab:_subTab,
                type: _type,
                fields: _fields[0],
                group: _group,
                options: _options,
              });
            }
          }
          setTabFilters(_tabFilters);


          let _fieldGroups = [];
          for await (let f of tabTags.filter(
            ({ tag_group }) => tag_group === "field groups"
          )) {
            let _tab = f.title;
            let _type = f.type;
            let _tag = f.tag_name;
            let _group = f.tag_group;
            let _fields = fieldsByTag[_tag];
            let _options = "";
            let _label = f.att1;
            let _order = f.att2;
            if (_fields?.length > 0) {
              _fieldGroups.push({
                tab: _tab,
                type: _type,
                fields: _fields,
                group: _group,
                options: _options,
                label: _label,
                order: _order
              });
            }
          }
          setFieldGroups(_fieldGroups);
        }
      }
    };


    //Creating the filter state and adding to the default filters when the app loads
    const createFilters = async (
      applicationTags,
      fieldsByTag,
      application,
      user
    ) => {
      let _filters = [];
      let _defaultSelected = {}
      setInitialLoad(false)
      let sortedTags = sortPriority(applicationTags)
      let _defTags = sortedTags.filter(({type}) => type === "default_filter" || type === "default date filter");
      //_defTags = [].concat(_defTags.map(d => {return d}))
      console.log("tag",_defTags)
      
      //let _defaultFilterFields = fieldsByTag[_defTags?.tag_name]
      let _defaultFilterFields = [];
      _defTags.map(tag => {
        let fields = fieldsByTag[tag?.tag_name]
        fields?.map(f => _defaultFilterFields.push(f))
      })
      console.log("tag", _defaultFilterFields)
      for await (let f of sortedTags.filter(({ tag_group }) => tag_group == "filters")) {
        let _type = f.type;
        let _tag = f.tag_name;
        let _fields = fieldsByTag[_tag];
        
        let _options = []
        if (f.option_type === "date range") {
          if (_fields?.length > 0) {
            _options = { field: _fields[0], values: await getDefaultDateRange() };
          }          
          console.log("date range", _options)
        }
        let _defFilterType = await _defaultFilterFields?.filter((df) => {
          return _fields?.includes(df)
        }
        );
        console.log("default filter type",_defFilterType)
        if (_defFilterType?.length > 0) {
          _defaultSelected[_type] = {};
          await _defFilterType.map((f) => {
            if (f["default_filter_value"] != null) {
              console.log("default fields",f);
              if (_type === "default date filter") {
                _defaultSelected['date filter'][f["name"]] = [f["default_filter_value"]];
              } else {
                _defaultSelected[_type][f["name"]] = [f["default_filter_value"]];
              }              
              console.log("default filters", _defaultSelected)
            } 
            // else if (f['type'] == 'yesno') {
            //   //_defaultSelected[_type][f['name']] = 'yes'
            // }
          });
        } else if (_type == "date range") {
          if (_fields?.length > 0) {
            _defaultSelected[_type] = {[_options['field']['name']]:_options.values}
          }          
        } else {
          _defaultSelected[_type] = {};
        }
        console.log("default filters", _tag)
        console.log("default filters", fieldsByTag[_tag])
        if (fieldsByTag[_tag]) {
          _filters.push({
            type: _type,
            fields: fieldsByTag[_tag],
            options: _options,
            option_type: f.option_type,
          });
        }
      }
      let _nonStatedFilterFields = []
      _defaultFilterFields?.map(df => {
          let ret = Object.keys(_defaultSelected).some(key => {
            return _defaultSelected[key].hasOwnProperty([df['name']])
          })
          console.log("default filter", ret)
          if (!ret) {
            _nonStatedFilterFields.push(df)           
            if (df['default_filter_value'] != null) {
                if (!_defaultSelected.hasOwnProperty('default')) {
                  _defaultSelected['default'] = {}
                }
                _defaultSelected['default'][df['name'] = df['default_filter_value']]
            }
          }
      })
      
      console.log("current default filters", _defaultSelected)
      console.log("current default filters", _nonStatedFilterFields)
      if (_nonStatedFilterFields.length > 0) {
        _filters.push({
          type:'default',
          fields:_nonStatedFilterFields,
          options:null,
          option_type:null
        })
      }
      console.log("default filters", _nonStatedFilterFields)
      console.log("filters",_filters)
      setFilters(_filters);

      getSavedFilters(application, user, _filters);
      console.log("defaultSelected", _defaultSelected)
      setSelectedFilters(_defaultSelected);


      //setTimeout(() => getOptionValues(_filters, application), 1000)
      getOptionValues(_filters, application);
    };



    //Creating the parameter to be able to switch between Looker based parameters for a visualization
    const createParameters = async (applicationTags, fieldsByTag) => {
      let _appToggles = [];
      for await (let p of applicationTags.filter(
        ({ tag_group }) => tag_group == "toggle"
      )) {
        //console.log("parameters", p)
        let _tag = p.tag_name;
        let _fields = fieldsByTag[_tag];
        console.log("parameters",_fields)
        let _options = [];
        let _type = p.type;
        if (_fields?.length > 0) {
          for await (let field of _fields) {
            _options = field?.enumerations;
            _appToggles.push({
              type: _type,
              fields: field,
              value: _options,
            });
          }

        }
      }
      console.log("parameters", _appToggles)
      setParameters(_appToggles);
    };

    //Initialize the global tags for the application such as filters and parameters
    const initializeAppTags = async (
      applicationTags,
      fieldsByTag,
      application,
      user
    ) => {
      if (applicationTags) {
        createFilters(applicationTags, fieldsByTag, application, user);
        createParameters(applicationTags, fieldsByTag);
      }
    };

    //Get the dimensions, measures and parameters from the LookML
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
    };

    let intervalId

    const startTimer = (_user) => {
      if (!intervalId) {
        let _intervalId = setInterval(() => killQuery(_user), 60000)
        intervalId = _intervalId
      } 
    }
  
    const killQuery = async (_user) => {
      console.log("KILL", _user)
      let _runningQueries = await sdk.ok(sdk.all_running_queries());
      let _currentQueries = _runningQueries.filter(query => {
        let created = moment(query.created_at)   
        let now = moment();
        let duration = moment.duration(now.diff(created));
        let minutes = duration.asMinutes();
       return _user.id == query.user.id && (query.source=="api4" || query.source=="private_embed") && minutes >= 3;
      })

      console.log("kill",_currentQueries)
      if (_currentQueries?.length > 0) {
        _currentQueries?.map(query => {
          sdk.ok(sdk.kill_query(query.query_task_id));
        })
      }
    }

    //Initial process to load the context data to get the application information that was in the database
    //Also, starts the creation of the tabs and create the application tags
    const initialize = async () => {
      //let fieldsByTag
      let userInfo = await getUser();
      setUser(userInfo);
      startTimer(userInfo)
      updateContext()
      let contextData = getContextData();
      if (contextData) {
        let { application, application_tags, tabs, tab_tags, navList, fieldsByTag } = contextData;
        if (navList) {
          setNavigationList(navList)
        }
        if (tabs) {
          if (tabs.length > 0) {
            setTabs(tabs);
            if (!params.path) {
              history.push(tabs[0].route);
            }
          }
        }
        setApplicationInfo(application);
        console.log("fields by Tag", fieldsByTag);
        let updatedFields = false
        if (!fieldsByTag) {
          let _fieldsByTag = await fetchLookMlFields(
            application.model,
            application.explore
          );
          updatedFields = true
          contextData['fieldsByTag'] = _fieldsByTag
          updateContextData(contextData)
          fieldsByTag = _fieldsByTag
        }
     
        setIsFetchingLookmlFields(false);
        initializeTabs(tabs, tab_tags, fieldsByTag, application);
        initializeAppTags(application_tags, fieldsByTag, application, userInfo);

        if (!updatedFields) {
          let _fieldsByTag = await fetchLookMlFields(
            application.model,
            application.explore
          );
          contextData['fieldsByTag'] = _fieldsByTag
          updateContextData(contextData)
        }

      }
      }
    ;

    try {
      initialize();
    } catch (e) {
      console.error("Error fetching Looker filters and fields", e);
    }
  }, []);

  const getUser = async () => {
    return await sdk.ok(sdk.me());
  };

  const updateContext = () => {
    handleDataRefresh()
  }

  const waiting = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  //Generic function to get values for specific fields
  const getFilterValues = async (field, filters, application = null) => {
    let _application = application;
    if (_application == null) {
      _application = applicationInfo;
    }
    try {
      let {id} = await sdk
        .ok(
          sdk.create_query( {
              model: _application.model,
              view:field['suggest_explore'],
              fields: [field['suggest_dimension']],
              filters: filters,
              limit: 500,
            }
          )
        )
        .catch((ex) => {
          console.log(ex)
          return [];
        });
      if (id) {
        let query_task = await sdk.ok(sdk.create_query_task({body:{result_format:'json', query_id:id}}))
        let loading = false;
        let options = []
        try {
          for (let i = 0 ;loading === false; i++) {
            let res = await sdk.ok(sdk.query_task(query_task.id));
            console.log("task status", res)
            if (res.status === "complete") {                
              options = await sdk.ok(sdk.query_task_results(query_task.id));
              loading = true;
              break;
            }
            if (res.status === "error") {
              loading= true;
            }
            await waiting(5000);
          } 
          return options
        } catch {
          return []
        }
      }
    } catch {
      return [];
    }
  };

  //Once the filter state get created, this gets run to get the values of each field to be placed in the dropdowns
  const getOptionValues = async (_filters, application) => {
    console.log("Option Values", _filters)
    //let _filters = [];
    let filterArr = [..._filters];
    for (let f of sortPriority(filterArr)) {
      let _options = [];
      if (f.option_type === "fields") {
        _options = f.fields;
      }
      if (f.option_type === "values") {
        //updateFilterOptions(f)
        // _options = await Promise.all(f.fields.map(async (field) => {
        //   console.log("total filters values field", field);
        //   let values = await getFilterValues(field,{},application);
        //   console.log("Total filters values", values)
        //   return {field:field, values:values}
        // }))
        setIsFilterLoading(true)
        for await(let field of f.fields) {
          
          console.log("total filters values field", field);
          let values = await getFilterValues(field, {}, application);
          console.log("Total filters values", values)
          _options.push({ field: field, values: values });
        }
        setIsFilterLoading(false)
      }
      if (f.option_type === "single_dimension_value") {
        if (f.fields?.length > 0) {
          console.log(f.fields[0])
          console.log('single dimension', f)
          //Removed for Account Groups
          if (f.type !== "account group") {              
            let value = await getFilterValues(f.fields[0], {}, application);
            _options = { field: f.fields[0], values: value };
          }
        }
      }
      if (f.option_type === "date range") {
        _options = f.options;
      }
      if (f.option_type === "suggestions") {
        for await (let field of f.fields) {
          let values = field.suggestions?.map((s) => {
            return { [field["name"]]: s };
          });
          _options.push({ field: field, values: values });
        }
      }

      //if (f.option_type != "values") {
        f["options"] = _options;
        setFilters(prev => [...prev,f])
      //}

      //_filters.push(f);
    }
    //setFilters(_filters);
  };

  //Adding a default to the date range
  const getDefaultDateRange = () => {
    let prevMonth = moment().subtract(1, "month");
    let startOfMonth = prevMonth
      .startOf("month")
      .format("YYYY-MM-DD")
      .toString();
    let endOfMonth = prevMonth.endOf("month").format("YYYY-MM-DD").toString();
    return `${startOfMonth} to ${endOfMonth}`;
  };

  //Generic function to get values for specific fields
  const getValues = (field, filters, application = null) => {
    let _application = application;
    if (_application == null) {
      _application = applicationInfo;
    }
    try {
      return sdk
        .ok(
          sdk.run_inline_query({
            result_format: "json",
            body: {
              model: _application.model,
              view:field['suggest_explore'],
              fields: [field['suggest_dimension']],
              //view: _application.explore,
              //fields: [field["name"]],
              filters: filters,
              limit: 500,
            },
            apply_formatting:true,
            cache:true
          }, {timeout:300})
        )
        .catch((ex) => {
          console.log(ex)
          return [];
        });
    } catch {
      return [];
    }
  };

  //Function that updates the properties that are shown in the tabs
  const updateAppProperties = async (filters) => {
    console.log("property check filters", filters)
    setPropertiesLoading(true)
    let newProps = [];
    for await (let prop of properties) {
      let _value = await getFilterValues(prop["fields"], filters);
      prop.value = _value[0];
      console.log("property check", prop)
      newProps.push(prop);
    }
    console.log("prop filters", newProps)
    setProperties(newProps);
    setPropertiesLoading(false)
  };

  //Get the extension context data
  const getContextData = () => {
    return extensionContext.extensionSDK.getContextData();
  };

  //Load the saved filters into the app based on user id
  const getSavedFilters = async (
    app = applicationInfo,
    userInfo = user,
    _filters = filters
  ) => {
    let res = await getSavedFilterService(app.id, userInfo.id, sdk);
    const _newFilters = await parseSavedFilters(res, _filters);
    setSavedFilters(_newFilters);
  };

  //Make sure the filter fields are available to show for the saved filters to use
  const parseSavedFilters = async (savedFilters, _filters) => {
    const _newFilters = savedFilters?.map((sf) => {
      const _filter = {};
      const _toolTip = [];
      if (sf["filter_string"] != "") {
        for (const [key, value] of Object.entries(
          JSON.parse(sf["filter_string"])
        )) {
          if (Object.keys(value).length > 0) {
            let _fields = _filters.find(({ type }) => type === key);
            for (const _fieldName of Object.keys(value)) {
              let _field = _fields["fields"].find(({ name }) => {
                return _fieldName === name;
              });
              if (_field) {
                _filter[key] = {};
                _filter[key][_fieldName] = value[_fieldName];
                _toolTip.push(
                  `${_field["label_short"]} = ${value[_fieldName]}`
                );
              }
            }
          } else {
            _filter[key] = {};
          }
        }
      }
      sf["filter_string"] = _filter;
      sf["tooltip"] = _toolTip;
      return sf;
    });
    return _newFilters;
  };

  //Remove saved filters
  const removeSavedFilter = async (id) => {
    await removeSavedFilterService(id, sdk).then((r) => getSavedFilters());
    return true
  };

  //Create or update a saved filter
  const upsertSavedFilter = async (type, obj) => {
    if (type == "update") {
      await updateSavedFilterService(obj.id, obj.title, obj.global, sdk).then(
        (r) => getSavedFilters()
      );
      return true
    } else if (type == "insert") {
      await insertSavedFilterService(
        obj.id,
        user.id,
        applicationInfo.id,
        JSON.stringify(updatedFilters),
        obj.title,
        obj.global,
        sdk
      ).then((r) => getSavedFilters());
      return true
    }
  };

  const updateContextData = (data) => {
    extensionContext.extensionSDK.saveContextData(data)
  }

  const handleDataRefresh = async () => {
    let extensionId = extensionContext.extensionSDK.lookerHostData.extensionId.split("::")[1];
    let _context = await getContextData();
    let contextData = {}
    try {
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
          t['properties'] = _tabTags.filter(({tag_group}) => tag_group === "property")
          let _tabAttributes = await getTabAttributes(t.id, sdk);
          t['attributes'] = _tabAttributes;
          _tabTagsList = _tabTagsList.concat(_tabTags)
        }
        contextData['tab_tags'] = _tabTagsList
        contextData['tabs'] = _tabs;
      }

      let applications = await getApplications(sdk)
      //setNavList(applications)
      if (applications.length > 0) {
        let appList = []
        for await (let apps of applications) {
          let tabs = await getApplicationTabs(apps['id'], sdk)
          apps['tabs'] = tabs
          appList.push(apps)
        }
        //setNavList(appList);
      }
      contextData['navList'] = applications
      contextData['fieldsByTag'] = _context['fieldsByTag']
      console.log("context", contextData)
      updateContextData(contextData)
    } catch (ex) {
      console.log("Context failed to update: "+ ex)
    }

  }

  return (
    <>
    <div className="mainHeight">
      <NavbarMain user={user} />
      <Container fluid className="mt-50 padding-0">
        <ApplicationContext.Provider
          value={{application:applicationInfo,
            filters:filters,
            parameters:parameters,
            updateAppProperties:updateAppProperties,
            isFetchingLookmlFields:isFetchingLookmlFields,
            showMenu:showMenu,
            setShowMenu:setShowMenu,
            selectedFilters:selectedFilters,
            setSelectedFilters:setSelectedFilters,
            updatedFilters:updatedFilters,
            setUpdatedFilters:setUpdatedFilters,
            initialLoad:initialLoad,
            setInitialLoad:setInitialLoad,
            keyword:keyword,
            handleChangeKeyword:handleChangeKeyword,
            savedFilters:savedFilters,
            removeSavedFilter:removeSavedFilter,
            upsertSavedFilter:upsertSavedFilter,
            propertiesLoading:propertiesLoading,
            isFilterLoading
            }}>
          <TopNav navList={navigationList}/>
          <div className={showMenu ? "largePadding" : "slideOver largePadding"}>
            <div id="nav2">
              <Tab.Container mountOnEnter
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
                        fields={fields}
                        properties={properties}
                        tabFilters={tabFilters}
                        fieldGroups={fieldGroups}
                      />
                    )}
                  </>
                </Tab.Content>
              </div>
            </div>
          </div>
        </ApplicationContext.Provider>
      </Container>
      <ToTopButton />
      <SideForm />
    </div>

    <Footer />
    </>
  );
};
