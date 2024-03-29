import React, {useContext, useState, useEffect} from "react"
import { Button } from "react-bootstrap"
import { ExtensionContext } from "@looker/extension-sdk-react";
import { getApplication, getApplicationTags, getApplicationTabs, getTabVisualizations, getTabTags, getTabAttributes} from "./../utils/writebackService";

export const AdminPage = () => {

    const [application, setApplication] = useState([])
    const [applicationTags, setApplicationTags] = useState([])

    const extensionContext = useContext(ExtensionContext);
    const sdk = extensionContext.core40SDK;

    const updateContextData = (data) => {
        extensionContext.extensionSDK.saveContextData(data)
      }

    useEffect(() => {
      const initialize = async () => {
        let extensionId = extensionContext.extensionSDK.lookerHostData.extensionId.split("::")[1];
        let _app = await getApplication(extensionId,sdk)
        setApplication(_app)
        let _appTags = await getApplicationTags(_app[0].id, sdk);
        console.log(_appTags)
        setApplicationTags(_appTags)
      }
      initialize();
    },[])

    const handleDataRefresh = async () => {
        let extensionId = extensionContext.extensionSDK.lookerHostData.extensionId.split("::")[1];
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
            t['properties'] = _tabTags.filter(({tag_group}) => tag_group === "property")
            let _tabAttributes = await getTabAttributes(t.id, sdk);
            t['attributes'] = _tabAttributes;
            _tabTagsList = _tabTagsList.concat(_tabTags)
          }
          contextData['tab_tags'] = _tabTagsList
          contextData['tabs'] = _tabs;
        }
        console.log("context", contextData)
        updateContextData(contextData)
      }

    return (
        <div>
            <Button onClick={handleDataRefresh}>Refresh data</Button>
            <h3>Application Info</h3>
            <Table data={application} />
            <h3>Application Tags</h3>
            <Table data={applicationTags} />
        </div>
    )
}

const Table = ({data}) => {
  const [keys, setKeys] = useState({})
  useEffect(() => {
    if (data.length > 0) {
      setKeys(data[0])
    }
  },[])
return (
  <>
  {data?
        <table>
        <thead>
          {Object.keys(keys).map(head => {
            return (
              <th>{head}</th>
            )
          })}
        </thead>
      <tbody>
        {data.map(row => {
          return(
          <tr>
            {Object.values(row).map(val => {
              return (
                <td>{val}</td>
              )
            })}
          </tr>
          )

        })}

      </tbody>
    </table>
  :''}
</>
)
}