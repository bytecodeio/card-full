import React, {useContext, useState, useEffect} from "react"
import { Button, Spinner } from "react-bootstrap"
import { ExtensionContext } from "@looker/extension-sdk-react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { LoadingComponent } from "./LoadingComponent";

export const PrintPage = () => {
  const extensionContext = useContext(ExtensionContext)
  const sdk = extensionContext.core40SDK;

  const searchParams = useLocation().search;
  const [url, setUrl] = useState("")
  const [initialLoad, setInitialLoad] = useState(false)

    useEffect(() => {    

      const initialize = async () => {
        if (searchParams) {
          setInitialLoad(true)
          const params = new URLSearchParams(searchParams);
          let _qid = params.get('qid');
          let _type = params.get('type');
          await getUrl(_qid,_type)
        }
      }
      initialize();
    },[])

    const getUrl = async (_qid, _type) => {
      console.log("qid", _qid)
      let renderLoaded = false;
      let res;
      const {id} = await sdk.ok(sdk.create_query_render_task(_qid,_type,1600,800));
      do {
          console.log('checking')
          let {status} = await sdk.ok(sdk.render_task(id));
          if (status === "success") {
              console.log('success')
              res = await sdk.ok(sdk.render_task_results(id))
              renderLoaded = true;
          }
      } while (renderLoaded==false)
      // const {id} = await sdk.ok(sdk.query_for_slug(_qid));
      // console.log("id",id)
      // //const res = await sdk.ok(sdk.run_inline_query({value}, {timeout:3600}));
      // const res = await sdk.ok(sdk.run_query({query_id:id, result_format:_type, limit:5000}));
      
      let _url = URL.createObjectURL(res)
      setUrl(_url)
      setInitialLoad(false)
    }

    const handlePrint =() => {
      window.print()
    }

     return (
        <div>
            {initialLoad?            
            <LoadingComponent />
            :
            <img src={url} onLoad={handlePrint} />
            }
            
        </div>
    )
}

const LoadingSpace = (() => 
  <div className="print-space">
    <Spinner />
  </div>
)