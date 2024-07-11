import {Looker40SDK} from "@looker/sdk"
import { scratch_schema, connection } from "./writebackConfig";

const getToken = async (hostUrl,extensionContext) => {
    let _clientId = await extensionContext.extensionSDK.userAttributeGetItem("api_client_id");
    let _clientSecret = await extensionContext.extensionSDK.userAttributeGetItem("api_client_secret")
    console.log("GET TOKEN", _clientId)
    let res = await extensionContext.extensionSDK.fetchProxy(`${hostUrl}:19999/api/4.0/login?client_id=${_clientId}&client_secret=${_clientSecret}`, {
        method:'POST'
    });
    console.log("GET TOKEN", res)    
    _clientId = null
    _clientSecret = null
    if (res['ok']) {
        return res['body']
    }


    return ''
}

export const getSavedFiltersAPIService = async (hostUrl, extensionContext, user, app) => {
    let _token = await getToken(hostUrl, extensionContext);
    let _body = {
        connection_name: connection,
        sql: `SELECT * FROM ${scratch_schema}.cms_bookmarks where user_id = ${user} AND global = false AND application_id = ${app} AND deleted=false AND filter_string != ''`,
    }

    let res = await extensionContext.extensionSDK.fetchProxy(
        `${hostUrl}:19999/api/4.0/sql_queries`,
        {
            method:"POST",
            headers: {
                'Authorization': `Bearer ${_token.access_token}`,
                'Content-type':'application/json'
            },
            body: JSON.stringify(_body)
        }
    )

    if (res.ok) {
        let data = await extensionContext.extensionSDK.fetchProxy(
            `${hostUrl}:19999/api/4.0/sql_queries/${res.body.slug}/run/json`,
            {
                method:"POST",
                headers: {
                    'Authorization': `Bearer ${_token.access_token}`,
                    'Content-type':'application/json'
                }
            }
        )
        res = null
        console.log("GET TOKEN", data)
        return data['body']
    }
}

export const insertSavedFiltersAPIService = async (hostUrl, extensionContext, user, app,id,global,filters,title) => {
    let _token = await getToken(hostUrl, extensionContext);
    let _body = {
        connection_name: connection,
        sql: `insert into ${scratch_schema}.cms_bookmarks values ('${id}',${user},${app},${global},'${filters}','${title}',false);`,
    }

    let res = await extensionContext.extensionSDK.fetchProxy(
        `${hostUrl}:19999/api/4.0/sql_queries`,
        {
            method:"POST",
            headers: {
                'Authorization': `Bearer ${_token.access_token}`,
                'Content-type':'application/json'
            },
            body: JSON.stringify(_body)
        }
    )

    if (res.ok) {
        let data = await extensionContext.extensionSDK.fetchProxy(
            `${hostUrl}:19999/api/4.0/sql_queries/${res.body.slug}/run/json`,
            {
                method:"POST",
                headers: {
                    'Authorization': `Bearer ${_token.access_token}`,
                    'Content-type':'application/json'
                }
            }
        )
        res = null
        console.log("GET TOKEN", data)
        return data['body']
    }
    console.log("GET TOKEN", res)
}

export const removeSavedFiltersAPIService = async (hostUrl, extensionContext, id) => {
    let _token = await getToken(hostUrl, extensionContext);
    let _body = {
        connection_name: connection,
        sql: `UPDATE ${scratch_schema}.cms_bookmarks SET deleted=true where id = '${id}'`,
    }

    let res = await extensionContext.extensionSDK.fetchProxy(
        `${hostUrl}:19999/api/4.0/sql_queries`,
        {
            method:"POST",
            headers: {
                'Authorization': `Bearer ${_token.access_token}`,
                'Content-type':'application/json'
            },
            body: JSON.stringify(_body)
        }
    )

    if (res.ok) {
        let data = await extensionContext.extensionSDK.fetchProxy(
            `${hostUrl}:19999/api/4.0/sql_queries/${res.body.slug}/run/json`,
            {
                method:"POST",
                headers: {
                    'Authorization': `Bearer ${_token.access_token}`,
                    'Content-type':'application/json'
                }
            }
        )
        res = null
        console.log("GET TOKEN", data)
        return data['body']
    }
    console.log("GET TOKEN", res)
}

export const updateSavedFiltersAPIService = async (hostUrl, extensionContext, id, title, global, filterString) => {
    let _token = await getToken(hostUrl, extensionContext);
    let _body = {
        connection_name: connection,
        sql: `UPDATE ${scratch_schema}.cms_bookmarks SET title='${title}', global=${global}, filter_string='${filterString}' WHERE id='${id}';`,
    }

    let res = await extensionContext.extensionSDK.fetchProxy(
        `${hostUrl}:19999/api/4.0/sql_queries`,
        {
            method:"POST",
            headers: {
                'Authorization': `Bearer ${_token.access_token}`,
                'Content-type':'application/json'
            },
            body: JSON.stringify(_body)
        }
    )

    if (res.ok) {
        let data = await extensionContext.extensionSDK.fetchProxy(
            `${hostUrl}:19999/api/4.0/sql_queries/${res.body.slug}/run/json`,
            {
                method:"POST",
                headers: {
                    'Authorization': `Bearer ${_token.access_token}`,
                    'Content-type':'application/json'
                }
            }
        )
        res=null
        console.log("GET TOKEN", data)
        return data['body']
    }
    console.log("GET TOKEN", res)
}