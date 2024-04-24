import React from "react";
import { ReportContainer } from "./components/ReportContainer";

//These are the layout templates that each tab will have
const LayoutProperties =     {
        'Template1':{
            'date range':true,
            'date filter':true,
            'description':true,
            'filters':true,
            'account group':true,
            'account filter':true,
            'fields':true,
            'current selection':true,
            'saved filters':true,
            'layout':'OneTabVisualization'
        },
        'Template3':{
            'date range':true,
            'date filter':true,
            'description':true,
            'filters':true,
            'account group':true,
            'account filter':true,
            'fields':true,
            'current selection':true,
            'saved filters':true,
            'layout':'OneTabVisualizationWithVizAbove'
        },
        'Template4':{
            'date range':true,
            'date filter':true,
            'description':true,
            'filters':true,
            'account group':true,
            'account filter':true,
            'fields':false,
            'current selection':true,
            'saved filters':true,
            'layout':'DashboardVisualizations'
        },
        'Template5':{
            'date range':false,
            'date filter':false,
            'description':false,
            'filters':false,
            'account group':false,
            'account filter':false,
            'fields':false,
            'current selection':false,
            'saved filters':true,
            'layout':'FullLookMLDashboard'
        },
        'Template6':{
            'date range':true,
            'date filter':true,
            'description':true,
            'filters':false,
            'account group':false,
            'account filter':true,
            'fields':false,
            'current selection':true,
            'saved filters':true,
            'layout':'OneTabVisualization'
        },
        'Template7':{
            'date range':true,
            'date filter':true,
            'description':true,
            'filters':false,
            'account group':false,
            'account filter':true,
            'fields':false,
            'current selection':true,
            'saved filters':false,
            'layout':'DashboardVisualizations221'
        },
    }

//LayoutSelector uses the templates and the context data to dynamically create the specific layout for the tab
export const LayoutSelector = ({
    tabProps,
    currentNavTab,
    fields,
    properties,
    isActive,
    tabFilters,
    fieldGroups}) => {

        return <ReportContainer
            className="active"
            isActive={isActive}
            currentNavTab={currentNavTab}
            fields={fields.filter(({tab}) => tab === tabProps.title)}
            properties={properties.filter(({type}) => type == tabProps.properties[0]?.type)}
            config={tabProps.config}
            tabKey={tabProps.route}
            description={{description: <div dangerouslySetInnerHTML={{__html:tabProps.description}} />}}
            tabFilters={tabFilters.filter(({tab}) => tab === tabProps.title)}
            attributes={tabProps.attributes}
            fieldGroups={fieldGroups.filter(({tab}) => tab === tabProps.title)}
            layoutProps={LayoutProperties[tabProps.layout_name]}
            />;
}
